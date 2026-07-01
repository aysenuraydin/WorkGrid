import { CalendarCategory } from "./CalendarEvent";
export const getTableRoute = (name: string, id: number | string): string => {
    switch (name) {
        case COMMENT_BLOG_TABLE:
            return `/comment-panel-blog/${id}`;
        case COMMENT_ECOMMERCE_TABLE:
            return `/comment-panel-product/${id}`;
        case COUPON_TABLE:
            return `/coupons`;
        case CART_TABLE || FAVORITE_TABLE:
            return ``;
        default:
            return `/datatable/${id}`; 
    }
};
export const canCreateTable = (name: string): boolean => {
    if (!isLockControl(name)) return true;
    const editable = [
        BLOG_TABLE,
        CATEGORY_BLOG_TABLE,
        
        ECOMMERCE_TABLE,
        CATEGORY_ECOMMERCE_TABLE,
        
        VARIANT_TYPE_TABLE,
        VARIANT_OPTION_TABLE,
        PRODUCT_VARIANT_TABLE, 
        PRICE_TIER_TABLE,
        
        COUPON_TABLE,
        
        PRODUCT_FEATURE_TABLE,
        PRODUCT_SERVICE_TABLE,
        ORDER_TABLE,
        ORDER_ITEM_TABLE,
    ];
    return editable.includes(name);
};
export const canEditTable = (name: string): boolean => {
    if (!isLockControl(name)) return true;
    const editable = [
        BLOG_TABLE,
        CATEGORY_BLOG_TABLE,
        ECOMMERCE_TABLE,
        CATEGORY_ECOMMERCE_TABLE,
        VARIANT_TYPE_TABLE,
        VARIANT_OPTION_TABLE,
        PRODUCT_VARIANT_TABLE,
        PRICE_TIER_TABLE,
        COUPON_TABLE,
        PRODUCT_FEATURE_TABLE,
        PRODUCT_SERVICE_TABLE,
        ORDER_TABLE, 
        ORDER_ITEM_TABLE,
        INVOICE_TABLE,
    ];
    return editable.includes(name);
};
export const canDeleteTable = (name: string): boolean => {
    if (!isLockControl(name)) return true;
    const deletable = [
        BLOG_TABLE,
        CATEGORY_BLOG_TABLE,
        COMMENT_BLOG_TABLE,
        ECOMMERCE_TABLE,
        CATEGORY_ECOMMERCE_TABLE,
        COMMENT_ECOMMERCE_TABLE,
        PRODUCT_FEATURE_TABLE,
        PRODUCT_SERVICE_TABLE,
        COUPON_TABLE,
    ];
    return deletable.includes(name);
};

export const isLockControl = (name: string): boolean => {
    const lockedTables = [
        BLOG_TABLE,
        CATEGORY_BLOG_TABLE,
        COMMENT_BLOG_TABLE,
        
        ECOMMERCE_TABLE,
        CATEGORY_ECOMMERCE_TABLE,
        COMMENT_ECOMMERCE_TABLE,
        
        VARIANT_TYPE_TABLE,
        VARIANT_OPTION_TABLE,
        PRODUCT_VARIANT_TABLE,
        PRICE_TIER_TABLE,
        
        COUPON_TABLE,
        CART_TABLE,
        
        PRODUCT_FEATURE_TABLE,
        PRODUCT_SERVICE_TABLE,
        FAVORITE_TABLE,
        ORDER_TABLE,
        ORDER_ITEM_TABLE,
        ADDRESS_TABLE,
        INVOICE_TABLE
    ]; 
    return lockedTables.includes(name);
    };

export const isBlogControl = (name: string): boolean => {
    const lockedTables = [ 
        BLOG_TABLE,
        CATEGORY_BLOG_TABLE,
        COMMENT_BLOG_TABLE
    ];

    return lockedTables.includes(name);
    };

export const isProductControl = (name: string): boolean => {
    const lockedTables = [
        ECOMMERCE_TABLE,
        CATEGORY_ECOMMERCE_TABLE,
        COMMENT_ECOMMERCE_TABLE,
        VARIANT_TYPE_TABLE,
        VARIANT_OPTION_TABLE,
        PRODUCT_VARIANT_TABLE,
        PRICE_TIER_TABLE,
        COUPON_TABLE,
        CART_TABLE,
        PRODUCT_FEATURE_TABLE,
        PRODUCT_SERVICE_TABLE,
        FAVORITE_TABLE,
        ORDER_TABLE,
        ORDER_ITEM_TABLE,
        ADDRESS_TABLE,
        INVOICE_TABLE
    ];

    return lockedTables.includes(name);
};


// ── Blog ──
export const BLOG_TABLE = "WG Blog";
export const CATEGORY_BLOG_TABLE = "WG Blog Category";
export const COMMENT_BLOG_TABLE = "WG Blog Comment";


// ── E-commerce: katalog ──
export const ECOMMERCE_TABLE = "WG Product";
export const CATEGORY_ECOMMERCE_TABLE = "WG Product Category";
export const COMMENT_ECOMMERCE_TABLE = "WG Product Comment";

// ── E-commerce: varyant ──
export const VARIANT_TYPE_TABLE = "WG Variant Type";
export const VARIANT_OPTION_TABLE = "WG Variant Option";
export const PRODUCT_VARIANT_TABLE = "WG Product Variant";
export const PRICE_TIER_TABLE = "WG Price Tier";

// ── E-commerce: işlem ──
export const COUPON_TABLE = "WG Coupon";
export const CART_TABLE = "WG Cart";
export const PRODUCT_FEATURE_TABLE = "WG Product Feature";
export const PRODUCT_SERVICE_TABLE = "WG Product Service";
export const FAVORITE_TABLE = "WG Favorites";
export const ORDER_TABLE = "WG Order";
export const ORDER_ITEM_TABLE = "WG Order Item";
export const ADDRESS_TABLE = "WG Address";
export const INVOICE_TABLE = "WG Invoice";


const TABLE_LABELS: Record<string, string> = {
  // ── Blog ──
  [BLOG_TABLE]: "Blog",
  [CATEGORY_BLOG_TABLE]: "Blog Kategorisi",
  [COMMENT_BLOG_TABLE]: "Blog Yorumu",
 
  // ── E-ticaret: katalog ──
  [ECOMMERCE_TABLE]: "Ürün",
  [CATEGORY_ECOMMERCE_TABLE]: "Ürün Kategorisi",
  [COMMENT_ECOMMERCE_TABLE]: "Ürün Yorumu",
 
  // ── E-ticaret: varyant ──
  [VARIANT_TYPE_TABLE]: "Varyant Tipi",
  [VARIANT_OPTION_TABLE]: "Varyant Seçeneği",
  [PRODUCT_VARIANT_TABLE]: "Ürün Varyantı",
  [PRICE_TIER_TABLE]: "Fiyat Kademesi",
 
  // ── E-ticaret: işlem ──
  [COUPON_TABLE]: "Kupon",
  [CART_TABLE]: "Sepet",
  [PRODUCT_FEATURE_TABLE]: "Ürün Özelliği",
  [PRODUCT_SERVICE_TABLE]: "Ürün Hizmeti",
  [FAVORITE_TABLE]: "Favoriler",
  [ORDER_TABLE]: "Sipariş",
  [ORDER_ITEM_TABLE]: "Sipariş Kalemi",
  [ADDRESS_TABLE]: "Adres",
  [INVOICE_TABLE]: "Fatura",
};

export const getTableLabel = (tableName?: string | null): string => {
  if (!tableName) return "";
  return TABLE_LABELS[tableName] ?? tableName;
};

export const CALENDAR_CATEGORIES: CalendarCategory[] = [
    {
        id: 1,
        title: "Planlama & Strateji",
        type: "success",
        className: "bg-success-subtle text-success fw-medium",
    },
    {
        id: 2,
        title: "Toplantı & Görüşme",
        type: "info",
        className: "bg-info-subtle text-info fw-medium",
    },
    {
        id: 3,
        title: "Raporlama & Analiz",
        type: "warning",
        className: "bg-warning-subtle text-warning fw-medium",
    },
    {
        id: 4,
        title: "Kritik Geliştirme / Bug Fix",
        type: "danger",
        className: "bg-danger-subtle text-danger fw-medium",
    },
    {
        id: 5,
        title: "Workgrid Genel Görevler",
        type: "primary",
        className: "bg-primary-subtle",
    },
    {
        id: 6,
        title: "Rutin İşler & Bakım",
        type: "secondary",
        className: "bg-secondary-subtle text-secondary fw-medium",
    },
    {
        id: 7,
        title: "Özel / Diğer Etkinlikler",
        type: "dark",
        className: "bg-dark-subtle text-dark fw-medium",
    },
];

export const EVENT_CLASS_OPTIONS = [
    { value: "", label: "Seçiniz..." },
    { value: "bg-success-subtle", label: "Planlama & Strateji" },
    { value: "bg-info-subtle", label: "Toplantı & Görüşme" },
    { value: "bg-warning-subtle", label: "Raporlama & Analiz" },
    { value: "bg-danger-subtle", label: "Kritik Geliştirme / Bug Fix" },
    { value: "bg-primary-subtle", label: "Workgrid Genel Görevler" },
    { value: "bg-secondary-subtle", label: "Rutin İşler & Bakım" },
    { value: "bg-dark-subtle", label: "Özel / Diğer Etkinlikler" },
];