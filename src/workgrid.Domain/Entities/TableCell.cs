using workgrid.Domain.Common;
using workgrid.Domain.Events;
namespace workgrid.Domain.Entities;

public class TableCell : BaseAuditableEntity<long>
{
    public string? Value { get; private set; }

    public long ColumnId { get; private set; }
    public TableColumn ColumnFk { get; private set; } = null!;

    public long RowId { get; private set; }
    public TableRow RowFk { get; private set; } = null!;

    public TableCell() { }

    public static TableCell Create(long columnId, long rowId, string value)
    {
        var cell = new TableCell
        {
            ColumnId = columnId,
            RowId = rowId,
            Value = value
        };
        cell.AddDomainEvent(new TableCellCreatedEvent(cell));
        return cell;
    }
    public static TableCell Create(long columnId, TableRow row, string value)
    {
        var cell = new TableCell
        {
            ColumnId = columnId,
            RowFk = row,
            Value = value
        };
        cell.AddDomainEvent(new TableCellCreatedEvent(cell));
        return cell;
    }

    public static TableCell Create(TableColumn column, long rowId, string value)
    {
        var cell = new TableCell
        {
            ColumnFk = column,
            RowId = rowId,
            Value = value
        };
        cell.AddDomainEvent(new TableCellCreatedEvent(cell));
        return cell;
    }
    public static TableCell Create(TableColumn column, TableRow row, string value)
    {
        var cell = new TableCell
        {
            ColumnFk = column,
            RowFk = row,
            Value = value
        };
        cell.AddDomainEvent(new TableCellCreatedEvent(cell));
        return cell;
    }

    public void Update(string value)
    {
        Value = value;
        AddDomainEvent(new TableCellUpdatedEvent(this));
    }
    public void Delete()
    {
    }
    public void HardDelete()
    {
        IsHardDelete = true;
    }
}