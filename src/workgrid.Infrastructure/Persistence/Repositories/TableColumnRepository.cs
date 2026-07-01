using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class TableColumnRepository : BaseRepository<TableColumn, long>, ITableColumnRepository
{
    private readonly WorkGridDbContext _context;
    private readonly DbSet<TableColumn> _column;

    public TableColumnRepository(WorkGridDbContext context) : base(context)
    {
        _context = context;
        _column = _context.Set<TableColumn>();
    }

    public async Task<long> CreateTableColumn(TableColumn entity)
    {
        _column.Add(entity);
        await _context.SaveChangesAsync();

        return entity.Id;
    }
}