using BKW.Backend.Api.Requests;
using BKW.Backend.Api.Responses;
using BKW.Backend.Api.Services;
using BKW.Backend.Dal.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IAnimationService _animationService;

        public UserController(IAnimationService animationService)
        {
            _animationService = animationService;
        }

        private string getUserId() => User.FindFirst("Id").Value;

        [HttpGet("animations")]
        [Authorize(Policy = "Customer")]
        public async Task<ActionResult<AnimationResponse>> GetAnimations([FromQuery] string count, [FromQuery] string? search)
        {
            if (!Int32.TryParse(count, out int parsedCount))
                return BadRequest();

            var userId = getUserId();

            var ownedAnimationsByUser = await _animationService.GetAnimationsForOwner(userId, parsedCount, search);
            var purchasedAnimationsByUser = await _animationService.GetAnimationsForPurchaser(userId, parsedCount, search);
            var animations = ownedAnimationsByUser.Concat(purchasedAnimationsByUser);
            
            var animationsResponse = new List<AnimationResponse>();

            foreach (var animation in animations)
            {
                animationsResponse.Add(new AnimationResponse(animation));
            }

            return Ok(animationsResponse);
        }

        [HttpPut("animations")]
        [Authorize(Policy = "Customer")]
        public async Task<ActionResult> Purchase([FromBody] PurchaseRequest request)
        {
            var userId = getUserId();

            try
            {
                await _animationService.Purchase(userId, request.AnimId);
            }
            catch (AnimationAlreadyPurchasedException e)
            {
                return Conflict(e.Message);
            }
            catch (AnimationAlreadyOwnedException e)
            {
                return BadRequest(e.Message);
            }
            catch (AnimationNotFoundException e)
            {
                return NotFound(e.Message);
            }

            return NoContent();
        }
    }
}
