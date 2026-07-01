using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;
using workgrid.Infrastructure.Persistence.Common;

namespace workgrid.Infrastructure.Persistence.Seeders;

public class TableColumnSeeder : ISeeder
{
    public record ColDef(
        InputTypeEnum Type,
        string Name,
        int TableOrder,
        bool IsVisible = true,
        bool IsFilter = false,
        string? Options = null
    );

    public static readonly Dictionary<string, ColDef[]> ColumnsByTable = new()
    {
        ["WG Blog Category"] = new[]
        {
            new ColDef(InputTypeEnum.Text, "name",  1),
            new ColDef(InputTypeEnum.Text, "color", 2),
        },
        ["WG Blog"] = new[]
        {
            new ColDef(InputTypeEnum.Image,      "image",       0),
            new ColDef(InputTypeEnum.Text,       "title",       1),
            new ColDef(InputTypeEnum.Textarea,   "description", 2),
            new ColDef(InputTypeEnum.Number,     "views",       3),
            new ColDef(InputTypeEnum.Text,       "tags",        6),
            new ColDef(InputTypeEnum.Text,       "priority",    7),
            new ColDef(InputTypeEnum.Text,       "status",      8),
            new ColDef(InputTypeEnum.HtmlEditor, "content",     9),
        },
        ["WG Blog Comment"] = new ColDef[] { },

        ["WG Product Category"] = new[]
        {
            new ColDef(InputTypeEnum.Text, "name",     0),
            new ColDef(InputTypeEnum.Text, "slug",     1),
            new ColDef(InputTypeEnum.Text, "icon",     2),
            new ColDef(InputTypeEnum.Text, "parentId", 3),
        },
        ["WG Product"] = new[]
        {
            new ColDef(InputTypeEnum.Text,          "name",             0),
            new ColDef(InputTypeEnum.Text,          "slug",             1),
            new ColDef(InputTypeEnum.HtmlEditor,    "description",      2),
            new ColDef(InputTypeEnum.Text,          "shortDescription", 3),
            new ColDef(InputTypeEnum.Image,         "mainImage",        4),
            new ColDef(InputTypeEnum.Text,          "gallery",          5),
            new ColDef(InputTypeEnum.Text,          "brand",            6),
            new ColDef(InputTypeEnum.Text,          "manufacturer",     7),
            new ColDef(InputTypeEnum.Text,          "tags",             8),
            new ColDef(InputTypeEnum.Number,        "totalOrders",      9),
            new ColDef(InputTypeEnum.Select,        "status",          10, true, false, "draft,*,published,*,scheduled"),
            new ColDef(InputTypeEnum.Select,        "visibility",      11, true, false, "public,*,hidden"),
            new ColDef(InputTypeEnum.DatetimeLocal, "publishedDate",   12),
            new ColDef(InputTypeEnum.Checkbox,      "hasVariants",     13),
            new ColDef(InputTypeEnum.Number,        "viewCount",       15),
        },
        ["WG Product Comment"] = new ColDef[] { },

        ["WG Variant Type"] = new[]
        {
            new ColDef(InputTypeEnum.Text,   "name",        1),
            new ColDef(InputTypeEnum.Select, "displayType", 2, true, false, "color-swatch,*,button,*,dropdown"),
            new ColDef(InputTypeEnum.Number, "order",       3),
        },
        ["WG Variant Option"] = new[]
        {
            new ColDef(InputTypeEnum.Text,   "value",    1),
            new ColDef(InputTypeEnum.Color,  "colorHex", 2),
            new ColDef(InputTypeEnum.Number, "order",    3),
        },
        ["WG Product Variant"] = new[]
        {
            new ColDef(InputTypeEnum.Text,     "combination",     0),
            new ColDef(InputTypeEnum.Text,     "sku",             1),
            new ColDef(InputTypeEnum.Number,   "price",           2),
            new ColDef(InputTypeEnum.Number,   "stock",           3),
            new ColDef(InputTypeEnum.Image,    "variantImage",    4),
            new ColDef(InputTypeEnum.Checkbox, "isActive",        5),
            new ColDef(InputTypeEnum.Number,   "discountPercent", 7),
        },
        ["WG Price Tier"] = new[]
        {
            new ColDef(InputTypeEnum.Number, "minQty", 1),
            new ColDef(InputTypeEnum.Number, "maxQty", 2),
            new ColDef(InputTypeEnum.Number, "price",  3),
        },

        ["WG Cart"] = new[]
        {
            new ColDef(InputTypeEnum.Number,        "quantity", 1),
            new ColDef(InputTypeEnum.DatetimeLocal, "addedAt",  2),
            new ColDef(InputTypeEnum.Text,          "userId",   5),
        },
        ["WG Coupon"] = new[]
        {
            new ColDef(InputTypeEnum.Text,          "code",          0),
            new ColDef(InputTypeEnum.Select,        "discountType",  1, true, false, "percent,*,fixed"),
            new ColDef(InputTypeEnum.Number,        "discountValue", 2),
            new ColDef(InputTypeEnum.Number,        "minAmount",     3),
            new ColDef(InputTypeEnum.DatetimeLocal, "expiresAt",     4),
            new ColDef(InputTypeEnum.Checkbox,      "isActive",      5),
        },
        ["WG Favorites"] = new[]
        {
            new ColDef(InputTypeEnum.Number,        "userId",  1),
            new ColDef(InputTypeEnum.DatetimeLocal, "addedAt", 2),
        },

        ["WG Product Feature"] = new[]
        {
            new ColDef(InputTypeEnum.Text, "value", 1),
            new ColDef(InputTypeEnum.Text, "icon",  2),
            new ColDef(InputTypeEnum.Text, "order", 3),
        },
        ["WG Product Service"] = new[]
        {
            new ColDef(InputTypeEnum.Text, "value", 1),
            new ColDef(InputTypeEnum.Text, "icon",  2),
            new ColDef(InputTypeEnum.Text, "order", 3),
        },

        ["WG Address"] = new[]
        {
            new ColDef(InputTypeEnum.Number, "userId",   1),
            new ColDef(InputTypeEnum.Text,   "label",    2),
            new ColDef(InputTypeEnum.Text,   "fullName", 3),
            new ColDef(InputTypeEnum.Text,   "phone",    4),
            new ColDef(InputTypeEnum.Text,   "address",  5),
            new ColDef(InputTypeEnum.Text,   "country",  6),
            new ColDef(InputTypeEnum.Text,   "state",    7),
            new ColDef(InputTypeEnum.Text,   "zipCode",  8),
        },
        ["WG Order"] = new[]
        {
            new ColDef(InputTypeEnum.Text,   "orderNo",         1),
            new ColDef(InputTypeEnum.Number, "userId",          3),
            new ColDef(InputTypeEnum.Text,   "items",           4),
            new ColDef(InputTypeEnum.Number, "subTotal",        5),
            new ColDef(InputTypeEnum.Number, "discount",        6),
            new ColDef(InputTypeEnum.Text,   "couponCode",      7),
            new ColDef(InputTypeEnum.Number, "shippingCharge",  8),
            new ColDef(InputTypeEnum.Number, "total",           9),
            new ColDef(InputTypeEnum.Select, "paymentMethod",  10, true, false, "card,*,paypal,*,cod"),
            new ColDef(InputTypeEnum.Select, "status",         11, true, false, "pending,*,inprogress,*,pickups,*,delivered,*,returns,*,cancelled"),
            new ColDef(InputTypeEnum.Text,   "shippingAddress",12),
            new ColDef(InputTypeEnum.Text,   "orderDate",      13),
        },
        ["WG Order Item"] = new[]
        {
            new ColDef(InputTypeEnum.Number, "userId",          0),
            new ColDef(InputTypeEnum.Text,   "combination",     1),
            new ColDef(InputTypeEnum.Number, "unitPrice",       2),
            new ColDef(InputTypeEnum.Number, "discountPercent", 3),
            new ColDef(InputTypeEnum.Number, "quantity",        4),
            new ColDef(InputTypeEnum.Number, "lineTotal",       5),
        },
        ["WG Invoice"] = new[]
        {
            new ColDef(InputTypeEnum.Text,          "firstName",      1),
            new ColDef(InputTypeEnum.Text,          "lastName",       2),
            new ColDef(InputTypeEnum.Email,         "email",          3),
            new ColDef(InputTypeEnum.Tel,           "phone",          4),
            new ColDef(InputTypeEnum.Text,          "address",        5),
            new ColDef(InputTypeEnum.Text,          "country",        6),
            new ColDef(InputTypeEnum.Text,          "state",          7),
            new ColDef(InputTypeEnum.Text,          "zipCode",        8),
            new ColDef(InputTypeEnum.Select,        "paymentMethod",  9, true, false, "card,*,paypal,*,cod"),
            new ColDef(InputTypeEnum.Select,        "shippingMethod",10, true, false, "FREE,*,EXPRESS"),
            new ColDef(InputTypeEnum.Number,        "shippingCharge",11),
            new ColDef(InputTypeEnum.Number,        "subTotal",      12),
            new ColDef(InputTypeEnum.Number,        "discount",      13),
            new ColDef(InputTypeEnum.Text,          "couponCode",    14),
            new ColDef(InputTypeEnum.Number,        "total",         15),
            new ColDef(InputTypeEnum.DatetimeLocal, "createdAt",     16),
        },
    };

    public async Task Seed(IWorkGridDbContext context)
    {
        if (context.TableColumns.Any()) return;

        var tables = await context.Datatables.ToListAsync();
        if (!tables.Any()) return;

        var tableByName = tables.ToDictionary(t => t.Name, t => t.Id);

        var columns = new List<TableColumn>();

        foreach (var (tableName, cols) in ColumnsByTable)
        {
            if (!tableByName.TryGetValue(tableName, out var tableId)) continue;

            foreach (var c in cols)
            {
                var column = TableColumn.Create(
                    tableId, c.Type, c.Name, c.TableOrder, c.IsVisible, c.IsFilter
                );

                columns.Add(column);
            }
        }

        foreach (var item in columns)
        {
            await context.TableColumns.AddAsync(item);
        }
        await context.SaveChangesAsync();
    }
}