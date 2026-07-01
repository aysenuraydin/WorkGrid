using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class ColumnUIRepository : BaseRepository<ColumnUIConfig, long>, IColumnUIRepository
{
    public ColumnUIRepository(WorkGridDbContext context) : base(context)
    {

    }
}