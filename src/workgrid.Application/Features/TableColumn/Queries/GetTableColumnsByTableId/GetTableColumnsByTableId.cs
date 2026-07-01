using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Queries.GetTableColumnTableById;

public class GetTableColumnsByTableIdQuery : IRequest<Result<List<TableColumnsDto>>>
{
    public long TableId { get; set; }
    public GetTableColumnsByTableIdQuery(long id) => TableId = id;
}
public class GetTableColumnsByTableIdQueryHandler : IRequestHandler<GetTableColumnsByTableIdQuery, Result<List<TableColumnsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetTableColumnsByTableIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<TableColumnsDto>>> Handle(GetTableColumnsByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo bazlı cache key → cache-aside ile aktif kolonları
        //   ProjectTo ile çek → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}