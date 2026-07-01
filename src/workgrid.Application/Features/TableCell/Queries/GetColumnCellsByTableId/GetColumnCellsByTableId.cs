using AutoMapper;
using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableCells.Queries.GetTableColumnTableById;

public record GetColumnCellsByTableIdQuery(long TableId) : IRequest<Result<List<TableColumnWithCellsDto>>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Read;
    public long? TableIdHint => TableId;
}
public class GetColumnCellsByTableIdQueryHandler : IRequestHandler<GetColumnCellsByTableIdQuery, Result<List<TableColumnWithCellsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetColumnCellsByTableIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<TableColumnWithCellsDto>>> Handle(GetColumnCellsByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo bazlı cache key → real kolon id'lerini bul →
        //   bu kolonların dolu/silinmemiş hücrelerini kolona göre gruplayıp DTO'ya
        //   map'le → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}