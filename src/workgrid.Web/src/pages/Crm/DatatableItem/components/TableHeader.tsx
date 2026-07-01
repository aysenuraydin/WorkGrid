import { DataType } from 'common/enums/DataType';
import { TableViewType } from 'common/enums/TableViewType';
import { Row } from 'reactstrap';
import { useDataTableItem } from 'context/DatatableItemContext'; 
import { canCreateTable, getTableLabel, isLockControl } from 'common/data/constans';
import { useAuth } from 'context/AuthContext';
import { useUserProfile } from 'hooks/useUser';
import { useCanWrite } from 'hooks/useCanWrite';

export const TableHeader = () => {
    const {  
        setIsExportCSV, 
        setTableDeleteModalMulti,  
        toggle, 
        checkedAll, 
        table, 
        setModalType, 
        isMultiDeleteButton,   
    } = useDataTableItem(); 

    const { user: usr } = useAuth(); 
    const { data: user } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("WG");

    const tableName = getTableLabel(table?.name) 

    const canWrite = useCanWrite(table?.id); 

    return (
        <Row className="align-items-center gy-3">
            <div className="col-sm">
                <h5 className="card-title mb-0">
                    {tableName 
                        ? (tableName)
                        : (
                            <p className="card-text placeholder-glow m-0">
                                <span className="placeholder col-4"></span>
                            </p>
                        )
                    }
                </h5>
            </div>
            <div className="col-sm-auto">
                <div className="d-flex gap-1 flex-wrap">
                    {(canWrite && (!isLockControl(tableName??"") || canCreateTable(tableName??"") || isAdmin)) &&
                        <button
                            type="button"
                            className="btn btn-primary d-inline-flex align-items-center gap-2"
                            onClick={() => { setModalType(DataType.Create); toggle(); }} 
                        >
                            <i className="ri-add-line align-bottom"></i> 
                            {tableName ? `${tableName} Ekle` : "Öğe Ekle"}
                        </button>
                    }
                    
                    <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                        <i className="ri-file-upload-line align-bottom me-1"></i> İçe Aktar
                    </button>
                    <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                        <i className="ri-file-download-line align-bottom me-1"></i> Dışa Aktar
                    </button>

                    {isMultiDeleteButton && (
                        <>
                            {table?.viewType === TableViewType.Grid && (
                                <button className="btn btn-soft-danger">
                                    <input 
                                        type="checkbox" 
                                        id="checkBoxAll" 
                                        className="form-check-input me-1" 
                                        onClick={() => checkedAll()} 
                                    /> Tümünü Seç
                                </button>
                            )}
                            <button className="btn btn-soft-danger" onClick={() => setTableDeleteModalMulti(true)}>
                                <i className="ri-delete-bin-2-line"></i>
                            </button>
                        </>
                    )}
                </div> 
            </div>
        </Row>
    );
};