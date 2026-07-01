using workgrid.Application.Common.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public class TableRowService : BaseService<TableRow>, ITableRowService
{
    public TableRowService(IRepository<TableRow, long> repository) : base(repository)
    {
    }
}