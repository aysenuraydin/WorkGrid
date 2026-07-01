
namespace workgrid.DTO.DTOs;

public class DatatableWithColumnsDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public ICollection<DatatableColumnsDto> ColumnsFk { get; set; } = new List<DatatableColumnsDto>();
}