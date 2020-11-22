using BKW.Backend.Domain.Models;
using System;

namespace BKW.Backend.Api.Requests
{
    public class CommentRequest
    {
        public string Content { get; set; }

        public Comment ToModel(string createdBy, string animId)
        {
            return new Comment
            {
                CreatedBy = createdBy,
                CreatedAt = DateTime.Now,
                AnimationId = animId,
                Content = Content
            };
        }
    }
}
