namespace workgrid.Application.Common;

public static class LockedTables
{
    public static readonly IReadOnlySet<string> Names =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            // Blog
            "WG Blog",
            "WG Blog Category",
            "WG Blog Comment",

            // E-commerce: katalog
            "WG Product",
            "WG Product Category",
            "WG Product Comment",

            // E-commerce: varyant
            "WG Variant Type",
            "WG Variant Option",
            "WG Product Variant",
            "WG Price Tier",

            // E-commerce: islem
            "WG Coupon",
            "WG Cart",
            "WG Product Feature",
            "WG Product Service",
            "WG Favorites",
            "WG Order",
            "WG Order Item",
            "WG Address",
            "WG Invoice",
        };

    public static bool IsLocked(string? tableName) =>
        !string.IsNullOrWhiteSpace(tableName) && Names.Contains(tableName.Trim());
}