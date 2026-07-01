import React, { useState, useEffect, useMemo } from "react";
import {
    Container, Nav, NavItem, NavLink, TabContent, TabPane,
} from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "components/Common/BreadCrumb"; 
import { TenantSettingsProviders } from "../../context/TenantsettingContext";
import { ClientItemsProvider } from "context/ClientItemsContext";  
import { FeaturesProvider } from "context/FeaturesContext";  

import { PlansAdminPage } from "./Components/PlansAdminPage";
import { FaqAdminPage } from "./Components/FaqAdminPage";
import { StatsAdminPage } from "./Components/StatsAdminPage";
import { ServicesAdminPage } from "./Components/ServicesAdminPage";
import { SocialLinksAdmin } from "./Components/SocialLinksAdmin";
import { BrandingAdmin } from "./Components/BrandingAdmin";
import { ProjectsAdmin } from "./Components/ProjectsAdmin";
import { TestimonialAdmin } from "./Components/TestimonialAdmin";
import { ClientItemsAdmin } from "./Components/ClientItemsAdmin";  
import { FeaturesAdmin } from "./Components/FeaturesAdmin";  
import { useGetBrand } from "hooks/useBrand";
import { ToastContainer } from "react-toastify";
import { CommerceAdmin } from "./Components/CommerceConfigAdmin";
import { useGetTenantConfig } from "hooks/useTenant";
import { HeroAdminPage } from "./Components/HeroAdminPage";
import { AboutAdminPage } from "./Components/AboutAdminPage";
import { GalleryAdminPage } from "./Components/GalleryAdminPage";
import { ThemaSettings } from "./ThemaSettings";

type TabId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11"| "12" | "13" | "14" | "15";

const BASE_TABS = [
    { id: "1", label: "Tema", icon: "ri-palette-line" },
    { id: "14", label: "Hakkımızda", icon: "ri-briefcase-line" },
    { id: "15", label: "Galeri", icon: "ri-briefcase-line" },
    { id: "6", label: "Sosyal", icon: "ri-share-line" },
    { id: "7", label: "Marka", icon: "ri-building-4-line" },
    { id: "3", label: "SSS", icon: "ri-question-answer-line" },
];

const IS_LANDING_TABS = [
    { id: "2", label: "Plans", icon: "ri-price-tag-3-line" },
    { id: "4", label: "İstatistikler", icon: "ri-bar-chart-box-line" },
    { id: "5", label: "Hizmetler", icon: "ri-stack-line" },
    { id: "11", label: "Özellikler", icon: "ri-list-settings-line" },
    { id: "10", label: "Referanslar", icon: "ri-shield-star-line" },
    { id: "8", label: "Yorumlar", icon: "ri-star-line" },
    { id: "9", label: "Projeler", icon: "ri-briefcase-line" },
    { id: "13", label: "Başlık", icon: "ri-briefcase-line" },
];
const COMMERCE_ONLY_TABS = [
    { id: "12", label: "E-Ticaret Ayarları", icon: "ri-shopping-cart-2-line" },
];

export const TenantSettings = (_props: any) => {
    const { data: brand } = useGetBrand();
    document.title = "Ayarlar | " +(brand?.companyName || "Workgrid");
    const { data: tenantConfig } = useGetTenantConfig();
    const [activeTab, setActiveTab] = useState<TabId>("1");

    const visibleTabs = useMemo(() => {
        let tabs = [...BASE_TABS]; 
        if (tenantConfig?.showLanding ) {
            tabs = [...tabs, ...IS_LANDING_TABS];
        }
        if (tenantConfig?.showECommerce) {
            tabs = [...tabs, ...COMMERCE_ONLY_TABS];
        }
        return tabs;
    }, [tenantConfig]);

    useEffect(() => {
        if (!visibleTabs.some(t => t.id === activeTab)) {
            setActiveTab("1");
        }
    }, [visibleTabs, activeTab]);

    return (
        <TenantSettingsProviders>
            <ClientItemsProvider> 
                <FeaturesProvider>
                    <div className="page-content">
                        <Container fluid>
                            <BreadCrumb title="Yapılandırma" pageTitle={brand?.companyName || "Workgrid"}/>
                            <Nav tabs className="nav nav-tabs nav-tabs-custom nav-primary nav-justified mb-3 nav-scrollable">
                                {visibleTabs.map(({ id, label, icon }) => (
                                    <NavItem key={id} style={{ flex: "0 0 auto" }}>
                                        <NavLink
                                            style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                                            className={classnames({ active: activeTab === id })}
                                            onClick={() => setActiveTab(id as TabId)}
                                        >
                                            <i className={`${icon} me-1 align-middle`} />
                                            {label}
                                        </NavLink>
                                    </NavItem>
                                ))}
                            </Nav>
                            <TabContent activeTab={activeTab} className="text-muted">
                                <TabPane tabId="1"><ThemaSettings /></TabPane>
                                <TabPane tabId="6"><SocialLinksAdmin /></TabPane>
                                <TabPane tabId="7"><BrandingAdmin /></TabPane>
                                <TabPane tabId="3"><FaqAdminPage /></TabPane>
                                <TabPane tabId="14"><AboutAdminPage /></TabPane>
                                <TabPane tabId="15"><GalleryAdminPage /></TabPane>

                                {(tenantConfig?.showLanding) && (
                                    <>
                                        <TabPane tabId="2"><PlansAdminPage /></TabPane>
                                        <TabPane tabId="4"><StatsAdminPage /></TabPane>
                                        <TabPane tabId="5"><ServicesAdminPage /></TabPane>
                                        <TabPane tabId="11"><FeaturesAdmin /></TabPane>
                                        <TabPane tabId="10"><ClientItemsAdmin /></TabPane>
                                        <TabPane tabId="8"><TestimonialAdmin /></TabPane>
                                        <TabPane tabId="9"><ProjectsAdmin /></TabPane>
                                        <TabPane tabId="13"><HeroAdminPage /></TabPane>
                                    </>
                                )}
                                {(tenantConfig?.showECommerce) && (
                                    <>
                                        <TabPane tabId="12"><CommerceAdmin /></TabPane>
                                    </>
                                )}
                            </TabContent>
                            <style>{`
                                .nav-scrollable {
                                    display: flex;
                                    flex-wrap: nowrap !important;
                                    overflow-x: auto;
                                    white-space: nowrap;
                                    -webkit-overflow-scrolling: touch;
                                }

                                .nav-scrollable::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style> 

                        </Container>
                    </div>
                    <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}} />
                </FeaturesProvider>
            </ClientItemsProvider>
        </TenantSettingsProviders>
    );
};