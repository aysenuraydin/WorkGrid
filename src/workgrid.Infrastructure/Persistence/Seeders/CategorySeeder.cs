using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Infrastructure.Persistence.Common;

namespace workgrid.Infrastructure.Persistence.Seeders;

public class CategorySeeder : ISeeder
{
    private IWorkGridDbContext _ctx = null!;
    private List<TableColumn> _columns = null!;
    private Dictionary<string, long> _tableByName = null!;

    private static readonly string[] ProductCategories = { "Elektronik", "Giyim", "Ev & Yaşam" };
    private static readonly string[] BlogCategories = { "Teknoloji", "Yaşam", "Gezi" };

    public async Task Seed(IWorkGridDbContext context)
    {
        _ctx = context;

        var tables = await context.Datatables.ToListAsync();
        if (!tables.Any()) return;

        _tableByName = tables.ToDictionary(t => t.Name, t => t.Id);
        _columns = await context.TableColumns.ToListAsync();

        await SeedCategories("WG Product Category", ProductCategories);
        await SeedCategories("WG Blog Category", BlogCategories);
    }

    private async Task<long> CreateRowWithAllCells(long tableId, Dictionary<string, string> values)
    {
        var row = TableRow.Create(tableId);
        await _ctx.TableRows.AddAsync(row);
        await _ctx.SaveChangesAsync();

        var realCols = _columns.Where(c =>
            c.TableId == tableId &&
            c.DeletedAt == null &&
            c.RealColumnId == null &&
            c.RealTableId == null
        ).ToList();

        foreach (var col in realCols)
        {
            var match = values.FirstOrDefault(kv =>
                string.Equals(kv.Key, col.Name, StringComparison.OrdinalIgnoreCase));
            var value = match.Key != null ? match.Value : "";

            var cell = TableCell.Create(col.Id, row.Id, value);
            await _ctx.TableCells.AddAsync(cell);
        }
        await _ctx.SaveChangesAsync();

        return row.Id;
    }

    private async Task SeedCategories(string tableName, string[] categories)
    {
        if (!_tableByName.TryGetValue(tableName, out var tableId)) return;

        var nameCol = FindColumn(tableId, "name");
        if (nameCol == null) return;

        var hasRows = await _ctx.TableRows
            .AnyAsync(r => r.TableId == tableId && r.DeletedAt == null);
        if (hasRows) return;

        foreach (var category in categories)
        {
            await CreateRowWithAllCells(tableId, new() { ["name"] = category });
        }
    }

    private TableColumn? FindColumn(long tableId, string name) =>
        _columns.FirstOrDefault(c =>
            c.TableId == tableId && c.Name != null
            && c.Name.ToLower() == name.ToLower() && c.DeletedAt == null);
}