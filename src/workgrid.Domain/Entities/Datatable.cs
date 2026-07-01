using workgrid.Domain.Common;
using workgrid.Domain.Enums;
using workgrid.Domain.Events.DatatableEvents;

namespace workgrid.Domain.Entities;

public class Datatable : BaseAuditableEntity<long>
{
    public string Name { get; private set; } = null!;
    public ICollection<TableColumn> ColumnsFk { get; private set; } = new List<TableColumn>();
    public ICollection<TableRow> RowsFk { get; private set; } = new List<TableRow>();
    public int? ModalHeight { get; private set; }

    public ModalSizeType? ModalSize { get; private set; }
    public TableViewType? ViewType { get; private set; }
    public int? PageSize { get; private set; }
    public ICollection<ForeignTable> ForeignTablesFk { get; private set; } = new List<ForeignTable>();


    public AccessLevel ReadAccess { get; private set; } = AccessLevel.Authenticated;
    public AccessLevel WriteAccess { get; private set; } = AccessLevel.Authenticated;
    public string? ReadRequiredRole { get; private set; }
    public string? WriteRequiredRole { get; private set; }
    public bool IsOwnerScoped { get; private set; }
    public string? OwnerColumn { get; private set; }

    public Datatable() { }

    public static Datatable Create(string name, ModalSizeType? modalSize, TableViewType? viewType, int? pageSize, int? modalHeight = null)
    {
        var datatable = new Datatable
        {
            Name = name,
            ModalSize = modalSize,
            ViewType = viewType,
            PageSize = pageSize,
            ModalHeight = modalHeight
        };
        datatable.AddDomainEvent(new DatatableCreatedEvent(datatable));
        return datatable;
    }
    public void UpdateForeignTable()
    {
        AddDomainEvent(new ForeignTableUpdatedEvent(this));
    }

    public void Update(string name, ModalSizeType? modalSize, TableViewType? viewType, int? pageSize, int? modalHeight = null)
    {
        Name = name;
        ModalSize = modalSize;
        ViewType = viewType;
        PageSize = pageSize;
        ModalHeight = modalHeight;
        AddDomainEvent(new DatatableUpdatedEvent(this));
    }

    public void ChangeHeight(int newHeight)
    {
        ModalHeight = newHeight;
        AddDomainEvent(new DatatableUpdatedEvent(this));
    }

    public void Delete()
    {
        AddDomainEvent(new DatatableDeletedEvent(this));
    }

    public void HardDelete()
    {
        IsHardDelete = true;
        AddDomainEvent(new DatatableHardDeletedEvent(this));
    }

    public void Restore()
    {
        DeletedAt = null;
        DeletedBy = null;

        if (ColumnsFk != null && ColumnsFk.Any())
        {
            ColumnsFk.ToList().ForEach(col => { col.DeletedAt = null; col.DeletedBy = null; });
        }

        if (RowsFk != null && RowsFk.Any())
        {
            RowsFk.ToList().ForEach(r => { r.DeletedAt = null; r.DeletedBy = null; });

            RowsFk.SelectMany(r => r.CellsFk).ToList().ForEach(c => { c.DeletedAt = null; c.DeletedBy = null; });
        }
        AddDomainEvent(new DatatableRestoreDeletedEvent(this));
    }

    public void SetAccess(
            AccessLevel readAccess,
            AccessLevel writeAccess,
            string? readRequiredRole = null,
            string? writeRequiredRole = null,
            bool isOwnerScoped = false,
            string? ownerColumn = null)
    {
        ReadAccess = readAccess;
        WriteAccess = writeAccess;
        ReadRequiredRole = readRequiredRole;
        WriteRequiredRole = writeRequiredRole;
        IsOwnerScoped = isOwnerScoped;
        OwnerColumn = ownerColumn;
        AddDomainEvent(new DatatableUpdatedEvent(this));
    }
}
