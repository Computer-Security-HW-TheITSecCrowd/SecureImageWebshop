using BKW.Backend.Dal.Data;
using BKW.Backend.Dal.Exceptions;
using BKW.Backend.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Dal.Comments
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;

        public CommentRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Comment> Insert(Comment comment)
        {
            var animation = await _context.Animations
                .Where(a => a.Id == comment.AnimationId)
                .SingleOrDefaultAsync();

            if (animation == null)
                throw new AnimationNotFoundException();

            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();

            comment.Animation = animation;

            return comment;
        }

        public async Task Remove(string animId, string commentId)
        {
            var comment = await _context.Comments
                .Where(c => c.AnimationId == animId)
                .Where(c => c.Id == commentId)
                .SingleOrDefaultAsync();

            if (comment == null)
                throw new CommentNotFoundException();
            
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
        }
    }
}
