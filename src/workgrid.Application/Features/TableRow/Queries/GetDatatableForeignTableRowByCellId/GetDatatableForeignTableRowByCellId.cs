using AutoMapper;
using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows.Queries.GetTableColumnTableById;

public class GetDatatableForeignTableRowByCellIdQuery : IRequest<Result<DatatableRowsDto>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? CellIdHint => CellId;
    public long CellId { get; set; }
    public long RealRowId { get; set; }

    public GetDatatableForeignTableRowByCellIdQuery(long cellId, long realRowId)
    {
        CellId = cellId;
        RealRowId = realRowId;
    }
    public class GetDatatableForeignTableRowByCellIdQueryHandler : IRequestHandler<GetDatatableForeignTableRowByCellIdQuery, Result<DatatableRowsDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAppCache _redisCache;

        public GetDatatableForeignTableRowByCellIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _redisCache = redisCache;
        }

        public async Task<Result<DatatableRowsDto>> Handle(GetDatatableForeignTableRowByCellIdQuery request, CancellationToken cancellationToken)
        {
            // 🔒 Hidden. Akış: cell+realRow bazlı cache key → cache-aside ile hedef
            //   satırı ProjectTo ile çek → yoksa Failure → Result.
            throw new NotImplementedException("Source available on request.");
        }
    }
}