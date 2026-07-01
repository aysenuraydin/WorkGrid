using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Queries.GetDeletedTableColumnTableById;

public class GetDeletedTableColumnsByTableIdQuery : IRequest<Result<List<DeletedTableColumnsDto>>>
{
    public long TableId { get; set; }
    public GetDeletedTableColumnsByTableIdQuery(long id) => TableId = id;
}
public class GetDeletedTableColumnsByTableIdQueryHandler : IRequestHandler<GetDeletedTableColumnsByTableIdQuery, Result<List<DeletedTableColumnsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetDeletedTableColumnsByTableIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<DeletedTableColumnsDto>>> Handle(GetDeletedTableColumnsByTableIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo bazlı cache key → cache-aside ile silinmiş kolonları
        //   ProjectTo ile çek → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}