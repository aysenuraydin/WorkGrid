import React from "react";
import { Label } from "reactstrap";
import { ModalDesign } from "common/data/ModalDesign";
import { TableColumn } from "common/data/TableColumn"; 
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { DataType } from "common/enums/DataType";
import { getColHeight } from "common/utils/getColHeight";
import "./EditPreviewModal.css";
import { Datatable } from "common/data/Datatable";
import { FileManagerRef } from "pages/Crm/DatatableItem/RenderCellInput/components/FileInput";
import { RenderCellInput } from "pages/Crm/DatatableItem/RenderCellInput";
import useThemeMode from "hooks/useThemeMode";
import { useGetTenantConfig } from "hooks/useTenant";

interface PreviewItemProps {
    col: ModalDesign & { id: number; name: string; type: InputTypeEnum };
    isPreview: boolean;
    columns: TableColumn[];
    formik: any;
    handleChange: any;
    fileManagerRefs: React.MutableRefObject<{ [key: string]: React.RefObject<FileManagerRef> | null }>;
    table: Datatable;
    loading: { [key: string]: boolean[] };
    setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean[] }>>;
    selectedFile: { [key: string]: File[] };
    setSelectedFile: React.Dispatch<React.SetStateAction<{ [key: string]: File[] }>>;
    selectedForDeletion: { [key: string]: string[] };
    setSelectedForDeletion: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    minOrder: number;
    maxOrder: number;
    // actions
    swapOrder: (id: number, dir: "left" | "right") => void;
    startResizeLeft: (id: number) => React.MouseEventHandler;
    startResizeRight: (id: number) => React.MouseEventHandler;
    startResizeWidth: (id: number) => React.MouseEventHandler;
    startResizeVertical: (id: number, edge: "top" | "bottom") => React.MouseEventHandler;
    startDrag: (id: number) => React.MouseEventHandler;
    onToggleVisible: (id: number) => void;
    onCancelMove: (id: number) => void;
}

export const PreviewItem = ({
    col,
    isPreview,
    columns,
    formik,
    handleChange,
    fileManagerRefs,
    table,
    loading, setLoading,
    selectedFile, setSelectedFile,
    selectedForDeletion, setSelectedForDeletion,
    minOrder, maxOrder,
    swapOrder, startResizeLeft, startResizeRight,
    startResizeWidth, startResizeVertical,
    startDrag, onToggleVisible, onCancelMove,
}: PreviewItemProps) => {
    const { data: tenantConfig, } = useGetTenantConfig(); 
    const inputHeight = getColHeight(col.type);
    const { isDark } = useThemeMode();

    const bg = isDark ? "bg-soft-light text-light":"bg-light";
    const text = isDark ? "text-light":"text-black";

    return (
        <div className={`col-${col.width === 0 ? 2 : col.width} p-2`}>
            <div
                className="position-relative"
                style={{
                position: col.isMove ? "absolute" : undefined,
                top: col.isMove ? col.y : undefined,
                left: col.isMove ? col.x : undefined,
                height: col.isMove ? 0 : "",
                }}
            >
                <div
                className={`position-relative d-flex rounded px-2
                    ${!col.isVisible && isPreview ? bg : ""}
                    ${col.isVisible && isPreview ? "border border-primary" : ""}
                `}
                style={{ minHeight: col.spaceTop + col.spaceBottom + inputHeight + "px" }}
                >
                <div className={`col-${col.spaceLeft}`} />

                <div className={`col-${12 - (col.spaceLeft + col.spaceRight)} position-relative`}>
                    <div style={{ height: col.spaceTop }} />

                    {isPreview ? (
                    <div style={{ minHeight: inputHeight + "px" }}>
                        <Label htmlFor={`field-${col.id}`} className={"form-label pe-2"+text}>
                        {col.name}
                        </Label>
                        <div
                        className="px-2 rounded p-2 justify-content-between d-flex text-primary"
                        onMouseDown={startResizeWidth(col.id)}
                        style={{ backgroundColor: "rgba(var(--vz-primary-rgb), 0.5)", minHeight: inputHeight - 32 + "px" }}
                        >
                        <i className="bx bx-chevrons-left fs-4" />
                        <span className={isDark?"text-light":""}>{col.width}</span>
                        <i className="bx bx-chevrons-right fs-4" />
                        </div>
                    </div>
                    ) : (
                    <div style={{ minHeight: inputHeight + "px" }}>
                        {col.isVisible && (
                        <RenderCellInput
                            value={formik.values.cells?.[0]?.[col.id]}
                            rowId={0}
                            columns={columns}
                            col={columns.find(c => c.id === col.id)!}
                            cells={[]}
                            formik={formik}
                            modalType={DataType.Create}
                            handleChange={handleChange}
                            fileManagerRefs={fileManagerRefs}
                            table={table}
                            loading={loading}
                            setLoading={setLoading}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            selectedForDeletion={selectedForDeletion}
                            setSelectedForDeletion={setSelectedForDeletion}
                        />
                        )}
                    </div>
                    )}

                    <div style={{ height: col.spaceBottom }} />

                    {isPreview && (
                    <>
                        <i className="ri-radio-button-fill position-absolute top-0 translate-middle text-primary end-50"
                        onMouseDown={startResizeVertical(col.id, "top")} style={{ cursor: "ns-resize" }} />
                        <i className="ri-radio-button-fill position-absolute top-50 translate-middle text-primary start-0"
                        onMouseDown={startResizeLeft(col.id)} style={{ cursor: "ew-resize" }} />
                        <i className="ri-radio-button-fill position-absolute top-50 start-100 translate-middle text-primary"
                        onMouseDown={startResizeRight(col.id)} style={{ cursor: "ew-resize" }} />
                        <i className="ri-radio-button-fill position-absolute translate-middle text-primary end-50 top-100"
                        onMouseDown={startResizeVertical(col.id, "bottom")} style={{ cursor: "ns-resize" }} />

                        <span className="position-absolute translate-middle text-primary ms-2 start-100 top-100 cursor-pointer text-black"
                            onMouseDown={startDrag(col.id)}>
                        <i className="ri-drag-move-2-fill fs-4" />
                        </span>

                        {col.isMove && (
                        <span className="position-absolute translate-middle text-primary cursor-pointer"
                                style={{ right: "5px", top: "15px" }}
                                onMouseDown={() => onCancelMove(col.id)}>
                            <i className="ri-close-fill fs-3 text-black" />
                        </span>
                        )}
                    </>
                    )}
                </div>

                <div className={`col-${col.spaceRight}`} />

                {isPreview && (
                    <>
                    <span
                        className="position-absolute bg-primary-subtle text-primary rounded px-1 end-0 m-1"
                        style={{ cursor: "pointer", zIndex: 99999 }}
                        onClick={() => onToggleVisible(col.id)}
                    >
                        <i className={col.isVisible ? "ri-eye-fill" : "ri-eye-off-fill"} />
                    </span>

                    {minOrder !== col.order && !col.isMove && (
                        <i onClick={() => swapOrder(col.id, "left")}
                        className="ri-arrow-left-s-fill position-absolute translate-middle text-primary start-0 top-50 fs-2 cursor-pointer" />
                    )}
                    {maxOrder !== col.order && !col.isMove && (
                        <i onClick={() => swapOrder(col.id, "right")}
                        className="ri-arrow-right-s-fill position-absolute translate-middle text-primary start-100 top-50 fs-2 cursor-pointer" />
                    )}
                    </>
                )}
                </div>
            </div>
        </div>
    );
};