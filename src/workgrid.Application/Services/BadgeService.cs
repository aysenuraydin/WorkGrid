using workgrid.Application.Common.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public class BadgeService : BaseService<Badge>, IBadgeService
{
    public BadgeService(IRepository<Badge, long> repository) : base(repository)
    {
    }
}