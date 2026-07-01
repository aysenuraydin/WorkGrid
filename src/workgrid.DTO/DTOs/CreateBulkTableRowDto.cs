using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public record CreateBulkTableRowDto(List<TableCellDto> CellsFk);