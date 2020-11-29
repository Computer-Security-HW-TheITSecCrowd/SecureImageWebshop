using BKW.Backend.Domain.Models;
using Google.Protobuf.Collections;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Drawing;

namespace BKW.Backend.Api.Responses
{
    public class AnimationResponse
    {
        public AnimationResponse(Animation animation)
        {
            Id = animation.Id;
            Title = animation.Title;
            CreatedAt = animation.CreatedAt;
            NumberOfPurchase = animation.NumberOfPurchase;
            Banned = animation.Banned;
            Owner = animation.Owner.UserName;
        }

        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
        public int NumberOfPurchase { get; set; }
        public bool Banned { get; set; }
        public string Owner { get; set; }
    }
}
