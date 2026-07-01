import { ModalBody, CardBody, Card, Alert } from "reactstrap";
import { EditColumnItem } from "./components/EditColumnsItem";
import { AddColumn } from "./components/AddColumn";
import { DeletedColumns } from "./components/DeletedColumns";
import { Tabs } from "./components/Tabs";
import { useDataTable } from "context/DatatableContext";
import { useTableColumn } from "context/TableColumnContext";
import "./EditColumns.css";
import { ExtendedTableColumn } from "components/Common/interfaces/TableColumnContextType";
import useThemeMode from "hooks/useThemeMode";
import { DARK_COLOR } from "context/Tenantbootstrap";

export const EditColumns = ({ isModal, isSettings }: { isModal?: boolean, isSettings?: boolean }) => {
    const { modal } = useDataTable();
    const { isDark } = useThemeMode();
    const { columns, isAllDatas, visibleColumns, handleSaveAll, scrollRef } = useTableColumn();

    const rowStyle = {
        backgroundColor: isDark ? DARK_COLOR : "#ffffff",
        color: isDark ? "#ffffff" : "#212529"
    };

    return (
        <div ref={scrollRef}>
            <ModalBody className="py-0">
                <Card style={{ backgroundColor: rowStyle.backgroundColor }}>
                    <Tabs />
                    <CardBody className="mb-4">
                        {isAllDatas == 1 ? (
                            <div className="live-preview">
                                <div className="table-wrapper px-0"
                                    style={isSettings
                                        ? { overflow: "scroll", height: "27rem", margin: "-17px -35px" }
                                        : { margin: "-17px", height: "28rem", overflow: "scroll" }
                                    }
                                    ref={scrollRef}
                                >
                                    <table className="table align-middle table-nowrap mb-0" style={{ color: rowStyle.color }}>
                                        <thead className="text-muted text-uppercase sticky-header" style={rowStyle}>
                                            <tr style={rowStyle}>
                                                <th scope="col" style={{ ...rowStyle, width: "46px" }}></th>
                                                <th scope="col" style={rowStyle}>Sütun No</th>
                                                <th scope="col" style={rowStyle}>Sütun Adı</th>
                                                <th scope="col" style={{ ...rowStyle, width: "130px" }}>Veri Tipi</th>
                                                <th scope="col" className="last-column" style={rowStyle}>Görünür</th>
                                                <th scope="col" className="last-column" style={rowStyle}>Filtre</th>
                                                <th className="last-column" style={{ ...rowStyle, width: "85px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AddColumn />
                                            {columns?.length === 0 && (
                                                <tr className="p-0">
                                                    <td colSpan={7} style={{ height: "30px", backgroundColor: rowStyle.backgroundColor }}>
                                                        <Alert color="danger" isOpen={true} className="p-3 mt-2">
                                                            Sütun bulunamadı! Listelemek için sütun ekleyin.
                                                        </Alert>
                                                    </td>
                                                </tr>
                                            )}
                                            {visibleColumns
                                                ?.slice()
                                                .sort((a, b) => (a.tableOrder ?? 0) - (b.tableOrder ?? 0))
                                                .map((item: ExtendedTableColumn) => (
                                                    <EditColumnItem key={item.id} column={item} />
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="table-wrapper scroll-body px-0"
                                style={isSettings
                                    ? { height: "28rem", overflow: "scroll", margin: "-17px -35px", backgroundColor: rowStyle.backgroundColor }
                                    : { margin: "-17px", height: "28rem", overflow: "scroll", backgroundColor: rowStyle.backgroundColor }
                                } >
                                <DeletedColumns />
                            </div>
                        )}
                    </CardBody>
                </Card>
            </ModalBody>
            
            <div className={`hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top ${isModal ? "p-3 pe-3" : ""}`}
                style={rowStyle}>
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => modal.setEditColumnModal(false)}
                >
                    <i className="ri-close-line fs-16 me-2"></i>
                    İptal
                </button>

                <button
                    onClick={handleSaveAll}
                    type="button"
                    className="btn btn-success"
                >
                    <i className="ri-save-3-fill fs-16 me-2"></i>
                    Sütunları Kaydet
                </button>
            </div>
        </div>
    )
}