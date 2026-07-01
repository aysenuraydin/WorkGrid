import { useQueryClient } from "@tanstack/react-query"; 
import { useEffect, useMemo } from "react"; 
import { useSearchParams } from "react-router-dom";
import ExportCSVModal from "components/Common/ExportCSVModal";
import DeleteModal from "components/Common/DeleteModal"; 
import { Alert, Card, CardBody, CardHeader, Container } from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { Tabs } from "./Tabs";
import { DatatableHeader } from "./DatatableHeader"; 
import Loader from "components/Common/Loader";
import TableContainer from "components/Common/TableContainer";
import { ChangePageSize } from "./ChangePageSize";
import { Relationships } from "../Relationships/Relationships";
import { EditRows } from "../Settings/EditRows";
import { EditTableModal } from "../Settings/EditTable/components/EditTableModal";
import { EditSettings } from "../Settings";
import { EditRelationModal } from "../Settings/EditRelation/components/EditRelationModal";
import { EditColumnsModal } from "../Settings/EditColumns/components/EditColumnsModal";
import { toast, ToastContainer } from "react-toastify"; 
import { useDataTable } from "context/DatatableContext";
import { TableRowProvider } from "context/TableRowContext";
import { Datatable } from "common/data/Datatable";
import { TabItem } from "../hooks/useTabState";
import { useGetBrand } from "hooks/useBrand";
import useThemeMode from "hooks/useThemeMode";
import { useTenantContext } from "context/TenantContext";
import { CART_TABLE, FAVORITE_TABLE, isBlogControl, isLockControl, isProductControl } from "common/data/constans";

export interface UpdateItem {
    cellId: number;
    value: string;
}

export const Datatables = () => {  
    const { data: brand } = useGetBrand();
    const { isDark } = useThemeMode(); 
    document.title = "Tablolar | " + (brand?.companyName || "Workgrid");

    const [searchParams, setSearchParams] = useSearchParams();
    const { config: tenantConfig } = useTenantContext();
    const queryFromUrl = searchParams.get("q") ?? "";

    const clearQuery = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("q");
        setSearchParams(next, { replace: true });
    };
    
    const queryClient = useQueryClient();  
    const {   
        pageSize, 
        tables, 
        isTablesLoading,  
        deletedtables,  
        isDeletedTablesLoading, 
        modal,
        tabState, 
        actions, 
        columns, 
    } = useDataTable();  
    
    
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ["GetTable", modal.table?.id] });
        };
    }, [modal.table?.id, queryClient]);

    const rawData = tabState.activeTab.name === "Tablolar"
        ? tables?.data ?? []
        : deletedtables?.data ?? [];

    const isLoading = (tabState.activeTab.name === "Tablolar" && isTablesLoading) ||
                    (tabState.activeTab.name === "Silinen Tablolar" && isDeletedTablesLoading);

    const activeData = useMemo(() => {
        const allTables = Object.values(rawData);

        let filteredList = allTables;
        if (!tenantConfig.showECommerce) {
            filteredList = filteredList.filter(t => !isProductControl(t.name));
        }
        if (!tenantConfig.showBLog) {
            filteredList = filteredList.filter(t => !isBlogControl(t.name));
        }
        if (!tenantConfig.showCrm) {
            filteredList = filteredList.filter(t => isLockControl(t.name));
        }
        filteredList = filteredList.filter(t => t.name != CART_TABLE && t.name != FAVORITE_TABLE);

        return  filteredList;
    }, [rawData, tenantConfig, tables, deletedtables]);  

    return (
        <div className="page-content" style={{ userSelect: "none" }}>
        <ExportCSVModal data={tables?.data} /> 
        {(tabState.activeTab.name == "Tablolar" || tabState.activeTab.name == "Silinen Tablolar") && 
            <DeleteModal
                show={actions.deleteModalMulti}
                onDeleteClick={() => {
                    actions.deleteTableMultiple();
                    actions.setTableDeleteModalMulti(false);
                    actions.deleteCheckedRow();
                }}
                onCloseClick={() => {
                    actions.setTableDeleteModalMulti(false);
                    toast.error("Silme işlemi gerçekleşemedi!");
                }}
            />
        }
        <Container fluid>
            <BreadCrumb title="Tablolar" pageTitle={brand?.companyName || "Workgrid"} />

            {queryFromUrl && tabState.activeTab.name === "Tablolar" && (
                <div className="mb-3">
                    <span className="badge bg-primary-subtle text-primary d-inline-flex align-items-center gap-1 fs-13">
                        <span><span className="fw-medium">"{queryFromUrl}"</span> için sonuçlar</span>
                        <i className="ri-close-line" style={{ cursor: "pointer" }} onClick={clearQuery} />
                    </span>
                </div>
            )}

            <Card>
                <CardHeader className="card-header btable-0">
                    <DatatableHeader/>
                </CardHeader> 
                <CardBody className="pt-0">
                    <Tabs /> 

                    {(tabState.activeTab.name === "Tablolar" || tabState.activeTab.name === "Silinen Tablolar") && (
                    <>
                        {isLoading && <div className="pt-3"><Loader /></div>}

                        {tabState.activeTab.name === "Silinen Tablolar" && (deletedtables?.data?.length ?? 0) > 0 && (
                            <Alert color="warning" className="w-100 mt-3" style={{ marginBottom: "-2px" }}>
                                <i className="ri-alert-line fs-4 me-2" />
                                Bu veriler, silinme tarihinden itibaren 30 gün sonra otomatik olarak kalıcı şekilde silinecektir!
                            </Alert>
                        )}

                        {activeData.length > 0 ? (
                        <div style={{ position: "relative" }}>
                            <TableContainer
                                columns={columns}
                                data={activeData}
                                isGlobalFilter
                                customPageSize={pageSize}
                                divClass="table-responsive table-card mb-1 pt-0 table-min-height"
                                tableClass="align-middle table-nowrap"
                                theadClass={`table-${isDark ? 'dark' : 'light'} text-muted text-uppercase`}
                                thClass={`${isDark ? 'text-light' : 'text-dark'}`}
                                SearchPlaceholder="Ara..."
                                isTableFilter
                                initialGlobalFilter={tabState.activeTab.name === "Tablolar" ? queryFromUrl : ""}
                            />
                            <ChangePageSize />
                        </div>
                        ) : (
                        !isLoading && (
                            <Alert color="danger" isOpen className="p-3 my-3">
                                Veri bulunamadı!
                            </Alert>
                        )
                        )}
                    </>
                    )}

                    {/* Dinamik tablo sekmeleri */}
                    {(tables?.data ?? []).filter((t: Datatable) => t.name !== "Tablolar" && t.name !== "İlişkiler").map((t: Datatable) => {
                        const isOpen = tabState.tabs.some((tab: TabItem) => tab.id === t.id);
                        if (!isOpen) return null;
                        return (
                            <div
                                key={`wrapper-${t.id}`}
                                className={(tabState.activeTab?.id === t.id ? "tab-active" : "d-none") + " position-relative"}
                                style={{ display: tabState.activeTab?.id === t.id ? "block" : "none" }}
                            >
                                <TableRowProvider table={t}> 
                                    <EditRows key={`edit-rows-${t.id}`} table={t} />
                                </TableRowProvider>
                            </div>
                        );
                    })} 

                    {/* İlişkiler sekmesi */}
                    {tabState.activeTab.name === "İlişkiler" && <Relationships />}
                    
                    {modal.modal && <EditTableModal />}
                    {modal.editSettingModal && <EditSettings />}
                    {modal.editRelationModal && <EditRelationModal />}
                    {modal.editColumnModal && <EditColumnsModal />}

                    <ToastContainer closeButton={true} limit={3} style={{ marginTop: "100px" }} />
                </CardBody>
            </Card>
        </Container>
        </div>
    );
};