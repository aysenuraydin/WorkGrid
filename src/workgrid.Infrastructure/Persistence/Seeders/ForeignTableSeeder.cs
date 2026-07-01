using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Infrastructure.Persistence.Common;

namespace workgrid.Infrastructure.Persistence.Seeders;

public class ForeignTableSeeder : ISeeder
{
    public record FkDef(string FromTable, string ToTable, bool IsMultiSelect = false);

    public static readonly FkDef[] Relations = new[]
    {
        // ── BLOG ──
        new FkDef("WG Blog", "WG Blog Category"),

        // ── E-TİCARET ──
        new FkDef("WG Product", "WG Product Category"),
        new FkDef("WG Variant Type", "WG Product"),
        new FkDef("WG Variant Option", "WG Variant Type"),
        new FkDef("WG Product Variant", "WG Product"),
        new FkDef("WG Price Tier", "WG Product Variant"),

        // ── ALIŞVERİŞ ──
        new FkDef("WG Cart", "WG Product"),
        new FkDef("WG Cart", "WG Product Variant"),
        new FkDef("WG Favorites", "WG Product"),

        // ── ÜRÜN EK ──
        new FkDef("WG Product Feature", "WG Product"),
        new FkDef("WG Product Service", "WG Product"),

        // ── SİPARİŞ ──
        new FkDef("WG Address", "WG Order", IsMultiSelect: true),
        new FkDef("WG Order", "WG Address"),
        new FkDef("WG Order", "WG Product"),
        new FkDef("WG Order Item", "WG Order"),
        new FkDef("WG Order Item", "WG Product"),
        new FkDef("WG Order Item", "WG Product Variant"),
        new FkDef("WG Invoice", "WG Order"),
    };

    private static string BuildLinkColumnName(string foreignTableName, bool isMultiSelect)
    {
        var compact = foreignTableName.Replace(" ", "");
        bool startsWithWg = compact.StartsWith("WG", StringComparison.OrdinalIgnoreCase);
        var prefixed = startsWithWg ? compact : "WG" + compact;
        return isMultiSelect ? $"{prefixed}Ids" : $"{prefixed}Id";
    }

    public async Task Seed(IWorkGridDbContext context)
    {
        if (context.ForeignTables.Any()) return;

        var tables = await context.Datatables.ToListAsync();
        var tableByName = tables.ToDictionary(t => t.Name, t => t.Id);

        var columns = await context.TableColumns.ToListAsync();
        var maxOrderByTable = columns
            .GroupBy(c => c.TableId)
            .ToDictionary(g => g.Key, g => g.Max(c => c.TableOrder));

        var foreignTables = new List<ForeignTable>();
        var linkColumns = new List<TableColumn>();

        foreach (var rel in Relations)
        {
            if (!tableByName.TryGetValue(rel.FromTable, out var fromId)) continue;
            if (!tableByName.TryGetValue(rel.ToTable, out var toId)) continue;

            foreignTables.Add(new ForeignTable
            {
                DatatableId = fromId,
                ForeignTableId = toId,
                CreateOrUpdateColumnId = "",
                ListColumnIds = "",
                IsMultiSelect = rel.IsMultiSelect,
            });

            bool alreadyAdded = linkColumns.Any(c =>
                c.TableId == fromId && c.RealTableId == toId && c.RealColumnId == null);
            if (alreadyAdded) continue;

            var linkName = BuildLinkColumnName(rel.ToTable, rel.IsMultiSelect);
            var nextOrder = (maxOrderByTable.TryGetValue(fromId, out var mo) ? mo : 0) + 1;
            maxOrderByTable[fromId] = nextOrder;

            linkColumns.Add(TableColumn.CreateForeignLink(
                fromId, linkName, nextOrder, toId, isVisible: false));
        }

        foreach (var item in foreignTables)
            await context.ForeignTables.AddAsync(item);

        foreach (var col in linkColumns)
            await context.TableColumns.AddAsync(col);

        await context.SaveChangesAsync();
    }
}