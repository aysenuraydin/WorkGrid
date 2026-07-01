using AutoMapper;
using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows.Queries.GetTableColumnTableById;

public class GetTableRowsByTableIdQuery : IRequest<Result<List<TableRowsDto>>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Read;
    public long? TableIdHint => TableId;
    public long TableId { get; set; }
    public GetTableRowsByTableIdQuery(long id) => TableId = id;
}
public class GetTableRowsByTableIdQueryHandler : IRequestHandler<GetTableRowsByTableIdQuery, Result<List<TableRowsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetTableRowsByTableIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<TableRowsDto>>> Handle(GetTableRowsByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo bazlı cache key → cache-aside ile aktif satırları
        //   ProjectTo ile çek → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}