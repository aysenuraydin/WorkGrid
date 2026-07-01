using workgrid.Application.Common.Interfaces;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public partial class GridBaseService : IGridBaseService
{
    private readonly IGridBaseRepository _repo;
    private readonly IUser _currentUser;

    public GridBaseService(IGridBaseRepository repo, IUser currentUser)
    {
        _repo = repo;
        _currentUser = currentUser;
    }

    private bool IsAdmin =>
        string.Equals(_currentUser.Role, "Admin", StringComparison.OrdinalIgnoreCase)
        || string.Equals(_currentUser.Role, "WG", StringComparison.OrdinalIgnoreCase);

    private void EnsureCanManageTables()
    {
        // 🔒 Hidden. Admin değilse Unauthorized fırlatır.
        throw new NotImplementedException("Source available on request.");
    }

    private void EnsureCanRead(Datatable table)
    {
        // 🔒 Hidden. Akış: Admin → geç; aksi halde ReadAccess'e göre
        //   Public/Authenticated/RoleBased/Owner kontrolü.
        throw new NotImplementedException("Source available on request.");
    }

    private void EnsureCanWrite(Datatable table)
    {
        // 🔒 Hidden. Akış: Admin → geç; aksi halde WriteAccess seviye kontrolü.
        throw new NotImplementedException("Source available on request.");
    }

    private IEnumerable<TableRow> FilterOwned(Datatable table, IEnumerable<TableRow> rows)
    {
        // 🔒 Hidden. Akış: owner-scope değil/Admin → tümü; aksi halde owner kolonunu
        //   çöz → hücre değeri kullanıcı id'sine eşit satırları döndür.
        throw new NotImplementedException("Source available on request.");
    }

    private void StampOwner(Datatable table, IDictionary<string, object?> body)
    {
        // 🔒 Hidden. owner-scope ise body'ye owner kolonu = kullanıcı id yazar.
        throw new NotImplementedException("Source available on request.");
    }

    private bool IsRowOwnedByCurrentUser(Datatable table, TableRow row)
    {
        // 🔒 Hidden. owner-scope değil/Admin → true; aksi halde owner hücresi kontrolü.
        throw new NotImplementedException("Source available on request.");
    }

    private async Task<Datatable> ResolveTableAsync(string tableName, CancellationToken ct) =>
        await _repo.ResolveTableAsync(tableName, ct);

    public async Task SetTableAccessAsync(
        string tableName, SetTableAccessRequest request, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: tabloyu çöz → SetAccess (read/write/role/owner) → kaydet.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<IReadOnlyList<IDictionary<string, object?>>> GetAllAsync(string tableName, IReadOnlyList<FilterDescriptor>? filters = null, SortDescriptor? sort = null, SelectDescriptor? select = null, string? search = null, IReadOnlyList<string>? searchFields = null, IReadOnlyList<string>? expand = null, CancellationToken ct = default)
    {
        throw new NotImplementedException("Source available on request.");
    }

    public Task<IDictionary<string, object?>?> GetByIdAsync(string tableName, long rowId, SelectDescriptor? select = null, IReadOnlyList<string>? expand = null, CancellationToken ct = default)
    {
        throw new NotImplementedException("Source available on request.");
    }

    public Task<PagedResult> GetPagedAsync(string tableName, int page = 1, int? pageSize = null, IReadOnlyList<FilterDescriptor>? filters = null, SortDescriptor? sort = null, SelectDescriptor? select = null, string? search = null, IReadOnlyList<string>? searchFields = null, IReadOnlyList<string>? expand = null, CancellationToken ct = default)
    {
        throw new NotImplementedException("Source available on request.");
    }

    public Task<TableSchemaResponse> GetSchemaAsync(string tableName, CancellationToken ct = default)
    {
        throw new NotImplementedException("Source available on request.");
    }

    public Task SetColumnValidationAsync(string tableName, string columnName, SetColumnValidationRequest request, CancellationToken ct = default)
    {
        throw new NotImplementedException("Source available on request.");
    }

    public Task<ColumnValidationResponse?> GetColumnValidationAsync(string tableName, string columnName, CancellationToken ct = default)
    {
        throw new NotImplementedException("Source available on request.");
    }
}
