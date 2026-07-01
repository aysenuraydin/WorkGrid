using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Queries.GetTableColumnTableById;

public class GetDatatableColumnsByTableIdQuery : IRequest<Result<List<DatatableColumnsDto>>>
{
    public long TableId { get; set; }
    public GetDatatableColumnsByTableIdQuery(long id) => TableId = id;
}
public class GetDatatableColumnsByTableIdQueryHandler : IRequestHandler<GetDatatableColumnsByTableIdQuery, Result<List<DatatableColumnsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetDatatableColumnsByTableIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<DatatableColumnsDto>>> Handle(GetDatatableColumnsByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo bazlı cache key → cache-aside ile aktif kolonları
        //   ProjectTo ile (ilişkili tasarım/UI/validation dahil) çek → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}