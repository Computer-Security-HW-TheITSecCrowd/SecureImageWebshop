using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Identity;
using SecureImageWebShopService.Models;

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
