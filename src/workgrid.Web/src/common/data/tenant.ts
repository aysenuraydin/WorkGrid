// --- 1. Temel Marka Modülü ---
export interface IBrandConfig {
    companyName: string;
    description: string;
    website: string; // ekledim
}

// --- 2. İletişim ve Sosyal Medya ---
export interface IContactConfig {
    address1: string;
    address2: string;
    workingHours: string;
    email: string;
    phone: string;
}

export interface ISocialLink {
    id: string;      
    platform: string; 
    iconUrl: string;  
    url: string;      
} 

// --- 3. Bileşen Bazlı Modüller ---
export interface IHeroSection {
    title: string;
    description: string;
}

export interface ITeamMember {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    email: string;
}

export interface IServiceItem {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export interface IServiceSection {
    mainTitle: string;  
    mainDescription: string;  
    items: IServiceItem[];
}
export interface IPlanFeature {
    text: string;
    isIncluded: boolean;
}

export interface IPlanItem {
    id: string;
    name: string;
    subTitle: string;
    icon: string;      
    priceMonthly: number;
    priceAnnual: number;
    features: IPlanFeature[];
    isPopular: boolean;
}

export interface IPlanSection {
    title: string;
    description: string;
    monthlyDiscountLabel: string;
    items: IPlanItem[];
}

// --- FAQs Modülü ---
export interface IFAQQuestion {
    q: string;
    a: string;
}

export interface IFAQCategory {
    category: string;
    icon: string;
    questions: IFAQQuestion[];
}

// --- Stats (Counter) Modülü ---
export interface IStatsSection {
    projectsCompleted: number;
    awardsWon: number;
    satisfiedClients: number;
    employees: number;
} 

export interface ITestimonial {
    id: string;
    name: string;
    role: string;
    comment: string;
    avatarUrl: string;
    rating: number; 
}

export interface IProject {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    clientName: string;
    link: string; 
}
export interface IProject {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    clientName: string;
    link: string; 
}
export interface ClientItem {
    id: string;
    name: string;
    logoUrl: string;
}

export interface IFeatureDetail {
    id?: number;  
    label: string;
    value?: string;   
    isApproved: boolean;
}

export interface IFeatureItem {
    id?: number ;
    title: string;
    subTitle?: string;
    description: string;
    imageUrl: string;
    iconUrl?: string;
    orderNumber: number;
    isRight: boolean;     
    bgColor: string;     
    featuresDetails: IFeatureDetail[];
}

export interface ICtaConfig {
    text: string;
    buttonText: string;
    buttonUrl: string;
}

export interface IHeroSliderImage {
    id?: number;
    imageUrl: string;
    orderNumber: number;
    landingHeroConfigId?: number;
}

export interface ILandingHeroConfig {
    id?: number;
    title: string;
    description: string;
    sliderImages: IHeroSliderImage[];
}

export interface IUpdateLandingHeroDto {
    title: string;
    description: string;
    sliderImages: string[];
}

export interface IUpdateLandingHeroDto {
    title: string;
    description: string;
    sliderImages: string[]; 
}

export interface IAboutConfig {
    url: string;
    description: string;
}
    
export interface IGalleryItem {
    id: number;
    name: string;
    url: string;
}
export interface IDocumentConfig { 
    description: string;
}