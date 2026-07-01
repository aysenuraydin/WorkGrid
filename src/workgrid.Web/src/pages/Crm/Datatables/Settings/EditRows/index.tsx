import React, { useEffect } from "react";
import TableContainer from "components/Common/TableContainer";
import { Button, Alert } from "reactstrap";
import Loader from "components/Common/Loader";
import { toast } from 'react-toastify';
import { AddRowItem } from "./components/AddRowItem";
import { GenericModal } from "components/Common/GenericModal";
import { ChangePageSize } from "../../components/ChangePageSize";
import { TableRowWithStatus } from "components/Common/interfaces/TableRowContextType";
import { Datatable } from "common/data/Datatable";
import { ModalType } from "common/enums/ModalType";
import { useDataTable } from "context/DatatableContext";
import { useTableRow } from "context/TableRowContext";
import { TableColumn } from "common/data/TableColumn";
import { TabItem } from "../../hooks/useTabState";
import useThemeMode from "hooks/useThemeMode";
import { DARK_COLOR } from "context/Tenantbootstrap";
import DeleteModal from "components/Common/DeleteModal";

type CellValue = string | boolean;

export type FormValues = {
    tableId?: number;
    cells: Record<number, Record<number, CellValue>>;
};

export const EditRows = ({ isSettings, table }: { isSettings?: boolean, table: Datatable }) => {
    const { isDark } = useThemeMode();
    const {
        openAlertModal,
        setOpenAlertModal,
        rows,
        columns,
        cells,                 
        isTablesColumnsLoading,
        isTablesRowsLoading,
        isCellsLoading,         
        isTableAndRowsLoading,       
        tablesRowsError,
        fileDataRef,
        fileManagerRefs,
        fileColIds,
        formik,
        onSubmit,
        cols,
        flatRows,
        bulkDeleteCheckedRows
    } = useTableRow();

    const { modal, pending, pageSize, tabState, actions } = useDataTable();

    useEffect(() => {
        const addedRows = (rows[table?.id] || []).filter(r => r.isAdded);
        addedRows.forEach((row: TableRowWithStatus) => {
            fileColIds?.forEach((colId: number) => {
                const key = `cells.${row.id}.${colId}`;
                const stagedFiles = fileDataRef.current.selectedFiles[key];
                const ref = fileManagerRefs.current[key]?.current;
                if (ref && stagedFiles?.length > 0) {
                    ref.injectFiles(stagedFiles);
                }
            });
        });
    }, [rows[table?.id], fileColIds, fileDataRef, fileManagerRefs]);

    const changeTabs = () => {
        tabState.toggleTab?.({ name: "Tablolar" });
        tabState.setTabs?.((prev: TabItem[]) =>
            prev.some(t => t.name === table?.name)
                ? prev.filter(t => t.name !== table?.name)
                : [...prev]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const hasColumns = columns[table?.id] !== undefined;
    const hasRows = rows[table?.id] !== undefined;

    const stillLoading =
        isTablesColumnsLoading ||
        isTablesRowsLoading ||
        isCellsLoading;

    const isDataReady = hasColumns && hasRows && !stillLoading;

    if (!isDataReady) {
        console.log("⏳ EDIT ROW BEKLIYOR", {
            tableId: table?.id,
            hasColumns,
            hasRows,
            // hangi sorgu hala yukleniyor:
            kolonlar: isTablesColumnsLoading ? "yukleniyor" : "hazir",
            satirlar: isTablesRowsLoading ? "yukleniyor" : "hazir",
            hucreler: isCellsLoading ? "yukleniyor" : "hazir",
            foreign: isTableAndRowsLoading ? "yukleniyor" : "hazir",
        });
    }
    

    // console.log("🔍 FORMIK DEBUG", {
    //     formikCells: formik.values.cells,
    //     rowKeys: Object.keys(formik.values.cells || {}),
    //     row7: formik.values.cells?.[7],
    //     flatRowsCount: flatRows?.length,
    //     ilkFlatRow: flatRows?.[0],
    //     colsCount: cols?.length,
    // });


    if (!isDataReady) {
        return (
            <div className="pt-4">
                <Loader isText={true} />
            </div>
        );
    } 



    return (
        <>
            <div key={`table-form-${table?.id}`} className="live-preview"
                style={!!isSettings
                    ? { marginBottom: "0px" }
                    : { minHeight: "65vh", maxHeight: "65vh", overflow: "hidden" }}>
                <div className="table-responsive table-card p-3">

                    {(tabState.activeTab.name != "Tablolar" && tabState.activeTab.name != "Silinen Tablolar") &&
                        <DeleteModal
                            show={actions.deleteModalMulti}
                            onDeleteClick={() => {
                                actions.deleteTableMultiple();
                                actions.setTableDeleteModalMulti(false);
                                bulkDeleteCheckedRows()
                            }}
                            onCloseClick={() => {
                                actions.setTableDeleteModalMulti(false);
                                toast.error("Silme işlemi gerçekleşemedi!");
                            }}
                        />
                    }
                    {columns[table?.id]?.length > 0 ? (
                        <div style={{ position: "relative" }}>
                            <TableContainer
                                columns={cols ?? []}
                                data={flatRows ?? []}
                                isGlobalFilter
                                customPageSize={pageSize}
                                h={isSettings ? "22rem" : "45vh"}
                                divClass="table-responsive table-card mb-1 pt-0 table-min-height"
                                SearchPlaceholder="Bir şeyler arayın..."
                                tableClass="table-nowrap"
                                tbl={table}
                                theadClass={`table-${isDark ? '' : 'light'} text-muted text-uppercase`}
                                thClass={`${isDark ? 'text-light' : 'text-dark'}`}
                                filterColumns={(columns[table?.id] ?? []).filter((x: TableColumn) => x.isFilter) ?? []}
                            >
                                <AddRowItem table={table} />
                            </TableContainer>
                            <ChangePageSize />
                        </div>
                    ) : (
                        <>
                            <Alert color="danger" isOpen={true} className="p-3 my-3">
                                Sütun bulunamadı! Satırları görmek için sütun ekleyin.
                                <span className="text-bold px-2 btn" data-bs-toggle="modal"
                                    onClick={() => modal.handleEditColumnsClick?.(table)}>
                                    <i className="ri-add-line align-bottom me-1"></i>
                                    <span className="text-decoration-underline">Sütunları Düzenle</span>
                                </span>
                            </Alert>
                            {tablesRowsError && <div className="pt-4"><Loader isText={true} error={tablesRowsError} /></div>}
                        </>
                    )}
                </div>
            </div>
            <div className={`hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top mt-5`}
                style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}>
                <div className="hstack gap-2 justify-content-end">
                    <Button
                        className="btn btn-light"
                        type="button"
                        onClick={() => {
                            if (pending.getPendingCountForTable(table?.id) > 0) setOpenAlertModal(!openAlertModal);
                            else changeTabs();
                        }}>
                        <i className="ri-close-line fs-16 me-2"></i>
                        Kapat
                        <GenericModal
                            type={ModalType.Alert}
                            modal_backdrop={openAlertModal}
                            tog_backdrop={() => setOpenAlertModal(!openAlertModal)}
                            title="Emin misiniz?"
                            message="Kaydedilmemiş değişiklikleri silmek istiyor musunuz?"
                            confirmText="Kaydet"
                            onConfirm={() => {
                                formik.submitForm();
                                changeTabs();
                            }}
                            onClose={() => {
                                pending.clearPendingUpdatesForTable(table?.id);
                                changeTabs();
                                toast.error("Tablo kaydedilmedi!");
                            }}
                        />
                    </Button>

                    <button type="submit" className="btn btn-success" onClick={handleSubmit}>
                        <i className="ri-save-3-fill fs-16 me-2"></i>
                        Satırları Kaydet
                    </button>
                </div>
            </div>
        </>
    );
};