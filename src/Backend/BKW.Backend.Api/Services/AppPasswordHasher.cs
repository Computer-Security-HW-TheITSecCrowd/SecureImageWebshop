using BKW.Backend.Domain.Models;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Identity;

namespace SecureImageWebShopService.Services
{
    public class AppPasswordHasher : IPasswordHasher<AppUser>
    {
        public string HashPassword(AppUser user, string password)
        {
            return Argon2.Hash(password);
        }

        public PasswordVerificationResult VerifyHashedPassword(
            AppUser user,
            string hashedPassword,
            string providedPassword)
        {
            if (Argon2.Verify(hashedPassword, providedPassword))
            {
                return PasswordVerificationResult.Success;
            }

            return PasswordVerificationResult.Failed;
        }
    }
}
