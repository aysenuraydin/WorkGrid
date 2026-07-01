using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class ValidationRepository : BaseRepository<ColumnValidationConfig, long>, IValidationRepository
{
    public ValidationRepository(WorkGridDbContext context) : base(context)
    {

    }
}