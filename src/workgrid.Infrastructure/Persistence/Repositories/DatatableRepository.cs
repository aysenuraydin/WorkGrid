using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class TableRepository : BaseRepository<Datatable, long>, ITableRepository
{
    public TableRepository(WorkGridDbContext context) : base(context)
    {

    }
}