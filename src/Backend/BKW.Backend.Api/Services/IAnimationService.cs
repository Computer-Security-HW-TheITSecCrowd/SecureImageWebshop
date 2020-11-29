using BKW.Backend.Domain.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services
{
    public interface IAnimationService
    {
        Task<ICollection<Animation>> GetAnimations(int count, string? search);
        Task<Animation> GetAnimation(string id);
        Task<ICollection<Animation>> GetAnimationsForPurchaser(string id, int count, string? search);
        Task<ICollection<Animation>> GetAnimationsForOwner(string id, int count, string? search);
        Task<bool> IsAnimationPurchasedOrOwnedByUser(Animation animation, string userId);
        Task<MemoryStream> GetCaffFile(string id);
        Task<MemoryStream> GetPngFile(string id);
        Task<Animation> CreateAnimation(Animation animation, IFormFile file, Bitmap image);
        Task DisableAnimation(string id);
        Task Purchase(string purchaserId, string animationId);
    }
}
