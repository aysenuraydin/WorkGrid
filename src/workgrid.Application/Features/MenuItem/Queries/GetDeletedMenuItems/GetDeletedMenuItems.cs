using AutoMapper;
using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.MenuItems.Queries.GetDeletedMenuItems;

public record GetDeletedMenuItemsQuery : IRequest<Result<List<MenuItemDto>>>;
public class GetMenuItemQueryHandler : IRequestHandler<GetDeletedMenuItemsQuery, Result<List<MenuItemDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAppCache _redisCache;

    public GetMenuItemQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _redisCache = redisCache;
    }

    public async Task<Result<List<MenuItemDto>>> Handle(GetDeletedMenuItemsQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: cache key → cache-aside ile silinmiş öğeleri ProjectTo ile
        //   çek → varsa Success, yoksa Failure.
        throw new NotImplementedException("Source available on request.");
    }
}