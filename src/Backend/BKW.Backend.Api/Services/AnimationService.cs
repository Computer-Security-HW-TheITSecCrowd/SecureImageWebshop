using BKW.Backend.Dal.Animations;
using BKW.Backend.Dal.Exceptions;
using BKW.Backend.Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services
{
    public class AnimationService : IAnimationService
    {
        private readonly IAnimationRepository _animationRepository;

        private readonly string pathCaffs = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Caffs");
        private readonly string pathPngs = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Pngs");

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

        public async Task<bool> IsAnimationPurchasedOrOwnedByUser(Animation animation, string userId)
        {
            var purchasedAnimations = await _animationRepository.FindByPurchaserId(userId);
            var ownedAnimations = await _animationRepository.FindByOwnerId(userId);

            var purchasedOrOwnedAnimations = purchasedAnimations.Concat(ownedAnimations);

            return purchasedOrOwnedAnimations.Any(a => a.Id.Equals(animation.Id));
        }

        public async Task<MemoryStream> GetCaffFile(string id)
        {
            return await getFile(id, pathCaffs);
        }

        public async Task<MemoryStream> GetPngFile(string id)
        {
            return await getFile(id, pathPngs);
        }

        public async Task<Animation> CreateAnimation(Animation animation, IFormFile file, Bitmap image)
        {
            var newAnimation = await _animationRepository.Insert(animation);

            try
            {
                // save caff
                if (!Directory.Exists(pathCaffs))
                {
                    Directory.CreateDirectory(pathCaffs);
                }

                using (Stream stream = new FileStream(Path.Combine(pathCaffs, newAnimation.Id), FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // save png
                if (!Directory.Exists(pathPngs))
                {
                    Directory.CreateDirectory(pathPngs);
                }

                image.Save(Path.Combine(pathPngs, newAnimation.Id), ImageFormat.Png);
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

        private async Task<MemoryStream> getFile(string id, string path)
        {
            try
            {
                var pathFile = Path.Combine(path, id);
                var memory = new MemoryStream();
                using (var stream = new FileStream(pathFile, FileMode.Open))
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
    }
}
