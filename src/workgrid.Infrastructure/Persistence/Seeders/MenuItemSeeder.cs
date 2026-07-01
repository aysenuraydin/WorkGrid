using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Infrastructure.Persistence.Common;

namespace workgrid.Infrastructure.Persistence.Seeders;

public class MenuItemSeeder : ISeeder
{
    private IWorkGridDbContext _ctx = null!;
    private int _order = 1;

    public async Task Seed(IWorkGridDbContext context)
    {
        if (context.MenuItems.Any()) return;
        if (!context.Datatables.Any()) return;

        _ctx = context;

        var datatables = await context.Datatables.ToListAsync();
        var tableByName = datatables.ToDictionary(t => t.Name, t => t.Id);
        long? DtId(string name) => tableByName.TryGetValue(name, out var id) ? id : (long?)null;

        await AddDivider("Menü");

        // ── E-Ticaret (açılır parent) ──
        var eticaret = await AddParent("E-Ticaret", "bx bx-store");
        await AddLink("Mağaza", "/store", "bx bx-shopping-bag", eticaret.Id);
        await AddLink("Ürünler", "/products", "bx bx-package", eticaret.Id, "Yeni", "success");
        await AddLink("Siparişlerim", "/orders", "bx bx-receipt", eticaret.Id);
        await AddLink("Sipariş Yönetimi", "/admin-orders", "bx bx-list-check", eticaret.Id);
        await AddLink("Müşteriler", "/customers", "bx bx-group", eticaret.Id);
        await AddLink("Kuponlar", "/coupons", "bx bx-purchase-tag", eticaret.Id);
        await AddLink("Favoriler", "/wishlist", "bx bx-heart", eticaret.Id);
        await AddLink("Sepet", "/cart", "bx bx-cart", eticaret.Id, "3", "danger");
        await AddCategoryMenu("WG Product Category", "/products", "bx bx-category", eticaret.Id, DtId);

        var blog = await AddParent("Blog", "bx bx-news");
        await AddLink("Blog Listesi", "/blog-list", "bx bx-list-ul", blog.Id);
        await AddCategoryMenu("WG Blog Category", "/blog-list", "bx bx-category", blog.Id, DtId);

        var gorevler = await AddParent("Görevler", "bx bx-task");
        await AddLink("Projeler", "/projects", "bx bx-folder-open", gorevler.Id);
        await AddLink("Kanban", "/kanbanboard", "bx bx-grid-alt", gorevler.Id);
        await AddLink("Yapılacaklar", "/toDoList", "bx bx-check-square", gorevler.Id);

        var uygulamalar = await AddParent("Uygulamalar", "bx bx-grid");
        await AddLink("Takvim", "/calendar", "bx bx-calendar", uygulamalar.Id);
        await AddLink("Sohbet", "/chat", "bx bx-chat", uygulamalar.Id, "5", "info");

        var veri = await AddParent("Veri Yönetimi", "bx bx-data");
        await AddLink("Tablolar", "/datatables", "bx bx-table", veri.Id);
        await AddLink("Menü Yönetimi", "/menuItems", "bx bx-menu", veri.Id);

        var tumTablolar = await AddParent("Tüm Tablolar", "bx bx-folder", veri.Id);

        var blogGrup = await AddParent("Blog Tabloları", "bx bx-folder", tumTablolar.Id);
        foreach (var n in new[] { "WG Blog Category", "WG Blog", "WG Blog Comment" })
            await AddDtLink(n, DtId(n), blogGrup.Id);

        var urunGrup = await AddParent("Ürün Tabloları", "bx bx-folder", tumTablolar.Id);
        foreach (var n in new[]
        {
            "WG Product Category", "WG Product", "WG Product Comment",
            "WG Variant Type", "WG Variant Option", "WG Product Variant",
            "WG Price Tier", "WG Product Feature", "WG Product Service"
        })
            await AddDtLink(n, DtId(n), urunGrup.Id);

        var siparisGrup = await AddParent("Sipariş Tabloları", "bx bx-folder", tumTablolar.Id);
        foreach (var n in new[]
        {
            "WG Cart", "WG Coupon", "WG Favorites", "WG Address",
            "WG Order", "WG Order Item", "WG Invoice"
        })
            await AddDtLink(n, DtId(n), siparisGrup.Id);

        await AddDivider("Sayfalar");

        var sayfalar = await AddParent("Sayfalar", "bx bx-file");
        await AddLink("Hakkında", "/about", "bx bx-info-circle", sayfalar.Id);
        await AddLink("Galeri", "/gallery", "bx bx-image", sayfalar.Id);
        await AddLink("SSS", "/faqs", "bx bx-help-circle", sayfalar.Id);
        await AddLink("İletişim", "/contacts", "bx bx-envelope", sayfalar.Id);
        await AddLink("Ekip", "/team", "bx bx-group", sayfalar.Id);
        await AddLink("Dökümanlar", "/documents", "bx bx-file-blank", sayfalar.Id);
        await AddLink("Workgrid", "/workgrid", "bx bx-cube", sayfalar.Id);

        await AddDivider("Yönetim", isAdmin: true);

        var yonetim = await AddParent("Yönetim", "bx bx-cog", isAdmin: true);
        await AddLink("Kullanıcılar", "/users", "bx bx-user", yonetim.Id, isAdmin: true);
        await AddLink("Roller", "/roles", "bx bx-shield", yonetim.Id, isAdmin: true);
        await AddLink("Ayarlar", "/settings", "bx bx-slider", yonetim.Id, isAdmin: true);
    }

    private async Task AddCategoryMenu(
        string categoryTableName, string basePath, string? icon, long parentMenuId,
        Func<string, long?> dtId)
    {
        var tableId = dtId(categoryTableName);
        if (tableId == null) return;

        var nameCol = await _ctx.TableColumns
            .FirstOrDefaultAsync(c => c.TableId == tableId && c.Name == "name" && c.DeletedAt == null);
        if (nameCol == null) return;

        var rowIds = await _ctx.TableRows
            .Where(r => r.TableId == tableId && r.DeletedAt == null)
            .Select(r => r.Id)
            .ToListAsync();

        var names = new List<string>();
        if (rowIds.Count > 0)
        {
            var cells = await _ctx.TableCells
                .Where(c => rowIds.Contains(c.RowId) && c.ColumnId == nameCol.Id && c.DeletedAt == null)
                .Select(c => c.Value)
                .ToListAsync();

            names = cells
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .Distinct()
                .ToList()!;
        }

        var katParent = await AddParent("Kategoriler", icon, parentMenuId);
        foreach (var name in names)
        {
            var url = $"{basePath}?category={Uri.EscapeDataString(name!)}";
            await AddLink(name!, url, "bx bx-tag", katParent.Id);
        }
    }

    private Task<MenuItem> AddDivider(string label, bool isAdmin = false) =>
        Save(MenuItem.Create(
            label: label, order: _order++, link: null, icon: null,
            visible: true, isHeader: true, parentId: null,
            locked: false, isAdmin: isAdmin, badgeName: null, badgeColor: null));

    private Task<MenuItem> AddParent(string label, string? icon, long? parentId = null, bool isAdmin = false) =>
        Save(MenuItem.Create(
            label: label, order: _order++, link: null, icon: icon,
            visible: true, isHeader: false, parentId: parentId,
            locked: false, isAdmin: isAdmin, badgeName: null, badgeColor: null));

    private Task<MenuItem> AddLink(
        string label, string link, string? icon, long? parentId,
        string? badgeName = null, string? badgeColor = null, bool isAdmin = false) =>
        Save(MenuItem.Create(
            label: label, order: _order++, link: link, icon: icon,
            visible: true, isHeader: false, parentId: parentId,
            locked: false, isAdmin: isAdmin, badgeName: badgeName, badgeColor: badgeColor));

    private async Task AddDtLink(string label, long? dtId, long parentId)
    {
        if (dtId == null) return;
        await AddLink(label, "/datatable/" + dtId, "bx bx-table", parentId);
    }

    private async Task<MenuItem> Save(MenuItem item)
    {
        await _ctx.MenuItems.AddAsync(item);
        await _ctx.SaveChangesAsync();
        return item;
    }
}