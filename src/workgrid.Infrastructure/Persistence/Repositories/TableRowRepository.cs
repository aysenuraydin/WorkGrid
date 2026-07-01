using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class TableRowRepository : BaseRepository<TableRow, long>, ITableRowRepository
{
    public TableRowRepository(WorkGridDbContext context) : base(context)
    {

    }
}