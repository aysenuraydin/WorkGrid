using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class UserRepository : BaseRepository<User, Guid>, IUserRepository
{
    public UserRepository(WorkGridDbContext context) : base(context)
    {

    }
}