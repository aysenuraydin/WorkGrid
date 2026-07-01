import { useEffect, useMemo } from "react";
import { Card, CardBody, Container, CardHeader, Alert } from "reactstrap";
import { toast, ToastContainer } from 'react-toastify'; 
import DeleteModal from "components/Common/DeleteModal";    
import { useMenu } from "context/MenuContext";   
import { useBuildNestedMenu } from "../hooks/useBuildNestedMenu";
import { useDeleteItem } from "../hooks/useDeleteItem";
import { MenuItemHeader } from "./MenuItemHeader";
import { RenderMenuItems } from "./RenderMenuItems";
import { CreateMenuItem } from "./CreateMenuItem";
import { CreateDivider } from "./CreateDivider";
import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import "../MenuItems.css";
import { Tabs } from "./Tabs";
import { useGetBrand } from "hooks/useBrand";
    
export const MenuItems = () => { 
    const { data: brand } = useGetBrand();
    const { 
        menuItemList, 
        openMenus, 
        setOpenMenus,  
        isMenuItemsLoading, 
        menuItemsError,
        menuItems, 
        state,
        actions,
        isAllDatas,
        deletedMenuItemList,
        isDeletedMenuItemsLoading,
        deletedMenuItemsError
    } = useMenu();

    const { deleteItem } = useDeleteItem(!isAllDatas); 

    const nestedMenu = useMemo(() => 
        useBuildNestedMenu(
            isAllDatas ? menuItemList : deletedMenuItemList, 
            openMenus, 
            setOpenMenus
    ), [menuItemList, deletedMenuItemList, isAllDatas, openMenus, setOpenMenus, menuItems]);  

    return (
        <div className={`page-content`} style={{ userSelect: "none" }}>
            <Container fluid>
                <BreadCrumb title="Menü Öğeleri" pageTitle={brand?.companyName || "Workgrid"} />  
                <Card>
                    <CardHeader className="card-header bmenuItem-0">
                        <MenuItemHeader />
                    </CardHeader>
                    <Tabs />

                    <CardBody className="cardContent"> 

                        {(isAllDatas ? isMenuItemsLoading : isDeletedMenuItemsLoading) && (
                            <div className="pt-4"><Loader isText={true} /></div>
                        )}

                        <div className="verti-sitemap border-bottom px-3">
                            {isAllDatas && !isMenuItemsLoading && !menuItemsError && menuItemList.length === 0 && (
                                <Alert color="warning" isOpen={true} className="p-3 my-3">
                                    Listelenecek menü öğesi bulunamadı!
                                </Alert>
                            )}

                            {!isAllDatas && !isDeletedMenuItemsLoading && !deletedMenuItemsError && deletedMenuItemList.length === 0 && (
                                <Alert color="warning" isOpen={true} className="p-3 my-3">
                                    Silinen menü öğesi bulunamadı!
                                </Alert>
                            )}

                            {(!isMenuItemsLoading && menuItems?.succeeded)
                                ? <RenderMenuItems nestedMenu={nestedMenu} />
                                : null}
                        </div>

                        {/* Hata Uyarıları */}
                        {isAllDatas && !menuItemList.length && menuItemsError && (
                            <Alert color="danger" className="p-3 my-3">
                                {typeof menuItemsError === "string"
                                    ? menuItemsError || "Veri bulunamadı!"
                                    : menuItemsError?.message || "Veri bulunamadı!"}
                                {menuItems?.errors && <span> {menuItems.errors}</span>}
                            </Alert>
                        )}

                        {!isAllDatas && !deletedMenuItemList.length && deletedMenuItemsError && (
                            <Alert color="danger" className="p-3 my-3">
                                {typeof deletedMenuItemsError === "string"
                                    ? deletedMenuItemsError || "Veri bulunamadı!"
                                    : deletedMenuItemsError?.message || "Veri bulunamadı!"}
                                {menuItems?.errors && <span> {menuItems.errors}</span>}
                            </Alert>
                        )}

                        <ToastContainer closeButton={true} limit={3} style={{ marginTop: "100px" }} /> 
                    </CardBody> 
                </Card>
            </Container>

            <CreateMenuItem /> 
            <CreateDivider />

            <DeleteModal
                show={state.deleteModal}
                onDeleteClick={async () => {
                    actions.setDeleteModal(false); 
                    if (state.deleteItems?.id) await deleteItem(state.deleteItems.id);
                }}
                onCloseClick={() => {
                    actions.setDeleteModal(false);
                    toast.warning("Silme işlemi iptal edildi!");
                }}
            />  
        </div>
    );
};