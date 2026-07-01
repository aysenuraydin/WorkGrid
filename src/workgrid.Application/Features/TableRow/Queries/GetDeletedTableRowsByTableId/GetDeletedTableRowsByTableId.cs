using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows.Queries.GetTableColumnTableById;

public class GetDeletedTableRowsByTableIdQuery : IRequest<Result<List<TableRowsDto>>>
{
    public long TableId { get; set; }
    public GetDeletedTableRowsByTableIdQuery(long id) => TableId = id;
}
public class GetDeletedTableRowsByTableIdQueryHandler : IRequestHandler<GetDeletedTableRowsByTableIdQuery, Result<List<TableRowsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetDeletedTableRowsByTableIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<TableRowsDto>>> Handle(GetDeletedTableRowsByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo bazlı cache key → cache-aside ile silinmiş satırları
        //   ProjectTo ile çek → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}