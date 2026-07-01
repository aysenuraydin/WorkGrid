using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Constants;
using workgrid.Infrastructure.Persistence.Common;

namespace workgrid.Infrastructure.Identity;

public class IdentitySeeder : ISeeder
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public IdentitySeeder(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    // NOT: Bunlar yalnızca yerel demo/başlangıç hesaplarıdır.
    // Gerçek bir ortamda güçlü ve gizli değerlerle değiştirilmelidir.
    private const string UserUserName = "demo.user";
    private const string UserEmail = "user@demo.local";
    private const string UserPassword = "Demo!User123";

    private const string AdminUserName = "demo.admin";
    private const string AdminEmail = "admin@demo.local";
    private const string AdminPassword = "Demo!Admin123";

    private const string WgUserName = "demo.wg";
    private const string WgEmail = "wg@demo.local";
    private const string WgPassword = "Demo!Wg123456";

    public async Task Seed(IWorkGridDbContext context)
    {
        if (await _userManager.Users.AnyAsync()) return;

        foreach (var roleName in new[] { Roles.WG, Roles.Admin, Roles.User, Roles.EndUser })
        {
            if (_roleManager.Roles.All(r => r.Name != roleName))
                await _roleManager.CreateAsync(new ApplicationRole(roleName));
        }

        await CreateUserAsync(
            userName: UserUserName,
            email: UserEmail,
            password: UserPassword,
            firstName: "WorkGrid",
            lastName: "User",
            role: Roles.User);

        await CreateUserAsync(
            userName: AdminUserName,
            email: AdminEmail,
            password: AdminPassword,
            firstName: "WorkGrid",
            lastName: "Admin",
            role: Roles.Admin);

        await CreateUserAsync(
            userName: WgUserName,
            email: WgEmail,
            password: WgPassword,
            firstName: "WorkGrid",
            lastName: "WG",
            role: Roles.WG);
    }

    private async Task CreateUserAsync(
        string userName, string email, string password,
        string firstName, string lastName, string role)
    {
        if (_userManager.Users.Any(u => u.UserName == userName)) return;

        var user = new ApplicationUser
        {
            UserName = userName,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            JoiningDate = DateTime.Now.ToString("dd.MM.yyyy"),
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = string.Join(" | ", result.Errors.Select(e => e.Description));
            throw new Exception($"IdentitySeeder - '{userName}' oluşturulamadı: {errors}");
        }

        await _userManager.AddToRolesAsync(user, new[] { role });
    }
}