using AutoMapper;
using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows.Queries.GetTables;

public class GetTableRowsByColumnIdQuery : IRequest<Result<List<TableRowsDto>>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Read;
    public long? ColumnIdHint => Id;
    public long Id { get; set; }
    public GetTableRowsByColumnIdQuery(long id) => Id = id;
}
public class GetTableRowsByColumnIdQueryHandler : IRequestHandler<GetTableRowsByColumnIdQuery, Result<List<TableRowsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetTableRowsByColumnIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<TableRowsDto>>> Handle(GetTableRowsByColumnIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolondan tableId'yi çöz → yoksa Failure →
        //   tablo bazlı cache-aside ile satırları ProjectTo ile çek → Result.
        throw new NotImplementedException("Source available on request.");
    }
}