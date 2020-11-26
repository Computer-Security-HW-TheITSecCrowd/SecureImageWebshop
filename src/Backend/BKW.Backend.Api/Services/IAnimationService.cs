using BKW.Backend.Domain.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
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
        Task<MemoryStream> GetFile(string id);
        Task<Animation> CreateAnimation(Animation animation, IFormFile file);
        Task DisableAnimation(string id);
        Task Purchase(string purchaserId, string animationId);
    }
}
