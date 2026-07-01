using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Repositories;

public partial class GridBaseRepository
{
    public async Task<IEnumerable<ForeignTable>> GetForeignTablesAsync(long tableId, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: kaynak tabloya ait ilişkiler → hedef tabloyu include.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<ForeignTable?> GetForeignTableAsync(long fromTableId, long toTableId, CancellationToken ct)
    {
        // 🔒 Hidden. from/to eşleşmesiyle tek ilişki.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task AddForeignTableAsync(ForeignTable ft, CancellationToken ct)
    {
        // 🔒 Hidden. Yeni ilişkiyi context'e ekler.
        throw new NotImplementedException("Source available on request.");
    }

    public Task RemoveForeignTableAsync(ForeignTable ft, CancellationToken ct)
    {
        // 🔒 Hidden. İlişkiyi kaldırır.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<TableColumn?> GetLinkColumnAsync(long fromTableId, long toTableId, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: kaynak tabloda hedefe işaret eden bağ kolonunu hücreleriyle bul.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IEnumerable<TableColumn>> GetColumnsByRealTableAsync(
        long fromTableId, long toTableId, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: kaynak tabloda hedefe ait tüm kolonlar → hücreleriyle.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<int> GetMaxColumnOrderAsync(long tableId, CancellationToken ct)
    {
        // 🔒 Hidden. Soft-delete'siz kolonlarda max TableOrder (yoksa 0).
        throw new NotImplementedException("Source available on request.");
    }
}