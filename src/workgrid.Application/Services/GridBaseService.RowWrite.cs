using workgrid.Domain.Entities;
using workgrid.Domain.Enums;

namespace workgrid.Application.Services;

public partial class GridBaseService
{
    private static InputTypeEnum InferColumnType(object? value)
    {
        // 🔒 Hidden. JsonElement/CLR tipine göre InputTypeEnum çıkarımı.
        throw new NotImplementedException("Source available on request.");
    }

    private static int NextTableOrder(IReadOnlyList<TableColumn> realColumns)
    {
        // 🔒 Hidden. Mevcut max TableOrder + 1.
        throw new NotImplementedException("Source available on request.");
    }

    private async Task<Dictionary<string, TableColumn>> AutoCreateMissingColumnsAsync(
        Datatable table, IDictionary<string, object?> body,
        IReadOnlyList<TableColumn> realColumns, IReadOnlyList<ForeignColumnMeta> foreignColumns,
        CancellationToken ct)
    {
        // 🔒 Hidden. Akış: id/foreign/mevcut key'leri atla → tip çıkar →
        //   TableColumn.Create ile yeni kolonu ekle → eşlemeyi döndür.
        throw new NotImplementedException("Source available on request.");
    }

    private static TableColumn? ResolveColumnForKey(
        string key, IReadOnlyList<TableColumn> realColumns,
        IReadOnlyDictionary<string, TableColumn> autoCreated)
    {
        // 🔒 Hidden. Key'i ham ad/camelCase ile mevcut ya da yeni açılan kolona eşler.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IDictionary<string, object?>> CreateAsync(
        string tableName, IDictionary<string, object?> body, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: tablo çöz → yazma yetkisi → owner damgala →
        //   auto-column → satır oluştur → gerçek + foreign hücreleri bağla →
        //   kaydet → tabloyu yeniden çöz → EAV'i JSON'a çevirip döndür.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IDictionary<string, object?>?> UpdateAsync(
        string tableName, long rowId, IDictionary<string, object?> body, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki + sahiplik → auto-column → body'de olmayan
        //   gerçek kolonları boşalt → body'dekileri yaz → foreign kolonları
        //   replace mantığıyla işle → kaydet → JSON döndür.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IDictionary<string, object?>?> PatchAsync(
        string tableName, long rowId, IDictionary<string, object?> body, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki + sahiplik → auto-column → sadece gelen alanları
        //   yaz (null → boşalt) → foreign alanları işle → kaydet → JSON döndür.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<bool> DeleteAsync(string tableName, long rowId, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki → satırı bul → sahiplik kontrolü → kaldır → kaydet.
        throw new NotImplementedException("Source available on request.");
    }
}
