using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface ITableColumnRepository : IRepository<TableColumn, long>
{
    Task<long> CreateTableColumn(TableColumn entity);
}