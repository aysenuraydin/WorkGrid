import { DataType } from 'common/enums/DataType';
import { useDataTable } from 'context/DatatableContext';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'; 
import { useResetPositions } from '../Relationships/hooks/useResetPositions';
import { useState } from 'react';
import { useTenantContext } from 'context/TenantContext';

export const DatatableHeader = () => {
    const {  
        setIsExportCSV, 
        modal,
        tabState, 
        actions, 
        setTableList
    } = useDataTable();   
    const { resetPositions } = useResetPositions(setTableList);  
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { config: tenantConfig } = useTenantContext();

    return (
        <Row className="align-items-center gy-3">
            <div className="col-sm">
                <h5 className="card-title mb-0">{tabState.activeTab?.name}</h5>
            </div>
            <div className="col-sm-auto">
                <div className="d-flex gap-1 flex-wrap">
                    {/* İçe/Dışa Aktarma */}
                    { tabState.activeTab?.name == "İlişkiler" &&
                        <button type="button" onClick={() => setConfirmOpen(true)} className="btn btn-outline-dark" >
                            <i className="ri-refresh-line align-bottom" ></i>
                        </button>
                    }
                    {/* Tablo Oluşturma */}
                    { tenantConfig.showCrm &&
                        <button
                            type="button"
                            className="btn btn-primary add-btn"
                            onClick={() => { 
                                modal.setModalType(DataType.Create); 
                                modal.tableToggle(); 
                            }}
                        >
                        <i className="ri-add-line align-bottom me-1"></i> Tablo Oluştur
                    </button>
                    }
                    <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                        <i className="ri-file-upload-line align-bottom me-1"></i> İçe Aktar
                    </button>
                    <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                        <i className="ri-file-download-line align-bottom me-1"></i> Dışa Aktar
                    </button>
                    
                    {/* Çoklu Silme İşlemleri */}
                    {(actions.isTableMultiDeleteButton || actions.isRowMultiDeleteButton) && (
                        <button 
                            className="btn btn-soft-danger"
                            onClick={() => actions.setTableDeleteModalMulti(true)}
                        >
                            <i className="ri-delete-bin-2-line"></i>
                        </button>
                    )}

                    <Modal isOpen={confirmOpen} toggle={() => setConfirmOpen(prev => !prev)} centered>
                        <ModalHeader toggle={() => setConfirmOpen(false)}>
                            Yedekten Geri Yukle
                        </ModalHeader>
                        <ModalBody>
                            Bu islem mevcut tum tablo ogelerinin konumlarını silip resetler. İşlem yapılsın mı?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="light" onClick={() => setConfirmOpen(false)}>
                                Vazgec
                            </Button>
                            <Button
                                color="danger" 
                                onClick={() => {
                                    resetPositions(); 
                                    setConfirmOpen(false);
                                }}
                            >
                                Reset
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        </Row>
    );
};