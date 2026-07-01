using workgrid.Domain.Common;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Repositories;
using workgrid.Infrastructure.Repositories;
using workgrid.Infrastructure.Persistence.Repositories;

namespace workgrid.Infrastructure.Persistence.Common;

public class UnitOfWork : IUnitOfWork
{
    private readonly WorkGridDbContext _context;

    public UnitOfWork(WorkGridDbContext context)
    {
        _context = context;
    }

    private ITableRepository _TableRepository;
    public ITableRepository TableRepository => _TableRepository ??= new TableRepository(_context);

    private ITableColumnRepository _tableColumnRepository;
    public ITableColumnRepository TableColumnRepository => _tableColumnRepository ??= new TableColumnRepository(_context);


    private ITableRowRepository _tableRowRepository;
    public ITableRowRepository TableRowRepository => _tableRowRepository ??= new TableRowRepository(_context);

    private ITableCellRepository _tableCellRepository;
    public ITableCellRepository TableCellRepository => _tableCellRepository ??= new TableCellRepository(_context);


    private IMenuItemRepository _menuItemRepository;
    public IMenuItemRepository MenuItemRepository => _menuItemRepository ??= new MenuItemRepository(_context);

    private IBadgeRepository _badgeRepository;
    public IBadgeRepository BadgeRepository => _badgeRepository ??= new BadgeRepository(_context);

    private IForeignTableRepository _foreignTableRepository;
    public IForeignTableRepository ForeignTableRepository => _foreignTableRepository ??= new ForeignTableRepository(_context);

    private IColumnUIRepository _columnUIConfigRepository;
    public IColumnUIRepository ColumnUIRepository => _columnUIConfigRepository ??= new ColumnUIRepository(_context);

    private IColumnDataRepository _columnDataConfigRepository;
    public IColumnDataRepository ColumnDataRepository => _columnDataConfigRepository ??= new ColumnDataRepository(_context);


    private IValidationRepository _validationRepository;
    public IValidationRepository ValidationRepository => _validationRepository ??= new ValidationRepository(_context);

    private IRulesRepository _rulesRepository;
    public IRulesRepository RulesRepository => _rulesRepository ??= new RulesRepository(_context);

    private IProjectRepository _projectRepository;
    public IProjectRepository ProjectRepository =>
        _projectRepository ??= new ProjectRepository(_context);

    private ICommentRepository? _commentRepository;
    public ICommentRepository CommentRepository =>
        _commentRepository ??= new CommentRepository(_context);

    public async Task<ITransaction> BeginTransactionAsync()
    {
        var tr = await _context.Database.BeginTransactionAsync();
        return new EfTransaction(tr);
    }

    public int Commit() => _context.SaveChanges();
    public async Task<int> CommitAsync(CancellationToken cancellationToken = default) => await _context.SaveChangesAsync(cancellationToken);
    public void Dispose() => _context.Dispose();
}