﻿using BKW.Backend.Dal.Data;
using BKW.Backend.Dal.Exceptions;
using BKW.Backend.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Dal.Animations
{
    public class AnimationRepository : IAnimationRepository
    {
        private readonly AppDbContext _context;

        public AnimationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ICollection<Animation>> FindAll()
        {
            var animations = await _context.Animations.AsNoTracking()
                .Include(a => a.Owner)
                .ToListAsync();

            return animations;
        }

        public async Task<Animation> FindById(string id)
        {
            var animation = await _context.Animations.AsNoTracking()
                .Include(a => a.Owner)
                .Include(a => a.Comments)
                .Include(a => a.Purchases)
                .Where(a => a.Id.Equals(id))
                .SingleOrDefaultAsync();

            return animation;
        }

        public async Task<ICollection<Animation>> FindByPurchaserId(string id)
        {
            var animations = await _context.Purchases.AsNoTracking()
                .Include(p => p.Animation)
                    .ThenInclude(a => a.Owner)
                .Where(p => p.PurchaserId == id)
                .Select(p => p.Animation)
                .ToListAsync();

            return animations;
        }

        public async Task<ICollection<Animation>> FindByOwnerId(string id)
        {
            var animations = await _context.Animations.AsNoTracking()
                .Include(a => a.Owner)
                .Where(a => a.OwnerId.Equals(id))
                .ToListAsync();

            return animations;
        }

        public async Task<Animation> Insert(Animation animation)
        {
            await _context.Animations.AddAsync(animation);
            await _context.SaveChangesAsync();

            var owner = await _context.Users
                .Where(u => u.Id == animation.OwnerId)
                .SingleOrDefaultAsync();

            animation.Owner = owner;

            return animation;
        }

        public async Task Update(string id, Animation updatedAnimation)
        {
            var animation = await _context.Animations
                .Where(a => a.Id == id)
                .SingleOrDefaultAsync();

            if (animation != null)
            {
                animation.Title = updatedAnimation.Title;
                animation.CreatedAt = updatedAnimation.CreatedAt;
                animation.NumberOfPurchase = updatedAnimation.NumberOfPurchase;
                animation.Banned = updatedAnimation.Banned;
                animation.OwnerId = updatedAnimation.OwnerId;

                await _context.SaveChangesAsync();
            }
        }

        public async Task InsertPurchase(string purchaserId, string animationId)
        {
            var animation = await _context.Animations
                .Include(a => a.Owner)
                .Where(a => a.Id.Equals(animationId))
                .SingleOrDefaultAsync();

            if (animation == null)
                throw new AnimationNotFoundException();

            if (animation.OwnerId.Equals(purchaserId))
                throw new AnimationAlreadyOwnedException();

            var purchase = await _context.Purchases.AsNoTracking()
                .Where(p => p.PurchaserId.Equals(purchaserId))
                .Where(p => p.AnimationId.Equals(animationId))
                .SingleOrDefaultAsync();

            if (purchase != null)
                throw new AnimationAlreadyPurchasedException();

            var newPurchase = new Purchase
            {
                PurchaserId = purchaserId,
                AnimationId = animationId
            };

            await _context.Purchases.AddAsync(newPurchase);
            animation.NumberOfPurchase++;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAnimation(string id)
        {
            var animation = await _context.Animations
                .Where(a => a.Id.Equals(id))
                .SingleOrDefaultAsync();

            if (animation != null)
            {
                _context.Animations.Remove(animation);
                await _context.SaveChangesAsync();
            }
        }
    }
}
