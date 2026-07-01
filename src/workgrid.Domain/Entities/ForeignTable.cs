using workgrid.Domain.Common;
namespace workgrid.Domain.Entities;

public class ForeignTable : BaseAuditableEntity<long>
{
    public long DatatableId { get; set; }
    public Datatable DatatableFk { get; set; }
    public long ForeignTableId { get; set; }
    public Datatable ForeignTableFk { get; set; } = null!;
    public string? CreateOrUpdateColumnId { get; set; }
    public string? ListColumnIds { get; set; }
    public string? SelectedRowIds { get; set; }
    public bool IsMultiSelect { get; set; }

    public void ClearColumnReferences(TableColumn column)
    {
        if (CreateOrUpdateColumnId == column.RealColumnId.ToString())
        {
            CreateOrUpdateColumnId = "";
            ListColumnIds = "";
        }
        else if (ListColumnIds?.Split(",").Contains(column.RealColumnId.ToString()) == true)
        {
            ListColumnIds = string.Join(",",
                ListColumnIds.Split(",")
                .Where(x => x != column.RealColumnId.ToString())
            );
        }
    }
}