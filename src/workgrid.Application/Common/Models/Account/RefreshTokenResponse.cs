namespace workgrid.Application.Common.Models.Account;

public class RefreshTokenResponse
{
    public string Id { get; set; }
    public string? RefreshToken { get; set; }
    public bool IsBlocked { get; set; }
}