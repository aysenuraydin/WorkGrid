export const SECTIONS = [
    { id: "sec-renkler",   label: "Renk Paleti",       icon: "ri-palette-line" },
    { id: "sec-cubuk",     label: "Sidebar & Topbar",   icon: "ri-layout-left-line" },
    { id: "sec-bg",        label: "Arka Plan",          icon: "ri-landscape-line" },
    { id: "sec-logo",      label: "Logo & Favicon",     icon: "ri-image-line" },
    { id: "sec-tipografi", label: "Tipografi",          icon: "ri-text" },
    { id: "sec-moduller",  label: "Modüller",           icon: "ri-apps-line" },
    { id: "sec-layout",    label: "Düzen & Görünüm",    icon: "ri-layout-line" },
];

export const MAIN_VIEW_OPTIONS = [
    { value: "dashboard",   label: "Dashboard", icon: "ri-dashboard-line" },
    { value: "kanbanboard", label: "Kanban",    icon: "ri-layout-column-line" },
    { value: "calendar",    label: "Takvim",    icon: "ri-calendar-line" },
    { value: "toDoList",    label: "Görevler",  icon: "ri-task-line" },
];

export const FEATURE_TOGGLES = [
    { key: "showCalendar",  label: "Takvim",    description: "Sol menüde takvim bağlantısı",  icon: "ri-calendar-line" },
    { key: "showTask",      label: "Görevler",  description: "Kanban panosu modülü",           icon: "ri-layout-column-line" },
    { key: "showKanban",    label: "Kanban",    description: "Görev yönetimi sayfası",         icon: "ri-task-line" },
    { key: "showChat",      label: "Sohbet",    description: "Canlı sohbet modülü",            icon: "ri-message-3-line" },
    { key: "showCrm",       label: "CRM",       description: "Müşteri ilişkileri yönetimi",    icon: "ri-contacts-line" },
    { key: "showECommerce", label: "E-Ticaret", description: "Ürün ve sipariş yönetimi",       icon: "ri-store-line" },
    { key: "showBLog",     label: "BLog",     description: "Olay kayıtları ve denetim logu", icon: "ri-file-list-3-line" },
    { key: "showLanding",   label: "Landing",   description: "Karşılama sayfası yönetimi",     icon: "ri-rocket-2-line" },
];