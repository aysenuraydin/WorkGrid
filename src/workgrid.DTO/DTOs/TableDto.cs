using workgrid.Domain.Enums;

namespace workgrid.DTO.DTOs;

public class TableDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public int? ModalHeight { get; set; }
    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
    public List<ForeignTableDto>? ForeignTablesFk { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModifiedAt { get; set; }

    public string? LastModifiedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public string? DeletedBy { get; set; }
}


public sealed class CreateTableRequest
{
    public string Name { get; set; } = null!;

    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
    public int? ModalHeight { get; set; }
}

public sealed class UpdateTableRequest
{
    public string? Name { get; set; }
    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
    public int? ModalHeight { get; set; }
}

public sealed class TableSummaryResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
    public int? ModalHeight { get; set; }

    public AccessLevel ReadAccess { get; set; }
    public AccessLevel WriteAccess { get; set; }
    public string? ReadRequiredRole { get; set; }
    public string? WriteRequiredRole { get; set; }
    public bool IsOwnerScoped { get; set; }
    public string? OwnerColumn { get; set; }

    public int ColumnCount { get; set; }
    public int RowCount { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}



public sealed class EmptyColumnInfo
{
    public long ColumnId { get; set; }
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
    public int CellCount { get; set; }
}

public sealed class PruneColumnsRequest
{
    public List<long>? ColumnIds { get; set; }
}

