using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BKW.Backend.Domain.Models
{
    public class Comment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AnimationId { get; set; }
        public Animation Animation { get; set; }
        public string Content { get; set; }
    }
}
