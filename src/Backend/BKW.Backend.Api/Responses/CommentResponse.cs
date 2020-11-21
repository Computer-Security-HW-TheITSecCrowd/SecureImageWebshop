using BKW.Backend.Domain.Models;
using System;

namespace BKW.Backend.Api.Responses
{
    public class CommentResponse
    {
        public CommentResponse(Comment comment)
        {
            Id = comment.Id;
            CreatedBy = comment.CreatedBy;
            CreatedAt = comment.CreatedAt;
            AnimationId = comment.AnimationId;
            Content = comment.Content;
        }

        public string Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AnimationId { get; set; }
        public string Content { get; set; }
    }
}
