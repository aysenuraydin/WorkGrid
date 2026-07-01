using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Repositories;

public partial class GridBaseRepository
{
    public async Task AddColumnAsync(TableColumn column, CancellationToken ct)
    {
        // 🔒 Hidden. Yeni kolonu context'e ekler.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IEnumerable<TableColumn>> GetColumnsWithCellsAsync(long tableId, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: tableId + soft-delete + RealColumnId==null (gerçek kolon)
        //       → hücreleri include → TableOrder'a göre sırala.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<TableColumn?> GetColumnByNameAsync(long tableId, string columnName, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: gerçek kolonları çek → ham ad VEYA camelCase eşleşmesiyle ilkini döndür.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<TableColumn?> GetParentColumnAsync(long tableId, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: tabloda Parent tipli kolonu bul.
        throw new NotImplementedException("Source available on request.");
    }

    public void RemoveCells(IEnumerable<TableCell> cells)
    {
        // 🔒 Hidden. Verilen hücreleri toplu kaldırır.
        throw new NotImplementedException("Source available on request.");
    }

    public void RemoveColumn(TableColumn column)
    {
        // 🔒 Hidden. Kolonu kaldırır.
        throw new NotImplementedException("Source available on request.");
    }

    private static string ToCamel(string name) =>
        string.IsNullOrEmpty(name) ? name : char.ToLower(name[0]) + name[1..];
}