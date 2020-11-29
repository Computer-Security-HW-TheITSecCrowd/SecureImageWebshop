using BKW.Backend.Domain.Models;
using Google.Protobuf.Collections;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace BKW.Backend.Api.Responses
{
    public class AnimationCommentsResponse : AnimationResponse
    {
        public List<CommentResponse> Comments { get; set; }
        public bool PurchasedOrOwnedByUser { get; set; }

        public AnimationCommentsResponse(Animation animation, bool purchasedOrOwnedByUser) : base(animation)
        {
            Comments = animation.Comments.Select(comment => new CommentResponse(comment)).ToList();
            PurchasedOrOwnedByUser = purchasedOrOwnedByUser;
        }
    }
}
