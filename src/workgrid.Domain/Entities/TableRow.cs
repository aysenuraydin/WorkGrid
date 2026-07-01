using workgrid.Domain.Common;
using workgrid.Domain.Events;

namespace workgrid.Domain.Entities;

public class TableRow : BaseAuditableEntity<long>
{

    public ICollection<TableCell> CellsFk { get; private set; } = new List<TableCell>();
    public long TableId { get; private set; }
    public Datatable TableFk { get; private set; } = null!;
    public TableRow() { }

    public static TableRow Create(long tableId)
    {
        var row = new TableRow { TableId = tableId };
        row.AddDomainEvent(new TableRowCreatedEvent(row));
        return row;
    }

    public void Delete()
    {
        AddDomainEvent(new TableRowDeletedEvent(this));
    }

    public void HardDelete()
    {
        IsHardDelete = true;
        AddDomainEvent(new TableRowHardDeletedEvent(this));
    }

    public void Restore()
    {
        DeletedAt = null;
        DeletedBy = null;

        if (CellsFk != null)
        {
            foreach (var cell in CellsFk)
            {
                cell.DeletedAt = null;
                cell.DeletedBy = null;
            }
        }

        AddDomainEvent(new TableRowRestoredDeletedEvent(this));
    }
}