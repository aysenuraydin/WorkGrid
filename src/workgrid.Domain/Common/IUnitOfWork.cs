
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Domain.Common;

public interface IUnitOfWork : IDisposable
{
    ITableRepository TableRepository { get; }
    ITableColumnRepository TableColumnRepository { get; }
    ITableCellRepository TableCellRepository { get; }
    ITableRowRepository TableRowRepository { get; }
    IMenuItemRepository MenuItemRepository { get; }
    IBadgeRepository BadgeRepository { get; }
    IForeignTableRepository ForeignTableRepository { get; }


    IColumnUIRepository ColumnUIRepository { get; }
    IColumnDataRepository ColumnDataRepository { get; }
    IValidationRepository ValidationRepository { get; }
    IRulesRepository RulesRepository { get; }

    IProjectRepository ProjectRepository { get; }

    ICommentRepository CommentRepository { get; }

    int Commit();
    Task<int> CommitAsync(CancellationToken cancellationToken = default);

    Task<ITransaction> BeginTransactionAsync();

}