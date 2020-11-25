using System.Collections.Generic;
using System.Threading.Tasks;
using BKW.Backend.Domain.Models;

namespace BKW.Backend.Dal.Animations
{
    public interface IAnimationRepository
    {
        Task<ICollection<Animation>> FindAll(int count);
        Task<Animation> FindById(string id);
        Task<ICollection<Animation>> FindByPurchaserId(string id, int count);
        Task<ICollection<Animation>> FindByOwnerId(string id, int count);
        Task<Animation> Insert(Animation animation);
        Task Update(string id, Animation animation);
        Task InsertPurchase(string purchaserId, string animationId);
    }
}
