using BKW.Backend.Domain.Models;
using System.Threading.Tasks;

namespace BKW.Backend.Dal.Comments
{
    public interface ICommentRepository
    {
        Task<Comment> Insert(Comment comment);
        Task Remove(string animId, string commentId);
    }
}
