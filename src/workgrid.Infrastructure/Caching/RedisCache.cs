
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Text.Json;
using workgrid.Application.Common.Interfaces;
using workgrid.Infrastructure.ConfigModels;

namespace workgrid.Infrastructure.Caching;

public class RedisCache : IAppCache
{
    private readonly IDistributedCache _redis;
    private readonly IConfiguration _configuration;
    private readonly AppConfigModel? _options;

    public RedisCache(IDistributedCache redis, IConfiguration configuration, IOptions<AppConfigModel> options)
    {
        _redis = redis;
        _configuration = configuration;
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task SetCache(string key, string value, int timeout = 1)
    {
        if (_options?.IsRedisActive != true) return;

        var options = new DistributedCacheEntryOptions()
        {
            SlidingExpiration = TimeSpan.FromMinutes(timeout),
        };
        await _redis.SetStringAsync(key, value, options, default);
    }

    public async Task<string?> GetCache(string key)
    {
        if (_options?.IsRedisActive != true) return null;

        return await _redis.GetStringAsync(key, default);
    }

    public async Task RemoveCache(string key)
    {
        if (_options?.IsRedisActive != true) return;

        await _redis.RemoveAsync(key);
    }

    public async Task<T?> GetOrSetCache<T>(string key, Func<T> action, int timeout = 1)
    {

        if (_options?.IsRedisActive != true) return action();

        var cacheItems = await GetCache(key);
        if (cacheItems != null)
            return JsonSerializer.Deserialize<T>(cacheItems);

        var itemsDb = action();
        await SetCache(key, JsonSerializer.Serialize(itemsDb), timeout);
        return itemsDb;
    }
    public async Task<T?> GetOrSetCacheAsync<T>(string key, Func<Task<T>> action, int timeout = 1)
    {
        if (_options?.IsRedisActive != true)
            return await action();

        var cacheItems = await GetCache(key);

        if (cacheItems != null)
            return JsonSerializer.Deserialize<T>(cacheItems);
        // }

        var itemsDb = await action();
        await SetCache(key, JsonSerializer.Serialize(itemsDb), timeout);
        return itemsDb;
    }
}

