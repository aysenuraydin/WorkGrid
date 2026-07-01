using workgrid.Application.Common.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public class TableColumnService : BaseService<TableColumn>, ITableColumnService
{
    public TableColumnService(IRepository<TableColumn, long> repository) : base(repository)
    {
    }
}