using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class ColumnDataRepository : BaseRepository<ColumnDataConfig, long>, IColumnDataRepository
{
    public ColumnDataRepository(WorkGridDbContext context) : base(context)
    {

    }
}