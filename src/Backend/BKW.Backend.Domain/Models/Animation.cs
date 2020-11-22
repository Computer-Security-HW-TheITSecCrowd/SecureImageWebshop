using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BKW.Backend.Domain.Models
{
    public class Animation
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
        public int NumberOfPurchase { get; set; }
        public bool Banned { get; set; }
        public string OwnerId { get; set; }
        public AppUser Owner { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    }
}
