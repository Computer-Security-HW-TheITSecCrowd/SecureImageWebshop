using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BKW.Backend.Api.Requests;
using BKW.Backend.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace SecureImageWebShopService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<AppUser> userManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult<string> Get()
        {
            return Ok("auth");
        }

        [Route("login")]
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            if (request.Username == null || request.Password == null)
            {
                return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(request.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, request.Password))
            {
                var claims = new[] {
                    new Claim("Id", user.Id),
                    new Claim("Username", user.UserName),
                    new Claim("Role", _userManager.GetRolesAsync(user).Result.First()),
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SigningKey"]));
                int expiryInMinutes = Convert.ToInt32(_configuration["Jwt:ExpiryInMinutes"]);

                var accessToken = new JwtSecurityToken(
                    expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
                    claims: claims,
                    signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(
                    new
                    {
                        id = user.Id,
                        userName = user.UserName,
                        role = _userManager.GetRolesAsync(user).Result.First(),
                        accessToken = new JwtSecurityTokenHandler().WriteToken(accessToken)
                    }
                );
            }

            return Unauthorized();
        }

        [Route("register")]
        [HttpPost]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!request.Password.Equals(request.ConfirmPassword))
            {
                return BadRequest();
            }

            var user = new AppUser
            {
                UserName = request.Username,
                Email = $"{request.Username}@secwebshop.com",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Customer");

                return Ok();
            }

            return BadRequest();
        }
    }
}
