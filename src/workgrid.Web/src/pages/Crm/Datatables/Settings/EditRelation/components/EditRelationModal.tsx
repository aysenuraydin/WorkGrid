import { Modal, ModalHeader } from "reactstrap"; 
import { EditRelation } from "..";
import { useDataTable } from "context/DatatableContext";
import useThemeMode from "hooks/useThemeMode";

export const EditRelationModal = ({ }) => { 
    const { modal } = useDataTable();
    const { isDark } = useThemeMode();  
    
    return (
        <Modal id="showModal" isOpen={modal.editRelationModal} toggle={modal.relationToggle} centered style={{ userSelect: "none" }}>
            <ModalHeader className={`bg-${isDark ? "dark" : "light"} p-3`} toggle={modal.relationToggle}>
                {modal.table?.name} İlişkilerini Düzenle
                <span className="text-primary"> - #{modal.table?.id} </span> 
            </ModalHeader>
            <div className="p-3">
                <EditRelation />
            </div>
        </Modal>
    );
};