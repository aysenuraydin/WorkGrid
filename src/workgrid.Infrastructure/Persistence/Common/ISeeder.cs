using workgrid.Application.Common.Interfaces;

namespace workgrid.Infrastructure.Persistence.Common;

public interface ISeeder
{
    Task Seed(IWorkGridDbContext context);
}