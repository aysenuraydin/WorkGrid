import { Modal, ModalHeader, Form, ModalBody, ModalFooter } from "reactstrap";
import { DataType } from "common/enums/DataType";
import { useDataTable } from "context/DatatableContext";
import { useTableForm } from "../hooks/useTableForm";
import { EditTableForm } from "./EditTableForm";
import useThemeMode from "hooks/useThemeMode";

export const EditTableModal = ({ }) => {
    const { modal } = useDataTable();
    const { isDark } = useThemeMode();
    const {
        formik,
        focusMap,
        changedMap,
        handleChange,
        handleFocus,
        handleBlur
    } = useTableForm({
        table: modal.table,
        type: modal.modalType,
        modal: modal.modal,
        toggle: modal.tableToggle
    });

    // Modal başlığını Türkçe'ye uyarlayan yardımcı fonksiyon
    const getModalTitle = (type: string) => {
        const titles: Record<string, string> = {
            [DataType.Create]: "Yeni Tablo Ekle",
            [DataType.Edit]: "Tabloyu Düzenle",
            [DataType.View]: "Tabloyu Görüntüle"
        };
        return titles[type] || "Tablo İşlemleri";
    };

    return (
        <Modal id="showModal" isOpen={modal.modal} toggle={modal.tableToggle} centered style={{ userSelect: "none" }}>
            <ModalHeader className={`bg-${isDark ? 'dark' : 'light'} p-3`} toggle={modal.tableToggle}>
                <span className={`text-capitalize ${isDark ? 'text-light' : ''}`}>
                    {getModalTitle(modal.modalType)}
                </span>
                {
                    modal.table?.id &&
                    modal.modalType !== DataType.Create &&
                    <span className="text-primary"> - #{modal.table.id} </span>
                }
            </ModalHeader>
            <Form className="tablelist-form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                formik.handleSubmit();
                return false;
            }}>
                <ModalBody>
                    <EditTableForm
                        modal={modal}
                        formik={formik}
                        focusMap={focusMap}
                        changedMap={changedMap}
                        handleChange={handleChange}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                    />
                </ModalBody>
                <ModalFooter className="modal-footer">
                    <div className="hstack gap-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                                modal.setModal(false);
                            }}
                        >
                            Kapat
                        </button>

                        {modal.modalType !== DataType.View && (
                            <button type="submit" className="btn btn-success">
                                {modal.modalType === DataType.Create ? "Oluştur" : "Kaydet"}
                            </button>
                        )}
                    </div>
                </ModalFooter>
            </Form>
            <style>
                {`
                div.w-100:hover {
                    border: none !important;
                }
                `}
            </style>
        </Modal>
    )
}