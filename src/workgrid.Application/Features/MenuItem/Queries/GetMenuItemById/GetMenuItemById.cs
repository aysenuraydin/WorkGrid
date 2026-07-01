using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.MenuItems.Queries.GetMenuItemById;

public class GetMenuItemByIdQuery : IRequest<Result<MenuItemDto>>
{
    public long Id { get; set; }
    public GetMenuItemByIdQuery(long id) => Id = id;
}
public class GetMenuItemByIdQueryHandler : IRequestHandler<GetMenuItemByIdQuery, Result<MenuItemDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetMenuItemByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<MenuItemDto>> Handle(GetMenuItemByIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: id'li cache key → cache-aside ile öğeyi ProjectTo ile
        //   çek → varsa Success, yoksa Failure.
        throw new NotImplementedException("Source available on request.");
    }
}