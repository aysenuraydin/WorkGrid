using AutoMapper;
using workgrid.Application.Features.Datatables.Commands.CreateDatatable;
using workgrid.Application.Features.Datatables.Commands.UpdateDatatable;
using workgrid.Application.Mapping;
using workgrid.Domain.Entities;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableCells;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TableCellDto, TableCell>().ReverseMap();

        CreateMap<string, DateOnly>().ConvertUsing(new DateTimeTypeConverter());
    }
}
