import { Modal, ModalHeader } from "reactstrap";
import { EditColumns } from ".."; 
import { useDataTable } from "context/DatatableContext";
import { TableColumnProvider } from "context/TableColumnContext";
import useThemeMode from "hooks/useThemeMode";

export const EditColumnsModal = ({ }) => {    
    const {  modal } = useDataTable();
    const { isDark } = useThemeMode();
        
    return (
        <TableColumnProvider>
            <Modal id="showModal" isOpen={modal.editColumnModal} toggle={modal.columnToggle} size="lg" centered>
                <ModalHeader className={`bg-${isDark?"dark":"light"} p-3`} toggle={modal.columnToggle}>
                    {modal.table?.name} Kolonlarını Düzenle
                    <span className="text-primary"> - #{modal.table?.id} </span> 
                </ModalHeader>
                <div className="p-2">
                    <EditColumns isModal={true} />
                </div>
                <style>{`
                    .btn-hover:hover {
                        color: white !important;
                    }

                    .btn-hover:hover i {
                        color: white !important;
                    }
                `}</style>
            </Modal>
        </TableColumnProvider>
    )
}
