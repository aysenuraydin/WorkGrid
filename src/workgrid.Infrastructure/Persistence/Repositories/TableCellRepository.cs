using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class TableCellRepository : BaseRepository<TableCell, long>, ITableCellRepository
{
    public TableCellRepository(WorkGridDbContext context) : base(context)
    {

    }

    // public async Task<List<Customer>> GetAllWithUser(int page = 1, int pageCount = 10)
    // {
    //     return await _context.Customers
    //         .Skip((page - 1) * pageCount)
    //         .Take(pageCount)
    //         .Include(x => x.UserFk)
    //         .OrderByDescending(x => x.Id)
    //         .ToListAsync();
    // }
}