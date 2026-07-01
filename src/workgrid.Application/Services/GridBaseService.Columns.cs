using workgrid.Domain.Entities;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public partial class GridBaseService
{
    public async Task<bool> DeleteColumnByNameAsync(
        string tableName, string columnName, bool hard = false, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki → kolonu adıyla bul → hücreleriyle birlikte
        //   hard ise kalıcı sil, değilse soft-delete → kaydet.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IReadOnlyList<EmptyColumnInfo>> GetEmptyColumnsAsync(long tableId, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki → kolonları hücreleriyle çek → boş olanları raporla.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IReadOnlyList<long>> PruneEmptyColumnsAsync(
        long tableId, IReadOnlyList<long>? columnIds = null, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki → boş kolonları seç (opsiyonel id filtresi) →
        //   soft-delete → silinen id'leri döndür.
        throw new NotImplementedException("Source available on request.");
    }

    private static bool IsColumnEmpty(TableColumn col)
    {
        // 🔒 Hidden. Hücre yoksa ya da hepsi boş/null ise true.
        throw new NotImplementedException("Source available on request.");
    }
}
