using BKW.Backend.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services
{
    public interface IAnimationService
    {
        Task<ICollection<Animation>> GetAnimations(int count);
        Task<Animation> GetAnimation(string id);
        Task<ICollection<Animation>> GetAnimationsForPurchaser(string id);
        Task<ICollection<Animation>> GetAnimationsForOwner(string id);
        Task<Animation> CreateAnimation(Animation animation);
        Task DisableAnimation(string id, Animation animation);
        Task Purchase(string purchaserId, string animationId);
    }
}
