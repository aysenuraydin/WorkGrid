using AutoMapper;
using workgrid.Application.Features.Datatables.Commands.CreateDatatable;
using workgrid.Application.Features.Datatables.Commands.UpdateDatatable;
using workgrid.Application.Mapping;
using workgrid.Domain.Entities;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Datatables;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Datatable, CreateDatatableCommand>().ReverseMap();
        CreateMap<Datatable, UpdateDatatableCommand>().ReverseMap();

        CreateMap<DatatableWithRelationsDto, Datatable>().ReverseMap();
        CreateMap<DatatableWithColumnsDto, Datatable>().ReverseMap();

        CreateMap<DatatableDto, Datatable>().ReverseMap();
        CreateMap<Datatable, TableDto>().ReverseMap();

        CreateMap<ForeignTable, ForeignTableDto>()
            .ForMember(
                d => d.ForeignTableName,
                opt => opt.MapFrom(src => src.ForeignTableFk.Name)
            );

        CreateMap<TableWithRelationsDto, Datatable>().ReverseMap();
        CreateMap<string, DateOnly>().ConvertUsing(new DateTimeTypeConverter());
    }
}
