using workgrid.Application.Common.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public class DatatableService : BaseService<Datatable>, IDatatableService
{
    public DatatableService(IRepository<Datatable, long> repository) : base(repository)
    {
    }
}