using Microsoft.Extensions.Caching.Memory;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Application.Services;

public class TenantConfigService : ITenantConfigService
{
    private readonly ITenantConfigRepository _repository;
    private readonly IMemoryCache _cache;
    private const string CacheKey = "tenant:config:default";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(30);

    public TenantConfigService(ITenantConfigRepository repository, IMemoryCache cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<TenantConfig> GetConfigAsync(CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: cache hit → döndür; miss → DB → yoksa default oluştur → cache'le.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<TenantConfig> UpdateConfigAsync(TenantConfig incoming, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: mevcut yoksa ekle; varsa audit'i koruyarak alanları kopyala → kaydet → cache'le.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<TenantConfig> ResetToDefaultAsync(CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: varsayılan değerleri mevcut kayda uygula → kaydet → cache'le.
        throw new NotImplementedException("Source available on request.");
    }

    public void InvalidateCache() => _cache.Remove(CacheKey);
}