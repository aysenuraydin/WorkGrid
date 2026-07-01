using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;

namespace workgrid.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    private string? CurrentUserId =>
        User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        ?? User.FindFirst("id")?.Value
        ?? User.FindFirst("sub")?.Value;

    [HttpPut("update-profile-experience")]
    public async Task<IActionResult> UpdateProfileExperience([FromBody] UpdateExperienceProfileDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (CurrentUserId != dto.Id)
            return StatusCode(StatusCodes.Status403Forbidden,
                new { message = "Bu profili güncelleme yetkiniz yok." });

        var result = await _userService.UpdateExperienceProfileAsync(dto);
        if (!result) return BadRequest(new { message = "Güncelleme başarısız. Kullanıcı bulunamadı." });

        return Ok(new { message = "Deneyim profili güncellendi!" });
    }

    [HttpPut("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (CurrentUserId != dto.Id)
            return StatusCode(StatusCodes.Status403Forbidden,
                new { message = "Bu profili güncelleme yetkiniz yok." });

        var result = await _userService.UpdateProfileAsync(dto);
        if (!result) return BadRequest(new { message = "Profil güncelleme başarısız." });

        return Ok(new { message = "Profil güncellendi!" });
    }

    [HttpPut("update-password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
    {
        if (request == null) return BadRequest(new { Message = "Geçersiz istek." });
        if (CurrentUserId != request.Id)
            return StatusCode(StatusCodes.Status403Forbidden,
                new { Message = "Sadece kendi şifrenizi değiştirebilirsiniz." });

        try
        {
            await _userService.UpdatePasswordAsync(request);
            return Ok(new { Message = "Şifre güncellendi." });
        }
        catch (Exception ex) { return BadRequest(new { Message = ex.Message }); }
    }
    [HttpPut("update-avatar-url")]
    public async Task<IActionResult> UpdateAvatarUrl([FromBody] UpdateAvatarUrlRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.ProfilePictureUrl))
            return BadRequest(new { Message = "Profil resmi URL'si boş olamaz." });

        try
        {
            await _userService.UpdateAvatarUrlAsync(request);
            return Ok(new { Message = "Profil resmi güncellendi.", Url = request.ProfilePictureUrl });
        }
        catch (Exception ex) { return BadRequest(new { Message = ex.Message }); }
    }

    [HttpPut("update-role")]
    [Authorize(Roles = "WG,Admin")]
    public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleRequest request)
    {
        if (request == null) return BadRequest(new { Message = "Geçersiz istek." });
        try
        {
            await _userService.UpdateUserRoleAsync(request);
            return Ok(new { Message = $"Kullanıcı rolü '{request.NewRole}' olarak güncellendi." });
        }
        catch (Exception ex) { return BadRequest(new { Message = ex.Message }); }
    }

    [HttpGet("detail/{id:guid}")]
    public async Task<IActionResult> GetUserDetail([FromRoute] string id)
    {
        try
        {
            var userDetail = await _userService.GetUserDetailByIdAsync(id);
            return Ok(userDetail);
        }
        catch (Exception ex) { return NotFound(new { Message = ex.Message }); }
    }

    [HttpGet("all")]
    [Authorize(Roles = "WG,Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersWithRolesAsync();
            return Ok(users);
        }
        catch (Exception ex) { return BadRequest(new { Message = ex.Message }); }
    }

    [HttpGet("by-role/{roleName}")]
    [Authorize(Roles = "WG,Admin")]
    public async Task<IActionResult> GetUsersByRole([FromRoute] string roleName)
    {
        if (string.IsNullOrEmpty(roleName)) return BadRequest(new { Message = "Rol adı gerekli." });
        try
        {
            var users = await _userService.GetUsersByRoleAsync(roleName);
            return Ok(users);
        }
        catch (Exception ex) { return BadRequest(new { Message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "WG,Admin")]
    public async Task<IActionResult> DeleteUser([FromRoute] string id)
    {
        if (string.IsNullOrEmpty(id)) return BadRequest(new { Message = "Kullanıcı Id gerekli." });
        try
        {
            await _userService.DeleteUserByIdAsync(id);
            return NoContent();
        }
        catch (Exception ex) { return BadRequest(new { Message = ex.Message }); }
    }
}
