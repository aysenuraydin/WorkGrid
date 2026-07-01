using AutoMapper;
using workgrid.Application.Features.TableRows.Commands.CreateTableRow;
using workgrid.Application.Mapping;
using workgrid.Domain.Entities;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TableRow, CreateTableRowCommand>().ReverseMap();

        CreateMap<DatatableRowsDto, TableRow>().ReverseMap();
        CreateMap<TableRowsDto, TableRow>().ReverseMap();

        CreateMap<string, DateOnly>().ConvertUsing(new DateTimeTypeConverter());
    }
}
