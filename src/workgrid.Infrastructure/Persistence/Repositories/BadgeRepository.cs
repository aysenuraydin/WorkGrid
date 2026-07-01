using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class BadgeRepository : BaseRepository<Badge, long>, IBadgeRepository
{
    public BadgeRepository(WorkGridDbContext context) : base(context)
    {

    }
}