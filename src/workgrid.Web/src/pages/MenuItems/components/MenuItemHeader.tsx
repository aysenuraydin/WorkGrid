import { DataType } from 'common/enums/DataType';
import { useMenu } from 'context/MenuContext';
import { Row } from 'reactstrap';
import "../MenuItems.css";
import MenuSnapshotActions from './MenuSnapshotActions';

export const MenuItemHeader = () => {
    const { actions } = useMenu();
    
    return (
        <Row className="align-items-center gy-3">
            <div className="col-sm">
                <h5 className="card-title mb-0">Menü Öğeleri</h5>
            </div>
            <div className="col-sm-auto">
                <div className="d-flex gap-1 flex-wrap">
                    <MenuSnapshotActions/>
                    <button
                        type="button"
                        className="btn btn-primary add-btn"
                        onClick={() => { 
                            actions.setModalType(DataType.Create); 
                            actions.toggleItemModal(); 
                            actions.setItemModal(true); 
                            actions.setMenuItem(null);
                        }}
                    >
                        <i className="ri-add-line align-bottom me-1"></i> 
                        Menü Öğesi Ekle
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary add-btn"
                        onClick={() => { 
                            actions.setModalType(DataType.Create); 
                            actions.toggleDividerModal(); 
                            actions.setDividerModal(true); 
                            actions.setDivider(null);
                        }}
                    >
                        <i className="ri-add-line align-bottom me-1"></i> 
                        Ayraç Ekle
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-info" 
                        onClick={() => actions.setIsExportCSV(true)}
                    >
                        <i className="ri-file-upload-line align-bottom me-1"></i> 
                        İçe Aktar
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-info" 
                        onClick={() => actions.setIsExportCSV(true)}
                    >
                        <i className="ri-file-download-line align-bottom me-1"></i> 
                        Dışa Aktar
                    </button>
                </div>
            </div>
        </Row>
    );
};