import { APIClient } from "./api_helper";

import * as url from "./url_helper";
import { MenuItem } from "common/data/menuItem";
import { FileAPIClient } from "./fileApi_helper"; 
import { Datatable, SetTableAccessRequest } from "common/data/Datatable";
import { ForeignTable } from "common/data/ForeignTable";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { UpdateExperienceProfileRequest, UpdateProfileRequest } from "hooks/useUser";
import { IAboutConfig, ICtaConfig, IDocumentConfig, IFeatureItem, IGalleryItem } from "common/data/tenant";

export const api = new APIClient();
const fileApi = new FileAPIClient();


/* ================= FILE API ================= */

// upload file
export const uploadFile = (file: File) =>
    fileApi.upload(file);
// download / view file
export const viewFile = (fileName: string) =>
    fileApi.view(fileName);
// delete file
export const deleteFileByName = (fileName: string) =>
    fileApi.delete(fileName);

/* ================= API ================= */

//! GRIDBASE
export interface GridbaseQuery {
    filter?: string[];
    sort?: string;
    select?: string;
    search?: string;
    searchFields?: string;
}

// ── TABLO YÖNETİMİ ──

export const getAllTables = (params?: {
    filter?: string[];
    sort?: string;
    select?: string;
}) => api.get(url.GRIDBASE_TABLES, { params });

export const getOneTable = (params?: {
    filter?: string[];
    sort?: string;
    select?: string;
}) => api.get(url.GRIDBASE_TABLES_ONE, { params });

export const getGTableById = (id: number) =>
    api.get(url.GRIDBASE_TABLE_BY_ID(id));

export const createTable = (payload: {
    name: string;
    modalSize?: string;
    viewType?: string;
    pageSize?: number;
    modalHeight?: number;
}) => api.create(url.GRIDBASE_TABLES, payload);

export const updateTable = (id: number, payload: {
    name?: string;
    modalSize?: string;
    viewType?: string;
    pageSize?: number;
    modalHeight?: number;
}) => api.put(url.GRIDBASE_TABLE_BY_ID(id), payload);

export const deleteTable = (id: number, hard: boolean = false) =>
    api.delete(`${url.GRIDBASE_TABLE_BY_ID(id)}?hard=${hard}`);


export const getEmptyColumns = (tableId: number) =>
    api.get(url.GRIDBASE_EMPTY_COLUMNS(tableId));

export const pruneEmptyColumns = (tableId: number, columnIds?: number[]) =>
    api.delete(url.GRIDBASE_EMPTY_COLUMNS(tableId), { data: { columnIds } });

export const deleteColumn = (tableName: string, columnName: string, hard: boolean = false) =>
    api.delete(`${url.GRIDBASE_COLUMN_BY_NAME(tableName, columnName)}?hard=${hard}`);

export const setTableAccess = (tableName: string, payload: {
    readAccess?: string;
    writeAccess?: string;
    readRequiredRole?: string;
    writeRequiredRole?: string;
    isOwnerScoped?: boolean;
    ownerColumn?: string;
}) => api.put(url.GRIDBASE_ACCESS(tableName), payload); 

export const getAllRows = (tableName: string, params?: GridbaseQuery) =>
    api.get(url.GRIDBASE(tableName), { params });

export const getOneRow = (tableName: string, params?: GridbaseQuery) =>
    api.get(url.GRIDBASE_ONE(tableName), { params });

export const getPagedRows = (tableName: string, params?: {
    page?: number;
    size?: number;
    filter?: string[];
    sort?: string;
    select?: string;
}) => api.get(url.GRIDBASE_PAGED(tableName), { params });

export const getRowById = (tableName: string, id: number, params?: { select?: string }) =>
    api.get(url.GRIDBASE_BY_ID(tableName, id), { params });

export const createRow = (tableName: string, payload: any) =>
    api.create(url.GRIDBASE(tableName), payload);

export const updateRow = (tableName: string, id: number, payload: any) =>
    api.put(url.GRIDBASE_BY_ID(tableName, id), payload);

export const patchRow = (tableName: string, id: number, payload: any) =>
    api.patch(url.GRIDBASE_BY_ID(tableName, id), payload);

export const deleteRow = (tableName: string, id: number) =>
    api.delete(url.GRIDBASE_BY_ID(tableName, id));

//! COMMENTS
// Yorumları listeleyen GET isteği
export const getCommentsByItem = (itemType: string, itemId: string) => 
    api.get(url.COMMENTS_BY_ITEM(itemType, itemId));

export const getCommentsRaitingByItems = (itemType: string, itemIds: string[]) =>
    api.create(url.COMMENTS_RAITING_AVERAGES(itemType), itemIds);

export const getCommentsRaitingByItem = (itemType: string, itemId: string) =>
    api.get(url.COMMENTS_RAITING_BY_ITEM(itemType, itemId));

export const getCommentsForAdmin = (itemType: string) => 
    api.get(url.COMMENTS_BY_ITEM_TYPE(itemType));

// Yeni yorum ekleyen POST isteği
export const createComment = (payload: any) => 
    api.create(url.COMMENTS, payload);

// Mevcut yorumu güncelleyen PUT isteği
export const updateComment = (commentId: number | string, payload: any) => 
    api.put(url.COMMENT_BY_ID(commentId), payload);

// Yorumu silen DELETE isteği
export const deleteComment = (commentId: number | string) => 
    api.delete(url.COMMENT_BY_ID(commentId));

//! PROJECTS
export const getProjects = () => api.get(url.PROJECTS);
export const getUserProjects = () => api.get(url.PROJECTS_USER);
export const getProjectById = (id: string) => api.get(url.PROJECT_BY_ID(id));
export const createProject = (payload: any) => api.create(url.PROJECTS, payload);
export const updateProject = (id: string, payload: any) => api.put(url.PROJECT_BY_ID(id), payload);
export const deleteProject = (id: string) => api.delete(url.PROJECT_BY_ID(id));

//! KANBAN
export const getKanbanBoard = (projectId: string) => api.get(`${url.KANBAN_BOARD_BASE}/${projectId}`);
export const getKanbanCard = (cardId: string) => api.get(`${url.KANBAN_CARD_BASE}/${cardId}`);
export const createKanbanCard = (payload: any) => api.create(url.KANBAN_CARDS, payload);
export const updateKanbanCard = (id: string, payload: any) => api.put(`${url.KANBAN_CARDS}/${id}`, payload);
export const deleteKanbanCard = (id: string) => api.delete(`${url.KANBAN_CARDS}/${id}`);
export const moveKanbanCard = (id: string, payload: any) => api.create(`${url.KANBAN_CARD_MOVE_BASE}/${id}/move`, payload);
export const createKanbanColumn = (payload: any) => api.create(url.KANBAN_COLUMNS, payload);

//! CALENDAR
export const getCalendarEvents = (projectId?: string) => 
    api.get(url.CALENDAR, { params: projectId ? { projectId } : undefined });

export const getCalendarEventById = (id: string) => api.get(`${url.CALENDAR}/${id}`);
export const createCalendarEvent = (dto: any) => api.create(url.CALENDAR, dto);
export const updateCalendarEvent = (id: string, dto: any) => api.put(`${url.CALENDAR}/${id}`, dto);
export const moveCalendarEvent = (id: string, start: Date, end: Date) => api.patch(`${url.CALENDAR}/${id}/move`, { start, end });
export const deleteCalendarEvent = (id: string) => api.delete(`${url.CALENDAR}/${id}`);

//! TENANT & BRAND SERVICES 
export const getConfig = () => api.get(url.TENANT_CONFIG);
export const updateConfig = (data: any) => api.put(url.TENANT_CONFIG, data);
export const resetConfig = () => api.put(url.TENANT_RESET, {});
export const clearCache = () => api.delete(url.TENANT_CACHE);


//! LANDING
export const getLandingFeatures = () =>  api.get(url.LANDING_FEATURES);
export const createLandingFeature = (data: IFeatureItem) =>  api.create(url.LANDING_FEATURES, data);
export const updateLandingFeature = (id: number | string, data: IFeatureItem) => api.put(`${url.LANDING_FEATURES}/${id}`, data);
export const deleteLandingFeature = (id: number | string) =>  api.delete(`${url.LANDING_FEATURES}/${id}`);

//! HERO
export const getLandingHero = () => api.get(url.LANDING_HERO_CONFIG);
export const updateLandingHero = (data: any) => api.put(url.LANDING_HERO_CONFIG, data);
export const deleteLandingHero = () => api.delete(url.LANDING_HERO_CONFIG);

//! CLIENT
export const getClientItems = () => api.get(url.CLIENT);
export const createClientItem = (clientData: { name: string; logoUrl: string }) => 
    api.create(url.CLIENT, clientData);
export const updateClientItem = (id: number | string, clientData: { name: string; logoUrl: string }) => 
    api.put(`${url.CLIENT}/${id}`, clientData);
export const deleteClientItem = (id: number | string) =>  api.delete(`${url.CLIENT}/${id}`);
export const getLandingCta = () => api.get(url.LANDING_CTA);
export const updateLandingCta = (data: ICtaConfig) => api.put(url.LANDING_CTA, data);

//! BRAND
export const getBrand = () => api.get(url.TENANT_BRAND);
export const updateBrand = (data: any) => api.put(url.TENANT_BRAND, data);

//! MENU SNAPSHOT
export const saveMenuSnapshot    = () => api.create(url.MENU_SNAPSHOT + "/save", {});
export const getMenuSnapshot     = () => api.get(url.MENU_SNAPSHOT);
export const restoreMenuSnapshot = () => api.create(url.MENU_SNAPSHOT + "/restore", {});

//! COMMERCE
export const getCommerce = () => api.get(url.TENANT_COMMERCE);
export const updateCommerce = (data: any) => api.put(url.TENANT_COMMERCE, data);

//! CONTACT
export const getContact = () => api.get(url.TENANT_CONTACT);
export const updateContact = (data: any) => api.put(url.TENANT_CONTACT, data);

//! SOCIAL & SERVICES 
export const getSocialLinks = () => api.get(url.TENANT_SOCIAL_LINKS);
export const createSocialLink = (data: any) => api.create(url.TENANT_SOCIAL_LINKS, data);
export const updateSocialLink = (id: string | number, data: any) => api.put(url.TENANT_SOCIAL_LINK_UPDATE(id), data);
export const deleteSocialLink = (id: string | number) => api.delete(url.TENANT_SOCIAL_LINK_UPDATE(id));

export const getServices = () => api.get(url.TENANT_SERVICES);
export const updateServices = (data: any) => api.put(url.TENANT_SERVICES, data);


//! About 
export const getAbout  = (): Promise<IAboutConfig>  => api.get(url.TENANT_ABOUT);
export const updateAbout = (data: IAboutConfig): Promise<IAboutConfig> => api.put(url.TENANT_ABOUT, data);

//! Document 
export const getDocument  = (): Promise<IDocumentConfig>  => api.get(url.TENANT_DOCUMENT);
export const updateDocument = (data: IDocumentConfig): Promise<IDocumentConfig> => api.put(url.TENANT_DOCUMENT, data);

//!Gallery 
export const getGallery    = (): Promise<IGalleryItem[]> => api.get(url.TENANT_GALLERY);
export const createGallery = (data: Omit<IGalleryItem, "id">): Promise<IGalleryItem> => api.create(url.TENANT_GALLERY, data);
export const updateGallery = ({ id, ...data }: IGalleryItem): Promise<IGalleryItem>  => api.put(`${url.TENANT_GALLERY}/${id}`, data);
export const deleteGallery = (id: number): Promise<void> => api.delete(`${url.TENANT_GALLERY}/${id}`);

//! PLANS & FAQ ---
export const getPlans = () => api.get(url.TENANT_PLANS);
export const updatePlans = (data: any) => api.put(url.TENANT_PLANS, data);

export const getFaq = () => api.get(url.TENANT_FAQ);
export const updateFaq = (data: any) => api.put(url.TENANT_FAQ, data);

//! STATS, TESTIMONIALS & PROJECTS 
export const getStats = () => api.get(url.TENANT_STATS);
export const updateStats = (data: any) => api.put(url.TENANT_STATS, data);

export const getTestimonials = () => api.get(url.TENANT_TESTIMONIALS);
export const createTestimonial = (data: any) => api.create(url.TENANT_TESTIMONIALS, data);
export const updateTestimonial = (id: string, data: any) => api.put(url.TENANT_TESTIMONIAL_UPDATE(id), data);
export const deleteTestimonial = (id: string) => api.delete(url.TENANT_TESTIMONIAL_UPDATE(id));

export const getWorks = () => api.get(url.TENANT_WORKS);
export const createWork = (data: any) => api.create(url.TENANT_WORKS, data);
export const updateWork = (id: string, data: any) => api.put(url.TENANT_WORK_UPDATE(id), data);
export const deleteWork = (id: string) => api.delete(url.TENANT_WORK_UPDATE(id));

//! tables
export const getTables = () => api.get(url.GET_DATATABLES); 
export const getTableById = (id:number) => api.get(`${url.GET_DATATABLE}/${id}`);
export const getDatatables = () => api.get(url.GET_DATATABLES); 
export const getDeletedDataTables = () => api.get(url.GET_DELETED_DATATABLES);
export const restoreDatatableById = (id:number) => api.delete(`${url.RESTORE_DATATABLE}/${id}`);

export const getDatatableById = (id:number) => api.get(`${url.GET_DATATABLES}/${id}`);
export const createDatatable = (value:Datatable) => api.create(url.CREATE_DATATABLE, value);
export const updateDatatable = (value:Datatable) => api.put(`${url.UPDATE_DATATABLE}/${value.id}`, value);
export const updateForeignTable = (item:{id:number, foreignTablesFk:ForeignTable[]}) => api.put(`${url.UPDATE_FOREIGN_TABLE}/${item.id}`, item);
export const deleteDatatableById = (id:number) => api.delete(`${url.DELETE_DATATABLE}/${id}`);
export const hardDeleteDatatableById = (id:number) => api.delete(`${url.HARD_DELETED_DATATABLE}/${id}`);
export const getDatatableRelationships = () => api.get(url.GET_DATATABLE_RELATIONSHIPS);
export const changeTableHeight = (value:any) => api.put(`${url.CHANGE_DATATABLE_HEIGHT}/${value?.id}`,value); 
export const getTableAccess = (id: number) =>
    api.get(`${url.GET_TABLE_ACCESS}/${id}`);
export const updateTableAccess = (value: SetTableAccessRequest) =>
    api.put(`${url.SET_TABLE_ACCESS}/${value.id}`, value);

export const deleteBulkDatatableByIds = (ids:number[]) => api.delete(`${url.DELETE_BULK_DATATABLE}`,{ data: {ids} });
export const hardDeleteBulkDatatableByIds = (ids:number[]) => api.delete(`${url.HARD_DELETED_BULK_DATATABLE}`,{ data: {ids} });

//! Cols
export const getTableColumnsByTableId = (valueId:number) => api.get(`${url.GET_TABLE_COLUMNS}/${valueId}`);
export const getDeletedTableColumnsByTableId = (valueId:number) => api.get(`${url.GET_DELETED_TABLE_COLUMNS}/${valueId}`);
export const getAllTableColumns = () => api.get(`${url.COLUMN_BASE}`);
export const getDatatableColumnsByTableId = (valueId:number) => api.get(`${url.GET_TABLECOLUMNS}/${valueId}`);
export const getDatatableRowsByColumnId = (id:number) => api.get(`${url.GET_TABLEROWS}/${id}`);
export const createTableColumn = (value:TableColumn) => api.create(url.CREATE_TABLE_COLUMNS, value);
export const updateTableColumn = (value:TableColumn) => api.put(`${url.UPDATE_TABLE_COLUMNS}/${value.id}`, value);
export const updateColumnWithDesign = (value:any) => api.put(`${url.UPDATE_TABLE_COLUMNS_WITH_DESIGN}/${value.id}`,value);
export const updateTableColumnWithOption = (value:any) => api.put(`${url.UPDATE_TABLE_COLUMNS_WITH_OPTION}/${value?.id}`,value);
export const updateTableColumnWithValidation = (value:any) => api.put(`${url.UPDATE_TABLE_COLUMNS_WITH_VALIDATION}/${value?.id}`,value);
export const updateTableColumnWithModal = (value:any) => api.put(`${url.UPDATE_TABLE_COLUMNS_WITH_MODAL}/${value?.tableId}`,value);
export const updateTableColumnWithFunction = (value:any) => api.put(`${url.UPDATE_TABLE_COLUMNS_WITH_FUNCTION}/${value?.id}`,value);
export const deleteTableColumnById = (id:number) => api.delete(`${url.DELETE_TABLE_COLUMNS}/${id}`);
export const updateBulkTableColumn = (value:any) => api.put(`${url.UPDATE_BULK_TABLE_COLUMNS}/${value.tableId}`, value);
export const restoreDeletedTableColumnById = (id:number) => api.delete(`${url.RESTORE_DELETED_TABLE_COLUMN}/${id}`);
export const hardDeleteColumnById = (id:number) => api.delete(`${url.HARD_DELETED_TABLE_COLUMN}/${id}`);
export const updateBulkColumnWithDesign = (value:any, tableId:number) => api.put(`${url.UPDATE_BULK_TABLE_COLUMNS_WITH_DESIGN}/${tableId}`,value);
export const updateBulkTableColumnWithOption = (value:any, tableId:number) => api.put(`${url.UPDATE_BULK_TABLE_COLUMNS_WITH_OPTION}/${tableId}`,value);
export const updateBulkTableColumnWithValidation = (value:any, tableId:number) => api.put(`${url.UPDATE_BULK_TABLE_COLUMNS_WITH_VALIDATION}/${tableId}`,value);
export const updateBulkTableColumnWithModal = (value:any, tableId:number) => api.put(`${url.UPDATE_BULK_TABLE_COLUMNS_WITH_MODAL}/${tableId}`,value);
export const updateBulkTableColumnWithFunction = (value:any, tableId:number) => api.put(`${url.UPDATE_BULK_TABLE_COLUMNS_WITH_FUNCTION}/${tableId}`,value);
export const createBulkTableColumn = (value:any) => api.create(`${url.UPDATE_BULK_TABLE_COLUMNS}/${value?.tableId}`,value);
export const restoreBulkDeletedTableColumnById = (ids:number[], tableId:number) => api.put(`${url.RESTORE_DELETED_BULK_TABLE_COLUMN}/${tableId}`, {ids, tableId} );
export const hardDeleteBulkTableColumnById = (ids:number[], tableId:number) => api.delete(`${url.HARD_DELETED_BULK_TABLE_COLUMN}/${tableId}`,{ data: {ids, tableId} });
export const deleteBulkTableColumnById = (ids:number[], tableId:number) => api.delete(`${url.DELETE_BULK_TABLE_COLUMNS}/${tableId}`,{ data: {ids, tableId} });
//todo 'data' anahtarı Axios'a "bunu body'ye koy" der.


//! Rows
export const getDeletedTableRowsByTableId = (valueId:number) => api.get(`${url.GET_DELETED_TABLE_ROWS}/${valueId}`);
export const getTableRowsById = (id:number) => api.get(`${url.GET_TABLE_ROW}/${id}`)
export const getDatatableRowsByTableId = (valueId:number) => api.get(`${url.GET_DATATABLE_ROWS}/${valueId}`);
export const getForeignTableRowByCellId = (cellId:number,realRowId:number) => api.get(`${url.GET_FOREIGN_TABLE_ROW}/${cellId}/${realRowId}`);
export const getForeignTableRowByTableId = (tableId:number) => api.get(`${url.GET_FOREIGN_TABLE_ROW}/${tableId}`);
export const createBulkTableRow = (value:any[], tableId:number) => api.create(`${url.UPDATE_BULK_TABLE_ROWS}/${tableId}`, {tableId, rows:value});
export const restoreBulkDeletedTableRowById = (ids:number[], tableId:number) => api.put(`${url.RESTORE_DELETED_BULK_TABLE_ROW}/${tableId}`,{ data: {ids, tableId} });
export const hardDeleteBulkTableRowById = (ids:number[], tableId:number) => api.delete(`${url.HARD_DELETED_BULK_TABLE_ROW}/${tableId}`,{ data: {ids, tableId} });
export const deleteBulkTableRowById = (ids:number[], tableId:number) => api.delete(`${url.DELETE_BULK_TABLE_ROWS}/${tableId}`,{ data: {ids, tableId} });
//todo 'data' anahtarı Axios'a "bunu body'ye koy" der.
export const getTableRowsByTableId = (valueId:number) => api.get(`${url.GET_TABLE_ROWS}/${valueId}`);
export const createTableRow = (value:TableRow) => api.create(url.CREATE_TABLE_ROWS, value);
export const deleteTableRowsById = (id:number) => api.delete(`${url.DELETE_TABLE_ROWS}/${id}`);
export const restoreDeletedTableRowById = (id:number) => api.delete(`${url.RESTORE_DELETED_TABLE_ROW}/${id}`);
export const hardDeleteRowById = (id:number) => api.delete(`${url.HARD_DELETED_TABLE_ROW}/${id}`);


//! Cells
export const getDatatableCellsByTableId = (id:number) => api.get(`${url.GET_TABLE_CELLS_BY_TABLE_ID}/${id}`);
export const getDatatableFilteredCellsByTableId = (id:number) => api.get(`${url.GET_TABLE_FILTERED_CELLS_BY_TABLE_ID}/${id}`);
export const getDatatableCellsByColumnId = (id:number) => api.get(`${url.GET_TABLE_CELLS_BY_COLUMN_ID}/${id}`);
export const updateTableCell = (row:{cellId:number, value:string}) => api.put(`${url.UPDATE_TABLE_CELL}/${row.cellId}`, row); 
export const updateBulkTableCell = (cells: { cellId: number; value: string }[]) => 
    api.put(`${url.UPDATE_BULK_TABLE_CELL}`, { cells });


//! Menu Items
export const getMenuItems = () => api.get(url.GET_MENU_ITEMS);
export const getDeletedMenuItems = () => api.get(url.GET_DELETED_MENU_ITEMS);
export const getMenuItem = (id:number) => api.get(`${url.GET_MENU_ITEMS}/${id}`);
export const createMenuItem = (item:MenuItem) => api.create(url.CREATE_MENU_ITEM, item);
export const createDivider = (item:MenuItem) => api.create(url.CREATE_DIVIDER, item);
export const updateMenuItem = (item:MenuItem) => api.put(`${url.UPDATE_MENU_ITEM}/${item.id}`, item);
export const updateDivider = (item:MenuItem) => api.put(`${url.UPDATE_DIVIDER}/${item.id}`, item);
export const showOrHideMenuItem = (item:{id:number, visible:boolean}) => api.put(`${url.SHOW_OR_HIDE_MENU_ITEM}/${item.id}`, item);
export const changePrivacyMenuItem = (item:{id:number, isAdmin:boolean}) => api.put(`${url.CHANGE_PRIVACY_MENU_ITEM}/${item.id}`, item);
export const changeMenuItemOrder = (item:{id:number, order:number}) => api.put(`${url.CHANGE_MENU_ITEM_ORDER}/${item.id}`, item);
export const deleteMenuItemById = (id:number) => api.delete(`${url.DELETE_MENU_ITEM}/${id}`);
export const hardDeleteMenuItemById = (id:number) => api.delete(`${url.HARD_DELETE_MENU_ITEM}/${id}`);
export const restoreDeletedMenuItemById = (id:number) => api.delete(`${url.RESTORE_DELETED_MENU_ITEM}/${id}`);

//! Users
export const getUserDetailById = (id: string) => api.get(`${url.USER_DETAIL}/${id}`);
export const getAllUsers = () => api.get(url.USER_ALL);
export const getUsersByRole = (roleName: string) => api.get(`${url.USER_BY_ROLE}/${roleName}`);
export const updateUserProfile = (value: UpdateProfileRequest) => api.put(url.UPDATE_PROFILE, value);
export const updateExperienceProfile = (value: UpdateExperienceProfileRequest) => api.put(url.UPDATE_PROFILE_EXPERIENCE, value);
export const updateUserPassword = (value: any) => 
  api.put(url.UPDATE_PASSWORD, value);
export const updateUserAvatarUrl = (value:{userId:string,profilePictureUrl:string}) => 
  api.put(url.UPDATE_AVATAR, value);
export const deleteUserById = (id:string) => api.delete(`${url.DELETE_USER}/${id}`);

//! Roles
export const getRoles = () => api.get(url.ROLE_ALL);
export const createRole = (value: { name: string }) => 
  api.create(url.ROLE_CREATE, value);
export const updateRole = (value: { id: string; name: string }) => 
  api.put(url.ROLE_UPDATE, value);
export const deleteRoleById = (id: string) => 
  api.delete(`${url.ROLE_DELETE}/${id}`);
export const updateUserRoleRelation = (value: { userId: string; newRole: string }) => 
  api.put(url.UPDATE_USER_ROLE, value);
export const getRoleUsersAll = () => api.get(url.ROLE_USERS_ALL);
export const getRoleUsersByRole = (roleName: string) => 
  api.get(`${url.ROLE_USERS_BY_ROLE}/${roleName}`);


// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = (data : any) => api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postFakeLogin = (data : any) => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data : any) => api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data : any) => api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data : any) => api.put(url.POST_EDIT_PROFILE + '/' + data.idx, data);


// Register Method
export const postJwtRegister = (url : string, data  :any) => {
  return api.create(url, data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postJwtLogin = (data : any) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data : any) => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data : any) => api.create(url.SOCIAL_LOGIN, data);
