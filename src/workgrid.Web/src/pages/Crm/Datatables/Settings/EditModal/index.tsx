import { Alert, Label } from 'reactstrap';
import { useGetDatatableColumns } from 'hooks/useTableColumns';
import { useEditModals } from './hooks/useEditModals';
import { EditPreviewModal } from './components/EditPreviewModal';
import { useDataTable } from 'context/DatatableContext'; 
import useThemeMode from 'hooks/useThemeMode';

export const EditModal = ({ verticalTab }: { verticalTab: string }) => {
    const { modal } = useDataTable(); 
    const { isDark } = useThemeMode(); 
    const { data: tablesColumns } = useGetDatatableColumns(modal.table?.id ?? 0);  
    const { 
        setEditDesignModal, 
        editDesignModal, 
        designToggle 
    } = useEditModals(modal.table?.id, verticalTab);
    
    return (
        <div>
            <Label htmlFor="foreignTablesId" className="form-label">
                Modallar
            </Label>
            {tablesColumns?.data?.length === 0 && (
                <Alert color="danger" isOpen={true} className="p-3">
                    Sütun bulunamadı! Modalları görmek için sütun ekleyin.
                </Alert>
            )} 
            <div className='hide-scrollbar d-flex flex-wrap align-content-start px-2'>
            </div> 
            <div className={`hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top`}>
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                        modal.setEditSettingModal(false);
                    }}
                >
                    <i className="ri-close-line fs-16 me-2"></i>
                    İptal
                </button>
                <div className="btn btn-primary" onClick={() => setEditDesignModal(true)}>
                    <i className="ri-eye-fill fs-16 me-2"></i>
                    Modal Önizleme
                </div>
            </div>
            <EditPreviewModal
                modal={editDesignModal}
                setModal={setEditDesignModal}
                toggle={designToggle}
                table={modal.table}
            /> 
        </div>
    );
};