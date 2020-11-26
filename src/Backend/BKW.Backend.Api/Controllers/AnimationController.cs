using BKW.Backend.Api.Requests;
using BKW.Backend.Api.Responses;
using BKW.Backend.Api.Services;
using BKW.Backend.Api.Services.ParserServices;
using BKW.Backend.Dal.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
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
        private readonly IParserService _parserService;

        public AnimationController(IAnimationService animationService, ICommentService commentService, IParserService parserService)
        {
            _animationService = animationService;
            _commentService = commentService;
            _parserService = parserService;
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
        public async Task<ActionResult> Download(string id)
        {
            var animation = await _animationService.GetAnimation(id);

            if (animation == null)
                return NotFound();

            var userId = getUserId();
            if (!animation.OwnerId.Equals(userId) && !animation.Purchases.Any(p => p.PurchaserId.Equals(userId)))
                return Forbid();

            try
            {
                var memory = await _animationService.GetFile(id);
                return File(memory, "application/octet-stream", animation.Title);
            }
            catch (FileDownloadException e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost]
        [Authorize(Policy = "Customer")]
        public async Task<ActionResult> Upload([FromForm] UploadRequest request)
        {
            if (request.Title == null || request.FormFile == null)
                return BadRequest("Title and file have to be given");

            var userId = getUserId();

            var animation = request.ToModel(userId);
            var formFile = request.FormFile;

            try
            {
                await _animationService.CreateAnimation(animation, formFile);
            }
            catch(FileUploadException e)
            {
                return BadRequest(e.Message);
            }

            return CreatedAtAction(nameof(GetAnimation), new { id = animation.Id }, new AnimationResponse(animation));
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
