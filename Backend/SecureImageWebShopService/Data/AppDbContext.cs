using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecureImageWebShopService.Models;
using System.Collections.Generic;

namespace SecureImageWebShopService.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            AddRoles(modelBuilder);
            AddUsers(modelBuilder);
            AddUserRoles(modelBuilder);  
        }

        private void AddRoles(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "1cecd966-12d4-4d94-bc22-315745820aec",
                Name = "Admin",
                NormalizedName = "ADMIN"
            });

            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "dd730692-bca5-4e01-952f-2da63f1091f7",
                Name = "Customer",
                NormalizedName = "CUSTOMER"
            });
        }

        class UserToSeed
        {
            public string Id { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; }
        }

        private void AddUsers(ModelBuilder modelBuilder)
        {
            var usersToSeed = new List<UserToSeed>
            {
                new UserToSeed
                {
                    Id = "9a6fe9ae-223a-4f1e-bd4a-38aafc313120",
                    UserName = "admin1",
                    Email = "admin1@secwebshop.com",
                    Password = "adm-N001",
                    Role = "Admin"
                },
                new UserToSeed
                {
                    Id = "50455bb6-55ce-4f2a-84d3-f3397a840ffa",
                    UserName = "customer1",
                    Email = "customer1@secwebshop.com",
                    Password = "custom-R001",
                    Role = "Customer"
                },
                new UserToSeed
                {
                    Id = "acfd83c7-01f4-4be5-a939-7206b6c3eac3",
                    UserName = "customer2",
                    Email = "customer2@secwebshop.com",
                    Password = "custom-R002",
                    Role = "Customer"
                }
            };

            var hasher = new PasswordHasher<AppUser>();

            foreach (var userToSeed in usersToSeed)
            {
                modelBuilder.Entity<AppUser>().HasData(new AppUser
                {
                    Id = userToSeed.Id,
                    UserName = userToSeed.UserName,
                    NormalizedUserName = userToSeed.UserName.ToUpper(),
                    Email = userToSeed.Email,
                    NormalizedEmail = userToSeed.Email.ToUpper(),
                    PasswordHash = hasher.HashPassword(null, userToSeed.Password)
                });
            }
        }

        private void AddUserRoles(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(
            new IdentityUserRole<string>
            {
                RoleId = "1cecd966-12d4-4d94-bc22-315745820aec",
                UserId = "9a6fe9ae-223a-4f1e-bd4a-38aafc313120"
            },
            new IdentityUserRole<string>
            {
                RoleId = "dd730692-bca5-4e01-952f-2da63f1091f7",
                UserId = "50455bb6-55ce-4f2a-84d3-f3397a840ffa"
            },
            new IdentityUserRole<string>
            {
                RoleId = "dd730692-bca5-4e01-952f-2da63f1091f7",
                UserId = "acfd83c7-01f4-4be5-a939-7206b6c3eac3"
            });
        }
    }
}
