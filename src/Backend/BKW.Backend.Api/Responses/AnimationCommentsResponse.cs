using BKW.Backend.Domain.Models;
using System.Collections.Generic;
using System.Linq;

namespace BKW.Backend.Api.Responses
{
    public class AnimationCommentsResponse : AnimationResponse
    {
        public List<CommentResponse> Comments { get; set; }

        public AnimationCommentsResponse(Animation animation) : base(animation)
        {
            Comments = animation.Comments.Select(comment => new CommentResponse(comment)).ToList();
        }
    }
}
