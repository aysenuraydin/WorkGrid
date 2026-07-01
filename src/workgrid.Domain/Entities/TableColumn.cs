using workgrid.Domain.Common;
using workgrid.Domain.Enums;
using workgrid.Domain.Events;
namespace workgrid.Domain.Entities;

public class TableColumn : BaseAuditableEntity<long>
{
    public ModalDesign? ModalDesignFk { get; private set; } = new();
    public InputTypeEnum Type { get; private set; }
    public string Name { get; private set; } = null!;
    public int TableOrder { get; private set; }
    public bool IsVisible { get; private set; }
    public bool? IsFilter { get; private set; }

    public long? RealColumnId { get; private set; }
    public long? RealTableId { get; private set; }
    public long TableId { get; private set; }
    public Datatable TableFk { get; private set; } = null!;
    public ICollection<TableCell> CellsFk { get; private set; } = new List<TableCell>();
    public string? FunctionText { get; private set; }
    public ColumnValidationConfig? ValidationFk { get; private set; } = new();
    public ColumnDesignConfig? DesignFk { get; private set; } = new();
    public List<ColumnUIConfig>? UiFk { get; private set; } = new List<ColumnUIConfig>();
    public List<ColumnDataConfig>? DataFk { get; private set; } = new List<ColumnDataConfig>();

    public TableColumn() { }

    public static TableColumn Create(long tableId, InputTypeEnum type, string name, int tableOrder, bool isVisible, bool isFilter)
    {
        var entity = new TableColumn
        {
            TableId = tableId,
            Type = type,
            Name = name,
            TableOrder = tableOrder,
            IsVisible = isVisible,
            IsFilter = isFilter
        };
        entity.AddDomainEvent(new TableColumnCreatedEvent(entity));
        return entity;
    }
    public static TableColumn Create(long tableId, InputTypeEnum type, string name, int tableOrder, long realColumnId, long realTableId)
    {
        var entity = new TableColumn
        {
            TableId = tableId,
            Type = type,
            Name = name,
            TableOrder = tableOrder,
            IsVisible = false,
            IsFilter = false,
            RealColumnId = realColumnId,
            RealTableId = realTableId,
        };
        entity.AddDomainEvent(new TableColumnCreatedEvent(entity));
        return entity;
    }

    public static TableColumn CreateForeignLink(
    long tableId,
    string name,
    int tableOrder,
    long realTableId,
    bool isVisible = false)
    {
        var entity = new TableColumn
        {
            TableId = tableId,
            Type = InputTypeEnum.Text,
            Name = name,
            TableOrder = tableOrder,
            IsVisible = isVisible,
            IsFilter = false,
            RealColumnId = null,
            RealTableId = realTableId,
        };
        entity.AddDomainEvent(new TableColumnCreatedEvent(entity));
        return entity;
    }
    public static TableColumn CreateParent(
    long tableId,
    string name,
    int tableOrder,
    long realTableId)
    {
        var entity = new TableColumn
        {
            TableId = tableId,
            Type = InputTypeEnum.Parent,
            Name = name,
            TableOrder = tableOrder,
            IsVisible = false,
            IsFilter = false,
            RealColumnId = null,
            RealTableId = realTableId,
        };
        entity.AddDomainEvent(new TableColumnCreatedEvent(entity));
        return entity;
    }



    public void Update(InputTypeEnum type, string name, int tableOrder, bool isVisible, bool isFilter)
    {
        Type = type;
        Name = name;
        TableOrder = tableOrder;
        IsVisible = isVisible;
        IsFilter = isFilter;
        AddDomainEvent(new TableColumnUpdatedEvent(this));
    }

    public void UpdateDesign(string classes, string styles, string js)
    {
        if (DesignFk == null) DesignFk = new ColumnDesignConfig();
        DesignFk.Class = classes;
        DesignFk.Styles = styles;
        DesignFk.Js = js;
        AddDomainEvent(new TableColumnWithDesignUpdatedEvent(this));
    }

    public void UpdateFunction(string? functionText)
    {
        FunctionText = functionText;
        AddDomainEvent(new TableColumnWithFunctionUpdatedEvent(this));
    }

    public void UpdateModalDesign(
        int? order,
        int? width,
        int? spaceTop,
        int? spaceBottom,
        int? spaceLeft,
        int? spaceRight,
        bool? isVisible,
        int? x,
        int? y,
        bool? isMove
    )
    {

        if (ModalDesignFk == null)
            ModalDesignFk = new ModalDesign();

        ModalDesignFk.Order = order;
        ModalDesignFk.Width = width;
        ModalDesignFk.SpaceTop = spaceTop;
        ModalDesignFk.SpaceBottom = spaceBottom;
        ModalDesignFk.SpaceLeft = spaceLeft;
        ModalDesignFk.SpaceRight = spaceRight;
        ModalDesignFk.IsVisible = isVisible;
        ModalDesignFk.X = x;
        ModalDesignFk.Y = y;
        ModalDesignFk.IsMove = isMove;

        AddDomainEvent(new TableColumnWithModalUpdatedEvent(this));
    }

    public void UpdateOptions(List<ColumnUIConfig>? uiConfigs, List<ColumnDataConfig>? dataConfigs)
    {
        uiConfigs ??= new List<ColumnUIConfig>();
        dataConfigs ??= new List<ColumnDataConfig>();

        var uiToRemove = UiFk
            .Where(db => !uiConfigs.Any(r => r.Type == db.Type))
            .ToList();

        foreach (var item in uiToRemove) UiFk.Remove(item);

        foreach (var rUi in uiConfigs)
        {
            var existing = UiFk.FirstOrDefault(x => x.Type == rUi.Type);
            if (existing != null)
                existing.Value = rUi.Value;
            else
                UiFk.Add(new ColumnUIConfig { Type = rUi.Type, Value = rUi.Value });
        }

        var dataToRemove = DataFk
            .Where(db => !dataConfigs.Any(r => r.Type == db.Type))
            .ToList();

        foreach (var item in dataToRemove) DataFk.Remove(item);

        foreach (var rData in dataConfigs)
        {
            var existing = DataFk.FirstOrDefault(x => x.Type == rData.Type);
            if (existing != null)
                existing.Value = rData.Value;
            else
                DataFk.Add(new ColumnDataConfig { Type = rData.Type, Value = rData.Value });
        }

        AddDomainEvent(new TableColumnWithOptionUpdatedEvent(this));
    }

    public void UpdateValidation(FieldTypeEnum type, List<RulesValidationConfig> rules)
    {
        ValidationFk ??= new ColumnValidationConfig { Type = type, Rules = rules };

        if (ValidationFk != null)
        {
            ValidationFk.Type = type;
            ValidationFk.Rules.Clear();
            foreach (var r in rules) ValidationFk.Rules.Add(r);
        }
        AddDomainEvent(new TableColumnWithValidationUpdatedEvent(this));
    }

    public void ChangeTableOrder(int order)
    {
        TableOrder = order;
        AddDomainEvent(new TableColumnUpdatedEvent(this));
    }

    public void Delete()
    {
        AddDomainEvent(new TableColumnDeletedEvent(this));
    }
    public void HardDelete()
    {
        IsHardDelete = true;
        AddDomainEvent(new TableColumnDeletedEvent(this));
    }

    public void Restore()
    {
        DeletedAt = null;
        DeletedBy = null;

        if (CellsFk != null && CellsFk.Any())
            foreach (var cell in CellsFk)
            {
                cell.DeletedAt = null;
                cell.DeletedBy = null;
            }


        AddDomainEvent(new TableColumnRestoredDeletedEvent(this));
    }
};
