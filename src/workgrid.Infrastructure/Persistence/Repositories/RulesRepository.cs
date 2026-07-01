using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class RulesRepository : BaseRepository<RulesValidationConfig, long>, IRulesRepository
{
    public RulesRepository(WorkGridDbContext context) : base(context)
    {

    }
}