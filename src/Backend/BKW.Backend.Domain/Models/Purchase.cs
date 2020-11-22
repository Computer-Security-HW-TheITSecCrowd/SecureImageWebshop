namespace BKW.Backend.Domain.Models
{
    public class Purchase
    {
        public string PurchaserId { get; set; }
        public AppUser Purchaser { get; set; }
        public string AnimationId { get; set; }
        public Animation Animation { get; set; }
    }
}
