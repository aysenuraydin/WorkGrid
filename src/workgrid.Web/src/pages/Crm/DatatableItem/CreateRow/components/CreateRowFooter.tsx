import { ModalFooter } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { DataType } from "common/enums/DataType"; 
import { useDataTableItem } from "context/DatatableItemContext";
import { ModalSizeType } from "common/enums/ModalSizeType";
import { getTableLabel } from "common/data/constans";

export const CreateRowFooter = ({   }) => {
    const navigate = useNavigate();
    const{   
        toggle, 
        table, 
        setModal,
        modalType,  
        isSmallModal, 
        modalSize
    } = useDataTableItem();

const handleCancel = () => {
    if (modalSize === ModalSizeType.Blank.toLocaleLowerCase()) {
        window.close();
        return; 
    }

    if (modalSize !== ModalSizeType.Overlay.toLocaleLowerCase()) {
        setModal(false);
        toggle?.();
        return;
    }

    const targetId = table?.id ?? 0;
    if (targetId !== 0) {
        navigate(`/datatable/${targetId}`);
    } else {
        navigate(-1);
    }
};

    return (
        <ModalFooter className={`modal-footer position-absolute end-0 bottom-0 pt-2 ${ modalSize == ModalSizeType.Blank.toLocaleLowerCase() ? "p-3" : ""}`}>
            <button
                type="button"
                className={`btn ${isSmallModal ? "btn-sm" : ""} btn-light me-2`}
                onClick={handleCancel}
            >
                <i className="ri-close-line fs-16 me-2" />
                { modalSize == ModalSizeType.Blank.toLocaleLowerCase() ? "İptal" : "Kapat"}
            </button>
            {modalType !== DataType.View && (
                <button type="submit" className={`btn ${isSmallModal ? "btn-sm" : ""} btn-success me-2`}>
                    <i className="ri-save-3-fill fs-16 me-2" />
                    {getTableLabel(table?.name ?? "Satır")}{" "}
                    <span className="text-capitalize">{modalType == DataType.Create ? "Oluştur":"Düzenle"}</span>
                </button>
            )}
        </ModalFooter>
    );
};
