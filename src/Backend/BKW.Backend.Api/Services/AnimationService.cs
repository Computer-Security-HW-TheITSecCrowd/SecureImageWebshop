using BKW.Backend.Dal.Animations;
using BKW.Backend.Dal.Exceptions;
using BKW.Backend.Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
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
            var availableAnimations = getAvailableAnimations(animations);
            var filteredAnimationsBySearch = getFilteredAnimationsBySearch(availableAnimations, search);

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

        public async Task<MemoryStream> GetFile(string id)
        {
            try
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", id);
                var memory = new MemoryStream();
                using (var stream = new FileStream(path, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;
                return memory;
            }
            catch (Exception e)
            {
                throw new FileDownloadException(e.Message);
            }
        }

        public async Task<Animation> CreateAnimation(Animation animation, IFormFile file)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

            var newAnimation = await _animationRepository.Insert(animation);

            try
            {
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                using (Stream stream = new FileStream(Path.Combine(path, newAnimation.Id), FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            catch (Exception e)
            {
                await _animationRepository.RemoveAnimation(newAnimation.Id);
                throw new FileUploadException(e.Message);
            }

            return newAnimation;
        }

        public async Task DisableAnimation(string id)
        {
            var animation = await GetAnimation(id);

            if (animation == null)
                throw new AnimationNotFoundException();

            animation.Banned = true;

            await _animationRepository.Update(id, animation);
        }

        public async Task Purchase(string purchaserId, string animationId)
        {
            await _animationRepository.InsertPurchase(purchaserId, animationId);
        }

        private ICollection<Animation> getAvailableAnimations(ICollection<Animation> animations)
        {
            return animations.Where(a => a.Banned == false).ToList();
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
