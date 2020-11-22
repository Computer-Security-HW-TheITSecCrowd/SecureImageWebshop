using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace BKW.Backend.Domain.Models
{
    public class AppUser : IdentityUser
    {
        public ICollection<Animation> OwnedAnimations { get; set; } = new List<Animation>();
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    }
}
