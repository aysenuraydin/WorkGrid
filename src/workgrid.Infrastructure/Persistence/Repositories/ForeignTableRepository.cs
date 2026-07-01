using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class ForeignTableRepository : BaseRepository<ForeignTable, long>, IForeignTableRepository
{
    public ForeignTableRepository(WorkGridDbContext context) : base(context)
    {

    }
}