using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Datatables.Queries.GetTables;

public class GetDatatableByIdQuery : IRequest<Result<DatatableDto>>
{
    public long Id { get; set; }
    public GetDatatableByIdQuery(long id) => Id = id;
}
public class GetDatatableByIdQueryHandler : IRequestHandler<GetDatatableByIdQuery, Result<DatatableDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetDatatableByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<DatatableDto>> Handle(GetDatatableByIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: id'li cache key → cache-aside ile tabloyu ProjectTo ile
        //   çek → yoksa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}