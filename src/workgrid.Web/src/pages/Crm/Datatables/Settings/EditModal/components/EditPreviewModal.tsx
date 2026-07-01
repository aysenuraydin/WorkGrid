import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { Modal, ModalHeader, ModalBody, Alert, ModalFooter } from "reactstrap";
import { registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./EditPreviewModal.css";

import { ModalSizeType } from "common/enums/ModalSizeType";
import { ModalDesign } from "common/data/ModalDesign";
import { TableColumn } from "common/data/TableColumn";
import { InputTypeEnum } from "common/enums/inputTypeEnum";

import { PreviewItem } from "./PreviewItem";
import { Datatable } from "common/data/Datatable";
import { useEditPreviewModalForm } from "../hooks/useEditPreviewModalForm";
import { useEditPreviewModalActions } from "../hooks/useEditPreviewModalActions";
import { useEditPreviewModalHeight } from "../hooks/useEditPreviewModalHeight";
import { useEditPreviewModalColumns } from "../hooks/useEditPreviewModalColumns";
import { FileManagerRef } from "pages/Crm/DatatableItem/RenderCellInput/components/FileInput";
import useThemeMode from "hooks/useThemeMode";
import { useDataTable } from "context/DatatableContext";
import { getTableLabel } from "common/data/constans";

interface CreateRowProps {
    modal?: boolean;
    setModal?: Dispatch<SetStateAction<boolean>>;
    toggle?: () => void; 
    table: Datatable;
}
export type IModalDesignExtended = ModalDesign & {
    id: number;
    name: string;
    type: InputTypeEnum;
}

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export const EditPreviewModal = ({ modal, setModal, toggle = () => {} }: CreateRowProps) => {
    const { isDark } = useThemeMode();
    const [isPreview, setIsPreview] = useState(true);
    const [designColumns, setDesignColumns] = useState<IModalDesignExtended[]>([]);
    const [columns, setColumns] = useState<TableColumn[]>([]);

    //!===== DOSYA =====
    const [loading, setLoading] = useState<{ [key: string]: boolean[] }>({});
    const [selectedFile, setSelectedFile] = useState<{ [key: string]: File[] }>({});
    const [selectedForDeletion, setSelectedForDeletion] = useState<{ [key: string]: string[] }>({});
    const fileManagerRefs = useRef<{ [key: string]: React.RefObject<FileManagerRef> | null }>({});
    //!===== DOSYA =====

    const modalBodyRef = useRef<HTMLDivElement>(null);
    const [modalHeight, setModalHeight] = useState<number>();
    const { modal:data } = useDataTable(); 

    const isSmallModal = data.table?.modalSize === ModalSizeType.Sm || data.table?.modalSize === ModalSizeType.Md;
    const isFullModal = data.table?.modalSize === ModalSizeType.Full || data.table?.modalSize === ModalSizeType.Blank || data.table?.modalSize === ModalSizeType.Overlay;

    const { handleSubmit, handleChange, formik } = useEditPreviewModalForm(
        data.table, 
        columns, 
        designColumns, 
        modalHeight
    );
    const { 
        swapOrder, 
        startResizeLeft, 
        startResizeRight, 
        startResizeWidth, 
        startResizeVertical, 
        startDrag, 
        ResetDesigntoEverything, 
        ResetDesign 
    } = useEditPreviewModalActions(
        setDesignColumns, 
        data.table?.id
    );
    const {
        changeModalHeightFromTop,
        changeModalHeightFromBottom
    } = useEditPreviewModalHeight(
        data.table,
        modalBodyRef,
        modalHeight,
        setModalHeight,
        modal,      
    );
    
    const { 
        minOrder, 
        maxOrder 
    } = useEditPreviewModalColumns(
        data.table?.id ?? 0, 
        setDesignColumns, 
        setColumns, 
        designColumns
    );

    useEffect(() => {
        formik.resetForm();
    }, [modal]);

    const handleToggleVisible = (id: number) => {
        setDesignColumns(prev => {
            if (!prev) return prev;
            const updated = [...prev];
            const i = updated.findIndex(c => c.id === id);
            if (i !== -1) updated[i] = { ...updated[i], isVisible: !updated[i].isVisible };
            return updated;
        });
    };

    const handleCancelMove = (id: number) => {
        setDesignColumns(prev => {
            if (!prev) return prev;
            const updated = [...prev];
            const i = updated.findIndex(c => c.id === id);
            if (i !== -1) updated[i] = { ...updated[i], isMove: false, x: 0, y: 0 };
            return updated;
        });
    };

    const itemProps = {
        isPreview, 
        columns, 
        formik, 
        handleChange, 
        fileManagerRefs, 
        table:data.table,
        loading,
        setLoading, 
        selectedFile, 
        setSelectedFile,
        selectedForDeletion, 
        setSelectedForDeletion,
        minOrder, 
        maxOrder,
        swapOrder, 
        startResizeLeft, 
        startResizeRight, 
        startResizeWidth,
        startResizeVertical, 
        startDrag,
        onToggleVisible: handleToggleVisible,
        onCancelMove: handleCancelMove,
    };

    return (
        <Modal
            className={isFullModal ? "h-100" : ""}
            size={data.table?.modalSize?.toLocaleLowerCase() ?? ModalSizeType.Md}
            fullscreen={isFullModal}
            isOpen={modal}
            toggle={toggle}
            centered
            style={{ zIndex: "999999999999", userSelect: "none" }}
        >
            <ModalHeader className={`bg-${isDark ? "dark" : "light"} p-3`} toggle={toggle}>
                <span className="text-capitalize">Önizleme:</span> {getTableLabel(data.table?.name)}
            </ModalHeader>

            <ModalBody innerRef={modalBodyRef} className={`position-relative ${isFullModal ? "h-100" : ""}`}>
                {isPreview && !isFullModal && (
                    <>
                        <i
                            className="ri-arrow-up-s-fill position-absolute top-0 translate-middle-y text-primary end-50 mt-1 fs-4"
                            onMouseDown={changeModalHeightFromTop}
                            style={{ cursor: "ns-resize" }}
                        />
                        <span className="position-absolute translate-middle-y text-primary end-50 top-100 pb-2 fs-4">
                            <i
                                className="ri-arrow-down-s-fill"
                                onMouseDown={changeModalHeightFromBottom}
                                style={{ cursor: "ns-resize" }}
                            />
                        </span>
                    </>
                )}

                <div
                    className={`hide-scrollbar ${isFullModal ? "h-100" : ""}`}
                    style={{
                        height: modalHeight ?? undefined,
                        maxHeight: isFullModal ? "88vh" : "70vh",
                        overflow: "scroll",
                    }}
                >
                    <div className="d-flex flex-wrap align-content-start px-2 h-100">
                        {[...(designColumns ?? [])]
                            .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
                            .map(col => (
                                <PreviewItem key={col.id} col={col} {...itemProps} />
                            ))}
                    </div>
                </div>

                {columns.length === 0 && (
                    <Alert color="danger" isOpen className="p-3">
                        Sütun bulunamadı! Modalları görmek için sütun ekleyin.
                    </Alert>
                )}
            </ModalBody>

            <ModalFooter className="modal-footer border-top pt-2">
                <div className={`btn ${isSmallModal ? "btn-sm" : ""} btn-dark`} onClick={ResetDesign}>
                    <i className="ri-refresh-line fs-16 me-2" /> Geri Al
                </div>
                <div className={`btn ${isSmallModal ? "btn-sm" : ""} btn-danger`} onClick={ResetDesigntoEverything}>
                    <i className="ri-refresh-line fs-16 me-2" /> Sıfırla
                </div>
                <div className={`btn ${isSmallModal ? "btn-sm" : ""} btn-primary`} onClick={() => setIsPreview(p => !p)}>
                    <i className="ri-eye-fill fs-16 me-2" />
                    {isPreview ? "Önizlemeyi Göster":"Modalı Göster"}
                </div>
                <button
                    type="button"
                    className={`btn ${isSmallModal ? "btn-sm" : ""} btn-light`}
                    onClick={() => setModal?.(false)}
                >
                    <i className="ri-close-line fs-16 me-2" /> İptal
                </button>
                <button
                    type="button"
                    className={`btn ${isSmallModal ? "btn-sm" : ""} btn-success`}
                    onClick={handleSubmit}
                >
                    <i className="ri-save-3-fill fs-16 me-2" />
                    {isSmallModal ? "Kaydet" : "Modalı Kaydet"}
                </button>
            </ModalFooter>
        </Modal>
    );
};