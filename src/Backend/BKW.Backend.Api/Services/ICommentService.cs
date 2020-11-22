using BKW.Backend.Domain.Models;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services
{
    public interface ICommentService
    {
        Task<Comment> CreateComment(Comment comment);
        Task DeleteComment(string animId, string commentId);
    }
}
