
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models.Account;
using workgrid.Domain.Constants;
using workgrid.Infrastructure.Authentication;
using Microsoft.AspNetCore.Http;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Infrastructure.Identity;

public class IdentityAccountService : IAccountService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;
    private readonly ITenantConfigService _tenantConfigService;

    // Workgrid7. workgrid@workgrid.com
    public IdentityAccountService(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        SignInManager<ApplicationUser> signInManager,
        IEmailService emailService,
        IHttpContextAccessor httpContextAccessor,
        ITenantConfigService tenantConfigService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _emailService = emailService;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
        _tenantConfigService = tenantConfigService;
    }
    public async Task<List<Claim>?> AuthenticateAsync(AuthenticationRequest request)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(e => e.Email == request.Email.Trim());
        if (user == null) return null;

        if (await _userManager.IsLockedOutAsync(user))
            return null;

        var checkPassword = await _signInManager.CheckPasswordSignInAsync(user, request.Password.Trim(), false);
        if (!checkPassword.Succeeded) return null;

        return await GetUserClaimsAsync(user);
    }
    public async Task<List<Claim>?> AuthenticateByUserIdAsync(string id)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(e => e.Id == id);
        if (user == null) return null;
        if (await _userManager.IsLockedOutAsync(user)) return null;

        return await GetUserClaimsAsync(user);
    }
    public async Task<RefreshTokenResponse?> GetUserByRefreshToken(string refreshToken)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(e => e.RefreshToken == refreshToken);
        if (user == null) return null;

        return new RefreshTokenResponse
        {
            Id = user.Id,
            RefreshToken = user.RefreshToken,
            IsBlocked = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow
        };
    }
    public async Task<bool> UpdateRefreshToken(string userId, string refreshToken)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(e => e.Id == userId);
        if (user == null) return false;

        user.RefreshToken = refreshToken;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<AuthenticationResponse?> RegisterAsync(RegisterRequest request)
    {
        var existUser = await _userManager.Users
                        .FirstOrDefaultAsync(e => e.Email == request.Email.Trim());
        if (existUser != null) return null;

        var activationCode = Convert.ToBase64String(AccountHelper.GenerateSalt());

        var user = new ApplicationUser
        {
            UserName = request.UserName.Trim(),
            Email = request.Email.Trim(),
            FirstName = request.FirstName?.Trim() ?? "",
            LastName = request.LastName?.Trim() ?? "",
            JoiningDate = DateTime.Now.ToString("dd.MM.yyyy"),
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errorMessages = string.Join(" | ", result.Errors.Select(e => e.Description));
            throw new Exception($"Identity Error: {errorMessages}");
        }

        var tenantConfig = await _tenantConfigService.GetConfigAsync(CancellationToken.None);
        var isPublicFacing = (tenantConfig?.ShowECommerce ?? false)
                            || (tenantConfig?.ShowBLog ?? false);

        var defaultRole = isPublicFacing ? Roles.EndUser : Roles.User;

        if (!await _roleManager.RoleExistsAsync(defaultRole))
        {
            await _roleManager.CreateAsync(new ApplicationRole(defaultRole));
        }
        await _userManager.AddToRoleAsync(user, defaultRole);

        return new AuthenticationResponse
        {
            Id = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            Roles = new List<string> { defaultRole },
            FirstName = user.FirstName,
            LastName = user.LastName
        };
    }
    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        return user?.UserName;
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> ActivateUserAsync(string userId, string code)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        if (user.ActivationCode == code)
        {
            user.ActivationCode = "";
            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);
            return true;
        }
        return false;
    }

    public async Task<bool> IsUserExist(string email)
    {
        return await _userManager.Users.AnyAsync(u => u.Email == email);
    }

    public async Task LogoutAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.RefreshToken = null; // Token'ı patlat
                await _userManager.UpdateAsync(user);
            }
        }
    }

    private async Task<List<Claim>> GetUserClaimsAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? ""),
            new Claim(ClaimTypes.GivenName, user.FirstName ?? ""),
            new Claim(ClaimTypes.Surname, user.LastName ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? "")
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        return claims;
    }

    public async Task<string?> GeneratePasswordResetTokenAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return null;

        return await _userManager.GeneratePasswordResetTokenAsync(user);
    }
}