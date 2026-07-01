using System.Security.Claims;
using workgrid.Application.Common.Models.Account;

namespace workgrid.Application.Common.Interfaces;

public interface IAccountService
{
    Task<List<Claim>?> AuthenticateAsync(AuthenticationRequest request);
    Task<List<Claim>?> AuthenticateByUserIdAsync(string id);
    Task<RefreshTokenResponse?> GetUserByRefreshToken(string refreshToken);
    Task<bool> UpdateRefreshToken(string userId, string refreshToken);
    Task<AuthenticationResponse?> RegisterAsync(RegisterRequest request);
    Task LogoutAsync();
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<string?> GetUserNameAsync(string userId);
    Task<bool> ActivateUserAsync(string userId, string code);
    Task<bool> IsUserExist(string email);
    Task<string?> GeneratePasswordResetTokenAsync(string email);

}