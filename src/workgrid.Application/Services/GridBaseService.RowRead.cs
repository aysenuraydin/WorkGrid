using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public partial class GridBaseService
{
    public async Task<IReadOnlyList<IDictionary<string, object?>>> GetAllAsync(
        string tableName,
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        string? search = null,
        IReadOnlyList<string>? searchFields = null,
        CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: tablo çöz → okuma yetkisi → satırları çek →
        //   owner süz → arama (OR) → filtre (AND) → sırala → EAV'i JSON'a çevir → select.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IDictionary<string, object?>?> GetByIdAsync(
        string tableName, long rowId, SelectDescriptor? select = null, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: tablo çöz → okuma yetkisi → satırı bul → sahiplik →
        //   JSON'a çevir → select uygula.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<PagedResult> GetPagedAsync(
        string tableName, int page = 1, int? pageSize = null,
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        string? search = null,
        IReadOnlyList<string>? searchFields = null,
        CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: GetAll mantığı + skip/take sayfalama → toplam/sayfa
        //   meta verisiyle PagedResult.
        throw new NotImplementedException("Source available on request.");
    }

    // ── Ortak filtre uygulama (gerçek + foreign kolonlar) ──
    private IEnumerable<TableRow> ApplyFilters(
        IEnumerable<TableRow> query, IReadOnlyList<FilterDescriptor>? filters,
        IReadOnlyList<TableColumn> columns, IReadOnlyList<ForeignColumnMeta> foreign)
    {
        // 🔒 Hidden. Her filtre için kolonu çöz → hücre değerine operatör uygula (AND).
        throw new NotImplementedException("Source available on request.");
    }

    // ── Ortak sıralama (tip-duyarlı) ──
    private IEnumerable<TableRow> ApplySort(
        IEnumerable<TableRow> query, SortDescriptor? sort, IReadOnlyList<TableColumn> columns)
    {
        // 🔒 Hidden. Sort kolonunu çöz → tip-duyarlı anahtarla artan/azalan sırala.
        throw new NotImplementedException("Source available on request.");
    }

    private static bool ApplyFilter(string raw, string op, string? value, TableColumn col)
    {
        // 🔒 Hidden. Operatöre göre karşılaştırma; sayı/tarih kolonlarında tip-duyarlı.
        throw new NotImplementedException("Source available on request.");
    }

    private static bool ApplyForeignFilter(string raw, string op, string? value, bool isMultiSelect)
    {
        // 🔒 Hidden. İlişki hücresindeki id küme(ler)ine göre eq/neq/in/isnull.
        throw new NotImplementedException("Source available on request.");
    }

    private static int CompareValues(string raw, string? value, TableColumn col)
    {
        // 🔒 Hidden. Sayı/tarih ise tipli karşılaştırma, değilse string compare.
        throw new NotImplementedException("Source available on request.");
    }

    private static object? GetSortKey(TableRow row, TableColumn col)
    {
        // 🔒 Hidden. Hücre değerini kolon tipine göre sıralanabilir anahtara çevirir.
        throw new NotImplementedException("Source available on request.");
    }
}
