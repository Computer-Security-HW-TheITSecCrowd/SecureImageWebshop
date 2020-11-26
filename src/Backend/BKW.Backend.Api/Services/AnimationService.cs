using BKW.Backend.Dal.Animations;
using BKW.Backend.Domain.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services
{
    public class AnimationService : IAnimationService
    {
        private readonly IAnimationRepository _animationRepository;

        public AnimationService(IAnimationRepository animationRepository)
        {
            _animationRepository = animationRepository;
        }

        public async Task<ICollection<Animation>> GetAnimations(int count, string? search)
        {
            var animations = await _animationRepository.FindAll();
            var filteredAnimationsBySearch = getFilteredAnimationsBySearch(animations, search);

            return takeFirstNFromAnimations(filteredAnimationsBySearch, count);
        }

        public async Task<Animation> GetAnimation(string id)
        {
            return await _animationRepository.FindById(id);
        }

        public async Task<ICollection<Animation>> GetAnimationsForPurchaser(string id, int count, string? search)
        {
            var animations = await _animationRepository.FindByPurchaserId(id);
            var filteredAnimationsBySearch = getFilteredAnimationsBySearch(animations, search);

            return takeFirstNFromAnimations(filteredAnimationsBySearch, count);
        }

        public async Task<ICollection<Animation>> GetAnimationsForOwner(string id, int count, string? search)
        {
            var animations = await _animationRepository.FindByOwnerId(id);
            var filteredAnimationsBySearch = getFilteredAnimationsBySearch(animations, search);

            return takeFirstNFromAnimations(filteredAnimationsBySearch, count);
        }

        public async Task<Animation> CreateAnimation(Animation animation)
        {
            return await _animationRepository.Insert(animation);
        }

        public async Task DisableAnimation(string id, Animation animation)
        {
            animation.Banned = true;

            await _animationRepository.Update(id, animation);
        }

        public async Task Purchase(string purchaserId, string animationId)
        {
            await _animationRepository.InsertPurchase(purchaserId, animationId);
        }

        private ICollection<Animation> getFilteredAnimationsBySearch(ICollection<Animation> animations, string search)
        {
            if (search != null && search != string.Empty)
                return animations.Where(a => a.Title.ToLower().Contains(search.ToLower())).ToList();

            return animations;
        }

        private ICollection<Animation> takeFirstNFromAnimations(ICollection<Animation> animations, int n)
        {
            return animations.Take(n).ToList();
        }
    }
}
