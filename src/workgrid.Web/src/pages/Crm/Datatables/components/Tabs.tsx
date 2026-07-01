import { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { toast } from 'react-toastify'; 
import { GenericModal } from 'components/Common/GenericModal'; 
import { ModalType } from 'common/enums/ModalType';
import { useTabs } from '../hooks/useTabs';
import { useDataTable } from 'context/DatatableContext';
import classnames from "classnames";
import { TabItem } from '../hooks/useTabState';
import { useAuth } from 'context/AuthContext';
import { useUserProfile } from 'hooks/useUser';
import { useTenantContext } from 'context/TenantContext';

export const Tabs = () => {
    const { tabState, pending, handleSaveAll } = useDataTable();  
    const { config: tenantConfig } = useTenantContext();
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const { changeTabs } = useTabs(
        tabState.activeTab, 
        tabState.setTabState, 
        tabState.tabs, 
        tabState.toggleTab, 
        tabState.setTabs
    );
    const { user: usr } = useAuth(); 
    const { data: user } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("WG") || user?.roles?.includes("Admin"); 

    return (
        <Nav className="nav-tabs nav-tabs-custom nav-primary" role="tablist">
            {tabState.tabs.map((tab: TabItem, index: number) => {
                // Sabit Sekmeler
                if (tab?.name === "Tablolar") {
                    return (
                        <NavItem key={tab?.id ?? index}>
                            <NavLink
                                className={classnames({ active: tabState.activeTab.name === "Tablolar" })}
                                onClick={() => tabState.toggleTab({ name: "Tablolar", id: 0 })}
                                href="#"
                            >
                                <i className='ri-grid-line'></i>{" "}
                                Tüm Tablolar
                            </NavLink>
                        </NavItem>
                    );
                }
                if (tab?.name === "Silinen Tablolar") {
                    return (
                        <>
                        { (isAdmin && tenantConfig.showCrm) &&  
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({ active: tabState.activeTab.name === "Silinen Tablolar" })}
                                    onClick={() => tabState.toggleTab({ name: "Silinen Tablolar", id: 0 })}
                                    href="#"
                                >
                                    <i className='ri-delete-bin-line'></i>{" "}
                                    Silinen Tablolar
                                </NavLink>
                            </NavItem>
                        }
                        </>
                    );
                }

                if (tab?.name === "İlişkiler") {
                    return (
                        <NavItem key={index}>
                            <NavLink
                                className={classnames({ active: tabState.activeTab.name === "İlişkiler" })}
                                onClick={() => tabState.toggleTab({ name: "İlişkiler", id: 0 })}
                                href="#"
                            >
                                <i className="ri-arrow-left-right-line"></i>{" "}
                                Tablo İlişkileri
                            </NavLink>
                        </NavItem>
                    );
                }

                // Dinamik Tablo Sekmeleri
                return (
                    <NavItem key={index}>
                        <NavLink className={classnames({ active: tabState.activeTab.name === tab?.name })} href="#">
                            {pending.getPendingCountForTable(tab?.id ?? 0)
                                ? <span className="badge bg-primary align-middle ms-1"> 
                                    {pending.getPendingCountForTable(tab?.id ?? 0) > 99 && <span>+</span>}
                                    {pending.getPendingCountForTable(tab?.id ?? 0)} 
                                  </span> 
                                : <i className="ri-layout-grid-line"></i>
                            }{" "}
                            <span className='block p-2' onClick={() => tabState.toggleTab({ name: tab?.name ?? "", id: tab?.id ?? 0 })}> 
                                {tab?.name}
                                <span onClick={(e) => {
                                    e.stopPropagation();
                                    if (pending.getPendingCountForTable(tab?.id ?? 0) > 0) setOpenAlertModal(!openAlertModal);
                                    else changeTabs(tab.id ?? 0);
                                }}>
                                    <i className="ri-close-fill icon-size ps-1"></i>
                                </span>
                                <GenericModal
                                    type={ModalType.Alert}
                                    modal_backdrop={openAlertModal}
                                    tog_backdrop={() => setOpenAlertModal(!openAlertModal)}
                                    title="Değişiklikleri Kaydet?"
                                    message="Kaydedilmemiş değişiklikleri iptal etmek istiyor musunuz?"
                                    confirmText="Kaydet"
                                    onConfirm={() => { 
                                        handleSaveAll(tab?.id ?? 0);
                                        changeTabs(tab?.id ?? 0);
                                    }}
                                    onClose={() => { 
                                        pending.clearPendingUpdatesForTable(tab?.id ?? 0);
                                        changeTabs(tab.id ?? 0);
                                        toast.error("Değişiklikler kaydedilmedi!");
                                    }}
                                />
                            </span> 
                        </NavLink>
                    </NavItem>
                ); 
            })}
            <style>
                {`
                .icon-size {
                    font-size: 20px !important;
                    position: absolute;
                    top: 4px;
                }
                `}
            </style>
        </Nav>
    );
};