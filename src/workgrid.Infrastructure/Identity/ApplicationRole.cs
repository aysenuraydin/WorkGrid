using Microsoft.AspNetCore.Identity;

namespace workgrid.Infrastructure.Identity;

public class ApplicationRole : IdentityRole
{//10
    public ApplicationRole()
    {
    }

    public ApplicationRole(string roleName) : base(roleName)
    {
    }
}