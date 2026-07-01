using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Datatables.Queries.GetTables;

public record GetDatatablesWithRelationshipsQuery : IRequest<Result<List<DatatableWithRelationsDto>>>;
public class GetDatatablesWithRelationshipsQueryHandler : IRequestHandler<GetDatatablesWithRelationshipsQuery, Result<List<DatatableWithRelationsDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetDatatablesWithRelationshipsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<DatatableWithRelationsDto>>> Handle(GetDatatablesWithRelationshipsQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: cache-aside ile aktif tabloları projeksiyonla çek →
        //   her tablo için normal kolonlar + foreign ilişkilerden türetilen sanal
        //   kolonları birleştir → boşsa Failure → Result.
        throw new NotImplementedException("Source available on request.");
    }
}