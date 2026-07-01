using AutoMapper;
using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows.Queries.GetTableColumnTableById;

public class GetDatatableRowsByTableIdQuery : IRequest<Result<List<DatatableRowsDto>>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Read;
    public long? TableIdHint => TableId;
    public long TableId { get; set; }
    public GetDatatableRowsByTableIdQuery(long id) => TableId = id;
}
public class GetDatatableRowsByTableIdQueryHandler : IRequestHandler<GetDatatableRowsByTableIdQuery, Result<List<DatatableRowsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;
    private readonly ISqlConnectionFactory _connectionFactory;

    public GetDatatableRowsByTableIdQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAppCache redisCache,
        ISqlConnectionFactory connectionFactory)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
        _connectionFactory = connectionFactory;
    }

    public async Task<Result<List<DatatableRowsDto>>> Handle(GetDatatableRowsByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo bazlı cache key → cache-aside içinde Dapper bağlantısı
        //   aç → satır+hücreleri tek sorguda (LEFT JOIN, splitOn) multi-map ile çek →
        //   satırları sözlükte tekilleştirip hücreleri ekle → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}