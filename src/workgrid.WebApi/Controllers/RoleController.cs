using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;

namespace workgrid.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "WG, Admin")]
public class RoleController : ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly IUserService _userService;

    public RoleController(IRoleService roleService, IUserService userService)
    {
        _roleService = roleService;
        _userService = userService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetRoles()
    {
        try
        {
            var roles = await _roleService.GetRolesAsync();
            return Ok(roles);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
    {
        try
        {
            await _roleService.CreateRoleAsync(request);
            return StatusCode(201, new { Message = "Role created successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleRequest request)
    {
        try
        {
            await _roleService.UpdateRoleAsync(request);
            return Ok(new { Message = "Role updated successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteRole([FromRoute] string id)
    {
        try
        {
            await _roleService.DeleteRoleAsync(id);
            return Ok(new { Message = "Role deleted successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
    [HttpPut("update-user-role")]
    public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleRequest request)
    {
        try
        {
            await _userService.UpdateUserRoleAsync(request);
            return Ok(new { Message = $"User role successfully updated to '{request.NewRole}'." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("users-all")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersWithRolesAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("users-by-role/{roleName}")]
    public async Task<IActionResult> GetUsersByRole([FromRoute] string roleName)
    {
        try
        {
            var users = await _userService.GetUsersByRoleAsync(roleName);
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}