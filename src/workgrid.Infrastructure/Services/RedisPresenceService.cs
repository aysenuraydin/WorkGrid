using StackExchange.Redis;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Infrastructure.Services;

public class RedisPresenceService : IPresenceService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _db;
    private const string OnlineSetKey = "online_users";

    public RedisPresenceService(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _db = redis.GetDatabase();
    }

    public async Task SetOnlineAsync(string userId)
    {
        await _db.SetAddAsync(OnlineSetKey, userId);
        // 24 saat sonra expire — set için key bazlı expire yok, üye bazlı takip için ayrı key
        await _db.StringSetAsync($"presence:{userId}", "1", TimeSpan.FromHours(24));
    }

    public async Task SetOfflineAsync(string userId)
    {
        await _db.SetRemoveAsync(OnlineSetKey, userId);
        await _db.KeyDeleteAsync($"presence:{userId}");
    }

    public async Task<bool> IsOnlineAsync(string userId) =>
        await _db.KeyExistsAsync($"presence:{userId}");

    public async Task<List<string>> GetOnlineUserIdsAsync()
    {
        var members = await _db.SetMembersAsync(OnlineSetKey);
        return members.Select(m => m.ToString()).ToList();
    }
}