export const API = "/api";

// --- GRIDBASE ---
export const GRIDBASE = (tableName: string) => `/gridbase/${tableName}`;
export const GRIDBASE_ONE = (tableName: string) => `/gridbase/${tableName}/one`;
export const GRIDBASE_PAGED = (tableName: string) => `/gridbase/${tableName}/paged`;
export const GRIDBASE_BY_ID = (tableName: string, id: number) => `/gridbase/${tableName}/${id}`;

export const GRIDBASE_TABLES = `/gridbase/tables`;
export const GRIDBASE_TABLES_ONE = `/gridbase/tables/one`;
export const GRIDBASE_TABLE_BY_ID = (id: number) => `/gridbase/tables/${id}`;
export const GRIDBASE_EMPTY_COLUMNS = (tableId: number) => `/gridbase/tables/${tableId}/empty-columns`;
export const GRIDBASE_COLUMN_BY_NAME = (tableName: string, columnName: string) =>
    `/gridbase/${tableName}/columns/${columnName}`;
export const GRIDBASE_ACCESS = (tableName: string) => `/gridbase/${tableName}/access`;
    

// --- COMMENTS ---
export const COMMENTS = "/comment";
export const COMMENTS_BY_ITEM = (itemType: string, itemId: string) => `/comment/${itemType}/${itemId}`;
export const COMMENTS_BY_ITEM_TYPE = (itemType: string) => `/comment/admin/${itemType}`;
export const COMMENT_BY_ID = (commentId: number | string) => `/comment/${commentId}`;

export const COMMENTS_RAITING_BY_ITEM = (itemType: string, itemId: string) =>
    `/comment/rating-summary/${itemType}/${itemId}`;

export const COMMENTS_RAITING_AVERAGES = (itemType: string) =>
    `/comment/rating-averages/${itemType}`;





// --- PROJECTS  ---
export const PROJECTS = "/projects";
export const PROJECTS_USER = "/projects/user";
export const PROJECT_BY_ID = (id: string) => `/projects/${id}`;

// --- KANBAN  ---
export const KANBAN_BOARD_BASE = "/kanban/board";
export const KANBAN_CARD_BASE = "/kanban/card";
export const KANBAN_CARDS = "/kanban/cards";
export const KANBAN_CARD_MOVE_BASE = "/kanban/cards"; // `/move` eklemesini fonksiyon içinde yaparız
export const KANBAN_COLUMNS = "/kanban/columns";

export const CLIENT = "/clientItems";
export const CALENDAR = "/calendar";
export const LANDING_HERO_CONFIG = "/LandingHero";

export const TENANT_DOCUMENT   = "/document";  

export const TENANT_ABOUT   = "/about";    // GET / PUT
export const TENANT_GALLERY = "/galleryItems";  // GET / POST / PUT / DELETE

// --- TENANT & BRAND CONFIG (ConfigController & Branding) ---
export const TENANT_CONFIG = "/tenant/config";
export const TENANT_RESET = "/tenant/reset";
export const TENANT_CACHE = "/tenant/cache";

export const TENANT_BRAND = "/brand";
export const TENANT_CONTACT = "/contact";
export const TENANT_COMMERCE = "/commerce";

export const MENU_SNAPSHOT = "/menu-snapshot";

// Landing
export const LANDING_FEATURES = "/LandingFeatures";
export const LANDING_CTA = "/LandingFeatures/cta";

// --- SOCIAL & SERVICES ---
export const TENANT_SOCIAL_LINKS = "/sociallinks"; // GET/POST (Liste/Create)
export const TENANT_SOCIAL_LINK_UPDATE = (id: string | number) => `/sociallinks/${id}`; // PUT/DELETE

export const TENANT_SERVICES = "/services"; // GET/PUT

// --- PLANS & FAQ ---
export const TENANT_PLANS = "/plans"; // GET/PUT
export const TENANT_FAQ = "/faq"; // GET/PUT

// --- STATS, TESTIMONIALS & WORKS (Projects) ---
export const TENANT_STATS = "/stats"; // GET/PUT

export const TENANT_TESTIMONIALS = "/testimonials"; // GET/POST
export const TENANT_TESTIMONIAL_UPDATE = (id: string) => `/testimonials/${id}`; // PUT/DELETE

export const TENANT_WORKS = "/companyProjects"; // GET/POST
export const TENANT_WORK_UPDATE = (id: string) => `/companyProjects/${id}`;

// Authenticate
export const AUTH_BASE = "/auth";
export const AUTH_REGISTER = AUTH_BASE + "/register";
export const AUTH_FORGOT_PASSWORD = AUTH_BASE + "/forgot-password";
export const AUTHENTICATE = AUTH_BASE + "/authenticate";
export const AUTH_LOGOUT = AUTH_BASE + "/logout";

export const USER_BLOCK = (id: string) => `/auth/${id}/block`;
export const USER_UNBLOCK = (id: string) => `/auth/${id}/unblock`;

// --- USER CONTROLLER URLS ---
export const USER_DETAIL = "/user/detail";
export const USER_ALL = "/user/all";
export const USER_BY_ROLE = "/user/by-role";
export const UPDATE_PROFILE = "/user/update-profile";
export const UPDATE_PROFILE_EXPERIENCE = "/user/update-profile-experience";
export const UPDATE_PASSWORD = "/user/update-password";
export const UPDATE_AVATAR = "/user/update-avatar-url";
export const DELETE_USER = "/user";

// --- ROLE CONTROLLER URLS ---
export const ROLE_ALL = "/role/all";
export const ROLE_CREATE = "/role/create";
export const ROLE_UPDATE = "/role/update";
export const ROLE_DELETE = "/role/delete";
export const UPDATE_USER_ROLE = "/role/update-user-role";
export const ROLE_USERS_ALL = "/role/users-all";
export const ROLE_USERS_BY_ROLE = "/role/users-by-role";

// Tables
export const TABLE_BASE = "/datatable";
export const GET_DATATABLES = TABLE_BASE;
export const GET_DATATABLE = TABLE_BASE+"/table";
export const GET_DELETED_DATATABLES = TABLE_BASE+"/deleted";
export const GET_DATATABLE_RELATIONSHIPS =TABLE_BASE+ "/relationships";
export const CREATE_DATATABLE = TABLE_BASE;
export const UPDATE_DATATABLE = TABLE_BASE;
export const UPDATE_FOREIGN_TABLE =TABLE_BASE+ "/updateForeignTable";
export const CHANGE_DATATABLE_HEIGHT = TABLE_BASE+"/changeTableHeight";
export const RESTORE_DATATABLE =TABLE_BASE+ "/restore";
export const DELETE_DATATABLE = TABLE_BASE;
export const HARD_DELETED_DATATABLE = TABLE_BASE+"/hardDelete"; 
export const DELETE_BULK_DATATABLE = TABLE_BASE+"/bulk";
export const HARD_DELETED_BULK_DATATABLE = TABLE_BASE+"/bulkHardDelete";
export const GET_TABLE_ACCESS = `${TABLE_BASE}/getAccess`;
export const SET_TABLE_ACCESS = `${TABLE_BASE}/setAccess`;

// Rows
export const ROWS_BASE = "/tableRow";
export const GET_DATATABLE_ROWS = ROWS_BASE+"/table";
export const GET_TABLE_ROWS = ROWS_BASE+"/datatable";
export const GET_TABLE_ROW = ROWS_BASE;
export const GET_TABLEROWS = ROWS_BASE+"/column";
export const GET_FOREIGN_TABLE_ROW = ROWS_BASE+"/foreigns";
export const GET_DELETED_TABLE_ROWS = ROWS_BASE+"/deleted";
export const CREATE_TABLE_ROWS = ROWS_BASE;
export const RESTORE_DELETED_TABLE_ROW = ROWS_BASE+"/restore";
export const DELETE_TABLE_ROWS = ROWS_BASE;
export const HARD_DELETED_TABLE_ROW = ROWS_BASE+"/hardDelete";

export const UPDATE_BULK_TABLE_ROWS = ROWS_BASE+"/bulk";
export const DELETE_BULK_TABLE_ROWS = ROWS_BASE+"/bulk"
export const HARD_DELETED_BULK_TABLE_ROW = ROWS_BASE+"/bulkHardDelete";
export const RESTORE_DELETED_BULK_TABLE_ROW = ROWS_BASE+"/bulkRestore";


// Columns
export const COLUMN_BASE = "/tableColumn";
export const GET_TABLE_COLUMNS = COLUMN_BASE+"/table";
export const GET_TABLECOLUMNS = COLUMN_BASE+"/datatable";
export const GET_DELETED_TABLE_COLUMNS = COLUMN_BASE+"/deleted";
export const CREATE_TABLE_COLUMNS = COLUMN_BASE;
export const UPDATE_TABLE_COLUMNS = COLUMN_BASE;
export const UPDATE_TABLE_COLUMNS_WITH_DESIGN = COLUMN_BASE+"/design";
export const UPDATE_TABLE_COLUMNS_WITH_OPTION = COLUMN_BASE+"/option";
export const UPDATE_TABLE_COLUMNS_WITH_VALIDATION = COLUMN_BASE+"/validation";
export const UPDATE_TABLE_COLUMNS_WITH_MODAL = COLUMN_BASE+"/modal";
export const UPDATE_TABLE_COLUMNS_WITH_FUNCTION = COLUMN_BASE+"/function";

export const DELETE_TABLE_COLUMNS = COLUMN_BASE;
export const HARD_DELETED_TABLE_COLUMN = COLUMN_BASE+"/hardDelete";
export const RESTORE_DELETED_TABLE_COLUMN = COLUMN_BASE+"/restore";

export const CREATE_BULK_TABLE_COLUMNS = COLUMN_BASE+"/bulk";
export const UPDATE_BULK_TABLE_COLUMNS = COLUMN_BASE+"/bulk";
export const UPDATE_BULK_TABLE_COLUMNS_WITH_DESIGN = COLUMN_BASE+"/bulkDesign";
export const UPDATE_BULK_TABLE_COLUMNS_WITH_OPTION = COLUMN_BASE+"/bulkOption";
export const UPDATE_BULK_TABLE_COLUMNS_WITH_VALIDATION = COLUMN_BASE+"/bulkValidation";
export const UPDATE_BULK_TABLE_COLUMNS_WITH_MODAL = COLUMN_BASE+"/bulkModal";
export const UPDATE_BULK_TABLE_COLUMNS_WITH_FUNCTION = COLUMN_BASE+"/bulkFunction";
export const DELETE_BULK_TABLE_COLUMNS = COLUMN_BASE+"/bulk"
export const HARD_DELETED_BULK_TABLE_COLUMN = COLUMN_BASE+"/bulkHardDelete";
export const RESTORE_DELETED_BULK_TABLE_COLUMN = COLUMN_BASE+"/bulkRestore";

// Cells
export const CELLS_BASE = "/tableCell";
export const GET_TABLE_CELLS_BY_TABLE_ID = CELLS_BASE+"/table";
export const GET_TABLE_FILTERED_CELLS_BY_TABLE_ID = CELLS_BASE+"/filteredCells";
export const GET_TABLE_CELLS_BY_COLUMN_ID = CELLS_BASE+"/column";
export const UPDATE_TABLE_CELL = CELLS_BASE;
export const UPDATE_BULK_TABLE_CELL = CELLS_BASE;

// Menu Items
export const MENU_ITEM_BASE = "/menuItem";
export const GET_MENU_ITEMS = MENU_ITEM_BASE;
export const GET_DELETED_MENU_ITEMS = MENU_ITEM_BASE+"/deleted";
export const GET_MENU_ITEM = MENU_ITEM_BASE;
export const CREATE_MENU_ITEM = MENU_ITEM_BASE+"/item";
export const UPDATE_MENU_ITEM = MENU_ITEM_BASE+"/item";
export const CREATE_DIVIDER = MENU_ITEM_BASE+"/divider";
export const UPDATE_DIVIDER = MENU_ITEM_BASE+"/divider";
export const SHOW_OR_HIDE_MENU_ITEM = MENU_ITEM_BASE+"/showOrHide";
export const CHANGE_PRIVACY_MENU_ITEM = MENU_ITEM_BASE+"/changePrivacy";
export const CHANGE_MENU_ITEM_ORDER = MENU_ITEM_BASE+"/changeOrder";
export const DELETE_MENU_ITEM = MENU_ITEM_BASE; 
export const HARD_DELETE_MENU_ITEM = MENU_ITEM_BASE+"/hardDelete"; 
export const RESTORE_DELETED_MENU_ITEM = MENU_ITEM_BASE+"/restore";

//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/signin";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";

// Api 
export const GET_API_KEY = "/api-key";


// Calendar
export const GET_EVENTS = "/events";
export const GET_CATEGORIES = "/categories";
export const GET_UPCOMMINGEVENT = "/upcommingevents"; 