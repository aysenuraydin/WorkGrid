using workgrid.Application.Common.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public class MenuItemService : BaseService<MenuItem>, IMenuItemService
{
    public MenuItemService(IRepository<MenuItem, long> repository) : base(repository)
    {
    }
}