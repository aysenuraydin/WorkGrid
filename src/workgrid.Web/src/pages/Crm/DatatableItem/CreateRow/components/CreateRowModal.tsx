import { 
    Modal,
    ModalHeader, 
} from "reactstrap";
import { registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import 'react-toastify/dist/ReactToastify.css';
import "quill/dist/quill.snow.css"; 
import { ModalSizeType } from "common/enums/ModalSizeType"; 
import { CreateRow } from ".."; 
import { useDataTableItem } from "context/DatatableItemContext";
import useThemeMode from "hooks/useThemeMode";
import { DataType } from "common/enums/DataType";


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
export const CreateRowModal = ({ }) =>{  
    const { isDark } = useThemeMode(); 
    const{  
        toggle,   
        table,  
        modal,  
        modalType,  
        effectiveRowId 
    } = useDataTableItem();
    return (
        <Modal
            size={table?.modalSize?.toLocaleLowerCase() ?? ModalSizeType.Md}
            fullscreen={table?.modalSize === ModalSizeType.Full}
            isOpen={modal}
            toggle={()=>{
                toggle();
            }}
            centered
            className="position-relative"
            style={{ zIndex:"999999999999", userSelect: "none"}}
        >
            <ModalHeader className={`bg-${isDark?"dark":"light"} p-3`} toggle={toggle}>
                <span className="text-capitalize"></span> 
                {table?.name??""}{" "}
                {modalType === DataType.Create ? "Oluştur" 
                : modalType === DataType.Edit ? "Düzenle" 
                : "Görüntüle"}
                { effectiveRowId !== 0  && 
                <span className="text-primary ms-2">#{effectiveRowId}</span>}
            </ModalHeader>
            <CreateRow/>
        </Modal>
    )
}

