using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class DatatablesWithColumnsDto
{
    public long TableId { get; set; }
    public List<DatatableColumnsNamesDto> Columns { get; set; } = null!;
}
