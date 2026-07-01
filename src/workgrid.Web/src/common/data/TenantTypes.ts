// ==========================================================================
// LAYOUT ENUMS & TYPES
// ==========================================================================

import { bg } from "@fullcalendar/core/internal-common";

export enum TLayoutType {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
    TWOCOLUMN = "twocolumn",
    SEMIBOX = "semibox"
}

export enum TLayoutModeType {
    LIGHTMODE = "light",
    DARKMODE = "dark"
}

export enum TLeftSidebarType {
    LIGHT = "light",
    DARK = "dark",
    GRADIENT = "gradient",
    GRADIENT_2 = "gradient-2",
    GRADIENT_3 = "gradient-3",
    GRADIENT_4 = "gradient-4"
}

export enum TLayoutWidthType {
    FLUID = "lg",
    BOXED = "boxed"
}

export enum TLayoutPositionType {
    FIXED = "fixed",
    SCROLLABLE = "scrollable"
}

export enum TTopbarThemeType {
    LIGHT = "light",
    DARK = "dark",
    GRADIENT = "gradient"
}

export enum TLeftSidebarSizeType {
    DEFAULT = "lg",
    COMPACT = "md",
    SMALLICON = "sm",
    SMALLHOVER = "sm-hover"
}

export enum TLeftSidebarViewType {
    DEFAULT = "default",
    DETACHED = "detached"
}

export enum TLeftSidebarImageType {
    NONE = "none",
    IMG1 = "img-1",
    IMG2 = "img-2",
    IMG3 = "img-3",
    IMG4 = "img-4"
}

export enum TPreloaderType {
    ENABLE = "enable",
    DISABLE = "disable"
}

export enum TBackgroundImageType {
    NONE = "none",
    IMG1 = "img-1",
    IMG2 = "img-2",
    IMG3 = "img-3"
}

export enum TSidebarVisibilityType {
    SHOW = "show",
    HIDDEN = "hidden"
} 

export interface TenantConfig {
    id?: number;

    // Renk Ayarları
    primaryColor: string;
    secondaryColor: string;
    successColor: string;
    dangerColor: string;
    warningColor: string;
    infoColor: string;
    lightColor: string;
    darkColor: string;
    
    // Navbar / Sidebar & Arka Plan Arka Planları
    sidebarBg: string;
    isGradientSideBar: boolean;  //ekledim
    sideBarFirstColor: string;  //ekledim
    sideBarSecondColor: string; //ekledim
    sideBarDeg:         string;
    sidebarTextColor: string;
    
    topbarBg: string;
    isGradientTopbar:  boolean;
    topbarFirstColor:  string;
    topbarSecondColor: string;
    topbarDeg:         string;
    topbarTextColor:  string;

    // Logo & Favicon URL'leri
    logoSmUrl: string;
    logoLightUrl: string;
    logoDarkUrl: string;
    faviconUrl: string;
    logoSmHeight: string;
    logoDarkHeight: string;
    logoLightHeight: string;

    // Arka Plan Resim/Gradient Ayarları (Sistem Geneli)
    isGradientBg: boolean;
    bgFirstColor: string;
    bgSecondColor: string;
    deg: string;
    bgSolidColor: string;
    isBgImg: boolean;
    isBgFlat: boolean;
    bgImgUrl: string;

    // Tipografi & Ergonomi
    fontFamily: string;
    fontSize: string;
    borderRadius: string;

    // Modül / Özellik Görünürlükleri (Features)
    showCalendar: boolean;
    showCrm: boolean;
    showECommerce: boolean;
    showBLog: boolean;
    showTask: boolean;
    showKanban: boolean;
    showChat: boolean;
    showLanding: boolean;

    // Layout Yapılandırması (Enum tiplerini doğrudan buraya bağlıyoruz)
    mainView: string;
    layoutType: string;
    layoutModeType: string;
    leftSidebarType: string;
    layoutWidthType: string;
    layoutPositionType: string;
    topbarThemeType: string;
    leftSidebarSizeType: string;
    leftSidebarViewType: string;
    leftSidebarImageType: string;
    preloader: string;
    backgroundImageType: string;
    sidebarVisibilityType: string;

    // Audit Alanları (Opsiyonel)
    createdAt?: any;
    createdBy?: string;
    createdByUserId?: string;        

    lastModifiedAt?: any;
    lastModifiedBy?: string;
    lastModifiedByUserId?: string;       
}

export const workgridDefaultTenant: TenantConfig = {
    // Renk Ayarları
    primaryColor: "#4f46e5",
    secondaryColor: "#06b6d4",
    successColor: "#10b981",
    dangerColor: "#ef4444",
    warningColor: "#f59e0b",
    infoColor: "#3b82f6",
    lightColor: "#f3f4f6",
    darkColor: "#1f2937",

    // Navbar / Sidebar & Arka Plan Başlangıç Renkleri
    sidebarBg:  "#ffffff",
    isGradientSideBar: false,  
    sideBarFirstColor:  "",  
    sideBarSecondColor:  "",  
    sideBarDeg:          "135",
    sidebarTextColor: "#ffffff",
    
    topbarBg:  "#ffffff",
    isGradientTopbar:  false,
    topbarFirstColor:   "",
    topbarSecondColor:  "",
    topbarDeg: "135",
    topbarTextColor:  "#1a1a2e",

    // Logo & Favicon URL'leri
    logoSmUrl: "/favicon.ico",
    logoLightUrl: "/favicon.ico",
    logoDarkUrl: "/favicon.ico",
    faviconUrl: "/favicon.ico",
    logoSmHeight:  "22px",
    logoDarkHeight:"17px",
    logoLightHeight: "17px",

    isGradientBg: false,
    bgFirstColor: "",
    deg: "135",
    bgSecondColor: "",
    bgSolidColor: "",
    isBgImg: true,
    isBgFlat: true,
    bgImgUrl: "/assets/images/bg-pattern.png",

    fontFamily: "'Inter', sans-serif",
    fontSize: "2.2rem", 
    borderRadius: "8px",

    showCalendar: true,
    showCrm: false,
    showECommerce: false,
    showBLog: true,
    showTask: true,
    showKanban: true,
    showChat: true,
    showLanding: true,

    // Layout Yapılandırması
    mainView: "Dashboard",
    layoutType: "vertical",
    layoutModeType: "light",
    leftSidebarType: "dark",
    layoutWidthType: "lg",
    layoutPositionType: "fixed",
    topbarThemeType: "light",
    leftSidebarSizeType: "lg",
    leftSidebarViewType: "default",
    leftSidebarImageType: "none",
    preloader: "disable",
    backgroundImageType: "img-3",
    sidebarVisibilityType: "show"
};



