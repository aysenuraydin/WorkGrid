

using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public partial interface IGridBaseService
{
    Task<IReadOnlyList<IDictionary<string, object?>>> GetAllAsync(
        string tableName,
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        string? search = null,
        IReadOnlyList<string>? searchFields = null,
        IReadOnlyList<string>? expand = null,
        CancellationToken ct = default);

    Task<IDictionary<string, object?>?> GetByIdAsync(
        string tableName, long rowId,
        SelectDescriptor? select = null,
        IReadOnlyList<string>? expand = null,
        CancellationToken ct = default);

    Task<PagedResult> GetPagedAsync(
        string tableName, int page = 1, int? pageSize = null,
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        string? search = null,
        IReadOnlyList<string>? searchFields = null,
        IReadOnlyList<string>? expand = null,
        CancellationToken ct = default);

    Task<IDictionary<string, object?>> CreateAsync(
        string tableName, IDictionary<string, object?> body, CancellationToken ct = default);

    Task<IDictionary<string, object?>?> UpdateAsync(
        string tableName, long rowId, IDictionary<string, object?> body, CancellationToken ct = default);

    Task<IDictionary<string, object?>?> PatchAsync(
        string tableName, long rowId, IDictionary<string, object?> body, CancellationToken ct = default);

    Task<bool> DeleteAsync(string tableName, long rowId, CancellationToken ct = default);

    Task SetTableAccessAsync(string tableName, SetTableAccessRequest request, CancellationToken ct = default);
}

public partial interface IGridBaseService
{
    Task<IReadOnlyList<TableSummaryResponse>> GetAllTablesAsync(
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        CancellationToken ct = default);

    Task<TableSummaryResponse?> GetOneTableAsync(
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        CancellationToken ct = default);

    Task<TableSummaryResponse?> GetTableByIdAsync(long tableId, CancellationToken ct = default);

    Task<TableSummaryResponse> CreateTableAsync(CreateTableRequest request, CancellationToken ct = default);

    Task<TableSummaryResponse?> UpdateTableAsync(long tableId, UpdateTableRequest request, CancellationToken ct = default);

    Task<bool> DeleteTableAsync(long tableId, bool hard = false, CancellationToken ct = default);
}

public partial interface IGridBaseService
{
    Task<bool> DeleteColumnByNameAsync(
        string tableName, string columnName, bool hard = false, CancellationToken ct = default);

    Task<IReadOnlyList<EmptyColumnInfo>> GetEmptyColumnsAsync(long tableId, CancellationToken ct = default);

    Task<IReadOnlyList<long>> PruneEmptyColumnsAsync(
        long tableId, IReadOnlyList<long>? columnIds = null, CancellationToken ct = default);
}
public record FilterDescriptor(string Column, string Op, string? Value)
{
    public static FilterDescriptor? TryParse(string raw)
    {
        var parts = raw.Split(':', 3);
        return parts.Length >= 2
            ? new(parts[0], parts[1], parts.Length == 3 ? parts[2] : null)
            : null;
    }
}

public sealed class SelectDescriptor
{
    public bool IsExclude { get; init; }
    public IReadOnlySet<string> Fields { get; init; } = new HashSet<string>();

    public static SelectDescriptor? TryParse(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;

        var tokens = raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        if (tokens.Length == 0) return null;

        var isExclude = tokens[0].StartsWith('-');

        var fields = tokens
            .Select(t => t.StartsWith('-') ? t[1..] : t)
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        return new SelectDescriptor { IsExclude = isExclude, Fields = fields };
    }
}

public record SortDescriptor(string Column, bool Descending)
{
    public static SortDescriptor? TryParse(string? raw)
    {
        if (raw is null) return null;
        var parts = raw.Split(':', 2);
        return new(parts[0], parts.Length == 2 && parts[1].ToLower() == "desc");
    }
}



public partial interface IGridBaseService
{

    Task<IReadOnlyList<RelationInfo>> GetRelationsAsync(
        string fromTable, CancellationToken ct = default);

    Task AddRelationAsync(
        string fromTable, string toTable, bool isMultiSelect, CancellationToken ct = default);

    Task<bool> RemoveRelationAsync(
        string fromTable, string toTable, CancellationToken ct = default);
}

public partial interface IGridBaseService
{
    Task<TableSchemaResponse> GetSchemaAsync(string tableName, CancellationToken ct = default);
}
public partial interface IGridBaseService
{
    Task SetColumnValidationAsync(string tableName, string columnName,
    SetColumnValidationRequest request, CancellationToken ct = default);

    Task<ColumnValidationResponse?> GetColumnValidationAsync(string tableName,
        string columnName, CancellationToken ct = default);
}