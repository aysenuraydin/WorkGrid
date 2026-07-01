
using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public partial interface IGridBaseRepository
{
    Task<Datatable> ResolveTableAsync(string tableName, CancellationToken ct);
    Task<IEnumerable<TableRow>> GetRowsAsync(long tableId, CancellationToken ct);
    Task<TableRow?> GetRowByIdAsync(long tableId, long rowId, CancellationToken ct);
    Task AddRowAsync(TableRow row, CancellationToken ct);
    Task AddCellAsync(TableCell cell, CancellationToken ct);
    Task<int> SaveChangesAsync(CancellationToken ct);
    Task<TableRow?> GetRowWithCellsAsync(long rowId, CancellationToken ct);
    Task RemoveRowAsync(TableRow row, CancellationToken ct);
}
public partial interface IGridBaseRepository
{
    Task<IEnumerable<Datatable>> GetAllTablesAsync(CancellationToken ct);

    Task<Datatable?> GetTableByIdAsync(long tableId, CancellationToken ct);

    Task<bool> TableNameExistsAsync(string name, CancellationToken ct);

    Task AddTableAsync(Datatable table, CancellationToken ct);

    void RemoveTable(Datatable table);
}

public partial interface IGridBaseRepository
{
    Task AddColumnAsync(TableColumn column, CancellationToken ct);

    Task<IEnumerable<TableColumn>> GetColumnsWithCellsAsync(long tableId, CancellationToken ct);

    Task<TableColumn?> GetColumnByNameAsync(long tableId, string columnName, CancellationToken ct);

    void RemoveCells(IEnumerable<TableCell> cells);

    void RemoveColumn(TableColumn column);
}
public partial interface IGridBaseRepository
{
    Task<IEnumerable<ForeignTable>> GetForeignTablesAsync(long tableId, CancellationToken ct);
    Task<ForeignTable?> GetForeignTableAsync(long fromTableId, long toTableId, CancellationToken ct);
    Task AddForeignTableAsync(ForeignTable ft, CancellationToken ct);
    Task RemoveForeignTableAsync(ForeignTable ft, CancellationToken ct);

    Task<TableColumn?> GetLinkColumnAsync(long fromTableId, long toTableId, CancellationToken ct);
    Task<IEnumerable<TableColumn>> GetColumnsByRealTableAsync(long fromTableId, long toTableId, CancellationToken ct);
    Task<int> GetMaxColumnOrderAsync(long tableId, CancellationToken ct);
}