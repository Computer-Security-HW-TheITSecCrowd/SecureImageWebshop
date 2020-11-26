using BKW.Backend.Api.Requests;
using BKW.Backend.Api.Responses;
using BKW.Backend.Api.Services;
using BKW.Backend.Dal.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class AnimationController : ControllerBase
    {
        private readonly IAnimationService _animationService;
        private readonly ICommentService _commentService;

        public AnimationController(IAnimationService animationService, ICommentService commentService)
        {
            _animationService = animationService;
            _commentService = commentService;
        }

        private string getUserId() => User.FindFirst("Id").Value;
        private string getUserName() => User.FindFirst("Username").Value;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnimationResponse>>> GetAnimations([FromQuery] string count, [FromQuery] string? search)
        {
            if (!Int32.TryParse(count, out int parsedCount))
                return BadRequest();

            var animations = await _animationService.GetAnimations(parsedCount, search);
            var animationsResponse = animations.Select(animation => new AnimationResponse(animation));

            return Ok(animationsResponse);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AnimationResponse>> GetAnimation(string id)
        {
            var animation = await _animationService.GetAnimation(id);

            if (animation == null)
                return NotFound();

            return Ok(new AnimationCommentsResponse(animation));
        }

        [HttpGet("{id}/file")]
        [Authorize(Policy = "Customer")]
        public async Task<ActionResult<byte[]>> Download(string id)
        {
            return StatusCode(StatusCodes.Status501NotImplemented);
        }

        [HttpPost]
        [Authorize(Policy = "Customer")]
        public async Task<ActionResult> Upload([FromBody] UploadRequest request)
        {
            var userId = getUserId();

            var newAnimation = request.ToModel(userId);
            await _animationService.CreateAnimation(newAnimation);

            // TODO: save file in folder structure

            return CreatedAtAction(nameof(GetAnimation), new { id = newAnimation.Id }, new AnimationResponse(newAnimation));
        }

        [HttpPost("{id}/disable")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> DisableAnimation(string id)
        {
            try
            {
                await _animationService.DisableAnimation(id);
            }
            catch (AnimationNotFoundException e)
            {
                return NotFound(e.Message);
            }
            
            return NoContent();
        }

        [HttpPost("{id}/comments")]
        [Authorize(Policy = "Customer")]
        public async Task<ActionResult> CreateComment(string id, [FromBody] CommentRequest request)
        {
            var username = getUserName();

            var newComment = request.ToModel(username, id);

            try
            {
                await _commentService.CreateComment(newComment);
            }
            catch (AnimationNotFoundException e)
            {
                return NotFound(e.Message);
            }

            return CreatedAtAction(nameof(CreateComment), new { id = newComment.Id }, new CommentResponse(newComment));
        }

        [HttpDelete("{animId}/comments/{commentId}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> DeleteComment(string animId, string commentId)
        {
            try
            {
                await _commentService.DeleteComment(animId, commentId);

                return NoContent();
            }
            catch (CommentNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
