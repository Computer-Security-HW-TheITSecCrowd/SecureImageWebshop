using BKW.Backend.Dal.Comments;
using BKW.Backend.Domain.Models;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;

        public CommentService(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        public async Task<Comment> CreateComment(Comment comment)
        {
            return await _commentRepository.Insert(comment);
        }

        public async Task DeleteComment(string animId, string commentId)
        {
            await _commentRepository.Remove(animId, commentId);
        }
    }
}
