using AutoMapper;
using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows.Queries.GetTableColumnTableById;

public class GetForeignTableRowByTableIdQuery : IRequest<Result<List<ForeignTableGroupDto>>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Read;
    public long? TableIdHint => TableId;
    public long TableId { get; set; }
    public GetForeignTableRowByTableIdQuery(long tableId) => TableId = tableId;
}


public class GetForeignTableRowByTableIdQueryHandler : IRequestHandler<GetForeignTableRowByTableIdQuery, Result<List<ForeignTableGroupDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetForeignTableRowByTableIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<ForeignTableGroupDto>>> Handle(GetForeignTableRowByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablonun real kolon id'lerini bul → bu kolonların ait
        //   olduğu kaynak tabloları ve kolonlarını grupla → o tabloların aktif
        //   satır+hücrelerini çek → kaynak tabloya göre gruplayıp DTO'ya dönüştür → Result.
        throw new NotImplementedException("Source available on request.");
    }
}