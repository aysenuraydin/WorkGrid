using AutoMapper;
using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableCells.Queries.GetTableColumnTableById;

public record GetTableCellsByColumnIdQuery(long ColumnId) : IRequest<Result<List<TableCellDto>>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Read;
    public long? ColumnIdHint => ColumnId;
}
public class GetTableCellsByColumnIdQueryHandler : IRequestHandler<GetTableCellsByColumnIdQuery, Result<List<TableCellDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetTableCellsByColumnIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<TableCellDto>>> Handle(GetTableCellsByColumnIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolon bazlı cache key → cache-aside ile kolonun dolu,
        //   silinmemiş (satırı da silinmemiş) hücrelerini ProjectTo ile çek →
        //   boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}