using AutoMapper;
using workgrid.Application.Features.MenuItems.Commands.CreateDivider;
using workgrid.Application.Features.MenuItems.Commands.CreateMenuItem;
using workgrid.Application.Features.MenuItems.Commands.UpdateDivider;
using workgrid.Application.Features.MenuItems.Commands.UpdateMenuItem;
using workgrid.Application.Mapping;
using workgrid.Domain.Entities;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.MenuItems;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<MenuItem, CreateMenuItemCommand>().ReverseMap();
        CreateMap<MenuItem, UpdateMenuItemCommand>().ReverseMap();

        CreateMap<CreateDividerCommand, MenuItem>()
            .ForMember(dest => dest.Icon, opt => opt.Ignore())
            .ForMember(dest => dest.Link, opt => opt.Ignore())
            .ForMember(dest => dest.ParentId, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.BadgeFk, opt => opt.Ignore());
        CreateMap<UpdateDividerCommand, MenuItem>()
            .ForMember(dest => dest.Icon, opt => opt.Ignore())
            .ForMember(dest => dest.Link, opt => opt.Ignore())
            .ForMember(dest => dest.ParentId, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.BadgeFk, opt => opt.Ignore());

        // Table mapping . 
        CreateMap<MenuItem, MenuItemDto>()
            .ForMember(dest => dest.BadgeName, opt => opt.MapFrom(src => src.BadgeFk != null ? src.BadgeFk.Name : string.Empty))
            .ForMember(dest => dest.BadgeColor, opt => opt.MapFrom(src => src.BadgeFk != null ? src.BadgeFk.Color : string.Empty))
            .ReverseMap();

        CreateMap<string, DateOnly>().ConvertUsing(new DateTimeTypeConverter());
    }
}
