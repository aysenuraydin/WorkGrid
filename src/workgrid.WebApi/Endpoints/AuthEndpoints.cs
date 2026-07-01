using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models.Account;
using workgrid.Application.Services.Interfaces;

namespace workgrid.WebApi.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes
            .MapGroup("/api/auth")
            .WithTags("Auth");

        group.MapPost("/authenticate", Authenticate);
        group.MapPost("/refresh-token", AuthenticateByRefreshToken);
        group.MapPost("/register", Register);
        group.MapPost("/forgot-password", ForgotPassword);

        group.MapPost("/logout", Logout).RequireAuthorization();
        group.MapPatch("/{id}/block", BlockUser).RequireAuthorization();
        group.MapPatch("/{id}/unblock", UnblockUser).RequireAuthorization();

        return group;
    }

    private static async Task<IResult> Register([FromBody] RegisterRequest request, IAccountService accountService)
    {
        if (request == null) return Results.BadRequest("Invalid request");

        try
        {
            var result = await accountService.RegisterAsync(request);
            if (result == null) return Results.BadRequest("Registration failed!");

            return Results.Ok(result);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { Message = ex.Message });
        }
    }

    private static async Task<IResult> Authenticate([FromBody] AuthenticationRequest request, IAccountService accountService, IConfiguration configuration)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            return Results.BadRequest("Invalid user credentials");

        var authenticatedUserClaims = await accountService.AuthenticateAsync(request);
        if (authenticatedUserClaims == null) return Results.Unauthorized();

        var token = await GetJwtToken(authenticatedUserClaims, accountService, configuration);
        return token;
    }

    private static async Task<IResult> AuthenticateByRefreshToken([FromBody] string refreshToken, IAccountService accountService, IConfiguration configuration)
    {
        if (string.IsNullOrEmpty(refreshToken)) return Results.BadRequest("Refresh token is required");

        var refreshTokenUser = await accountService.GetUserByRefreshToken(refreshToken);
        if (refreshTokenUser == null) return Results.Unauthorized();

        if (refreshTokenUser.RefreshToken == null || refreshTokenUser.RefreshToken != refreshToken)
            return Results.Unauthorized();
        if (refreshTokenUser.IsBlocked)
            return Results.Unauthorized();

        var authenticatedUserClaims = await accountService.AuthenticateByUserIdAsync(refreshTokenUser.Id);
        if (authenticatedUserClaims == null) return Results.Unauthorized();

        var token = await GetJwtToken(authenticatedUserClaims, accountService, configuration);
        return token;
    }

    private static async Task<IResult> ForgotPassword([FromBody] ForgotPasswordRequest request, IAccountService accountService, IEmailService emailService)
    {
        if (string.IsNullOrEmpty(request.Email))
            return Results.BadRequest("Email is required.");

        var token = await accountService.GeneratePasswordResetTokenAsync(request.Email);

        if (token != null)
        {
            var resetLink = $"http://localhost:3000/reset-password?email={request.Email}&token={Uri.EscapeDataString(token)}";

            await emailService.SendEmailAsync(request.Email, "WorkGrid - Reset Password",
                $"Please reset your password by clicking here: <a href='{resetLink}'>Reset Password</a>");
        }

        return Results.Ok(new { Message = "If the email is correct, reset instructions have been sent." });
    }

    private static async Task<IResult> Logout(IAccountService accountService)
    {
        await accountService.LogoutAsync();
        return Results.Ok(new { Message = "Logged out successfully from server." });
    }

    private static async Task<IResult> GetJwtToken(List<Claim> authenticatedUserClaims, IAccountService accountService, IConfiguration configuration)
    {
        var expireInMinute = Convert.ToDouble(configuration["Authentication:Jwt:ExpireTimeInMinute"]);
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Authentication:Jwt:SigningKey"]!));

        var tokenOptions = new JwtSecurityToken(
            issuer: configuration["Authentication:Jwt:Issuer"],
            audience: configuration["Authentication:Jwt:Audience"],
            claims: authenticatedUserClaims,
            expires: DateTime.UtcNow.AddMinutes(expireInMinute),
            notBefore: DateTime.UtcNow,
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        var refreshToken = Guid.NewGuid().ToString();

        var userIdClaim = authenticatedUserClaims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Results.Problem("User identifier claim missing.");

        await accountService.UpdateRefreshToken(userIdClaim.Value, refreshToken);

        return Results.Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = TimeSpan.FromMinutes(expireInMinute).TotalSeconds
        });
    }

    private static bool IsAdmin(IUser currentUser) =>
        string.Equals(currentUser.Role, "Admin", StringComparison.OrdinalIgnoreCase)
        || string.Equals(currentUser.Role, "WG", StringComparison.OrdinalIgnoreCase);

    private static async Task<IResult> BlockUser(string id, IUserService userService, IUser currentUser)
    {
        if (!IsAdmin(currentUser))
            return Results.Forbid();

        await userService.SetUserBlockedAsync(id, true);
        return Results.Ok(new { message = "Kullanıcı bloklandı.", blocked = true });
    }

    private static async Task<IResult> UnblockUser(string id, IUserService userService, IUser currentUser)
    {
        if (!IsAdmin(currentUser))
            return Results.Forbid();

        await userService.SetUserBlockedAsync(id, false);
        return Results.Ok(new { message = "Kullanıcı blok açıldı.", blocked = false });
    }
}

public record ForgotPasswordRequest(string Email);