namespace workgrid.Application.Services.Interfaces;

public interface IPresenceService
{
    Task SetOnlineAsync(string userId);
    Task SetOfflineAsync(string userId);
    Task<bool> IsOnlineAsync(string userId);
    Task<List<string>> GetOnlineUserIdsAsync();
}