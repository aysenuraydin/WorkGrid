using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;
using workgrid.Infrastructure.Persistence.Common;

namespace workgrid.Infrastructure.Persistence.Seeders;

public class DatatableSeeder : ISeeder
{
    public static readonly (string Name, ModalSizeType Modal, TableViewType View, int PageSize)[] Tables = new[]
    {
        // ── BLOG ──
        ("WG Blog Category",    ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Blog",             ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Blog Comment",     ModalSizeType.Lg, TableViewType.List, 10),
        // ── E-TİCARET: temel  
        ("WG Product Category", ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Product",          ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Product Comment",  ModalSizeType.Lg, TableViewType.List, 10),
        // ── VARYANT ─ 
        ("WG Variant Type",     ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Variant Option",   ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Product Variant",  ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Price Tier",       ModalSizeType.Lg, TableViewType.List, 10),
        // ── ALIŞVERİŞ ─  
        ("WG Cart",             ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Coupon",           ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Favorites",        ModalSizeType.Lg, TableViewType.List, 10),
        // ── ÜRÜN EK ─ 
        ("WG Product Feature",  ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Product Service",  ModalSizeType.Lg, TableViewType.List, 10),
        // ── SİPARİŞ ─ 
        ("WG Address",          ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Order",            ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Order Item",       ModalSizeType.Lg, TableViewType.List, 10),
        ("WG Invoice",          ModalSizeType.Lg, TableViewType.List, 10),
    };

    public async Task Seed(IWorkGridDbContext context)
    {
        var existingNames = await context.Datatables
            .Select(t => t.Name)
            .ToListAsync();

        foreach (var def in Tables)
        {
            if (existingNames.Contains(def.Name)) continue;

            var table = Datatable.Create(def.Name, def.Modal, def.View, def.PageSize);
            await context.Datatables.AddAsync(table);
        }

        await context.SaveChangesAsync();
    }
}