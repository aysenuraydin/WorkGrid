using AutoMapper;
using workgrid.Application.Features.TableColumns.Commands.CreateTableColumn;
using workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;
using workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithDesign;
using workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithModal;
using workgrid.Application.Mapping;
using workgrid.Domain.Entities;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TableColumn, DatatableColumnsDto>().ReverseMap();

        CreateMap<ModalDesign, ModalDesignDto>().ReverseMap();

        CreateMap<TableColumn, TableColumnsDto>().ReverseMap();
        CreateMap<TableColumn, DeletedTableColumnsDto>().ReverseMap();

        CreateMap<TableColumn, TableWithRelationsColumnDto>().ReverseMap();
        CreateMap<ModalDesign, ColumnDesignItemDto>().ReverseMap();


        CreateMap<ColumnValidationConfigDto, ColumnValidationConfig>().ReverseMap();
        CreateMap<RulesValidationConfigDto, RulesValidationConfig>().ReverseMap();

        CreateMap<TableColumn, CreateTableColumnCommand>().ReverseMap();
        CreateMap<TableColumn, UpdateTableColumnCommand>().ReverseMap();

        CreateMap<UpdateTableColumnWithModalDesignCommand, ModalDesign>();

        CreateMap<ColumnUIConfig, ColumnUIConfigDto>().ReverseMap();
        CreateMap<ColumnDataConfig, ColumnDataConfigDto>().ReverseMap();

        CreateMap<UpdateTableColumnWithModalDesignCommand, ModalDesign>();

        CreateMap<UpdateTableColumnWithDesignCommand, ColumnDesignConfig>();

        CreateMap<ColumnValidationConfigDto, ColumnValidationConfig>();
        CreateMap<RulesValidationConfigDto, RulesValidationConfig>();

        CreateMap<string, DateOnly>().ConvertUsing(new DateTimeTypeConverter());

        CreateMap<IGrouping<long, TableColumn>, DatatablesWithColumnsDto>()
            .ForMember(dest => dest.TableId, opt => opt.MapFrom(src => src.Key))
            .ForMember(dest => dest.Columns, opt => opt.MapFrom(src => src.ToList()));

        CreateMap<TableColumn, DatatableColumnsNamesDto>();
    }
}
