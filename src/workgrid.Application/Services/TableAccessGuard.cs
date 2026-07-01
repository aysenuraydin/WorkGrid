using workgrid.Application.Common.Interfaces;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public class TableAccessGuard : ITableAccessGuard
{
    private readonly IUser _currentUser;

    public TableAccessGuard(IUser currentUser)
    {
        _currentUser = currentUser;
    }

    public bool IsAdmin =>
        string.Equals(_currentUser.Role, "Admin", StringComparison.OrdinalIgnoreCase)
        || string.Equals(_currentUser.Role, "WG", StringComparison.OrdinalIgnoreCase);

    public void EnsureCanManageTables()
    {
        // 🔒 Hidden. Admin değilse ForbiddenAccess fırlatır.
        throw new NotImplementedException("Source available on request.");
    }

    public void EnsureCanRead(Datatable table)
    {
        // 🔒 Hidden. Akış: Admin → geç. Aksi halde ReadAccess'e göre:
        //   Public → serbest, Authenticated → giriş şart,
        //   RoleBased → gerekli rol kontrolü, Owner → giriş şart (satır filtresi ayrıca).
        throw new NotImplementedException("Source available on request.");
    }

    public void EnsureCanWrite(Datatable table)
    {
        // 🔒 Hidden. Akış: Admin → geç. Aksi halde WriteAccess'e göre seviye kontrolü.
        throw new NotImplementedException("Source available on request.");
    }

    public IEnumerable<TableRow> FilterOwned(Datatable table, IEnumerable<TableRow> rows)
    {
        // 🔒 Hidden. Akış: owner-scope değilse/Admin ise tümünü döndür;
        //   aksi halde owner kolonunu çöz → hücre değeri == kullanıcı id olanları süz.
        throw new NotImplementedException("Source available on request.");
    }

    public bool IsRowOwnedByCurrentUser(Datatable table, TableRow row)
    {
        // 🔒 Hidden. Akış: owner-scope değilse/Admin ise true;
        //   aksi halde owner kolonu hücresi kullanıcı id'sine eşit mi.
        throw new NotImplementedException("Source available on request.");
    }
}