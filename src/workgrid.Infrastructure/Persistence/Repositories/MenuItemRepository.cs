using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class MenuItemRepository : BaseRepository<MenuItem, long>, IMenuItemRepository
{
    public MenuItemRepository(WorkGridDbContext context) : base(context)
    {

    }
}