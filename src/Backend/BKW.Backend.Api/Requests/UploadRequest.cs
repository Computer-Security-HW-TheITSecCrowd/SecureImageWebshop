using BKW.Backend.Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace BKW.Backend.Api.Requests
{
    public class UploadRequest
    {
        [Required]
        public string Title { get; set; }
        public IFormFile FormFile { get; set; }

        public Animation ToModel(string ownerId)
        {
            return new Animation
            {
                Title = Title,
                CreatedAt = DateTime.Now,
                NumberOfPurchase = 0,
                Banned = false,
                OwnerId = ownerId
            };
        }
    }
}
