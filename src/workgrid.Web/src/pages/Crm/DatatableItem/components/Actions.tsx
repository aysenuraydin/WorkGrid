import { DataType } from 'common/enums/DataType';
import { ModalType } from 'common/enums/ModalType';
import { toSafeId } from 'common/utils/stringUtils';
import { PopConfirm } from 'components/Common/PopConfirm';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDatatableAction } from '../hooks/useDatatableAction';
import { canDeleteTable, canEditTable } from 'common/data/constans';
import { useAuth } from 'context/AuthContext';
import { useUserProfile } from 'hooks/useUser';
import { useCanWrite } from 'hooks/useCanWrite';

interface ActionsProps {
    handleClick: (arg: any, type: DataType) => void;
    tableId: number;
    tableName: string;
    props: any; 
    hardDelete?: (id: number) => void;
    isAllDatas?: number; 
}

export const Actions = ({ handleClick, props, tableId, isAllDatas, tableName }: ActionsProps) => { 
        
    const safeName = toSafeId([props?.name, props?.id], "q", "action"); 
    const { hardDeleteTableRow, deleteItem, backToDelete } = useDatatableAction(tableId);  
    const { user: usr } = useAuth(); 
    const { data: user } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("WG"); 
    const canWrite = useCanWrite(tableId); 
    
    return (
        <div className="d-flex gap-2 justify-content-end me-1">
        {
            isAllDatas === 1 ? 
            (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link to="#" className="text-primary d-inline-block" onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation();
                            handleClick(props, DataType.View);
                        }}>
                            <i className="ri-eye-fill fs-16"></i>
                        </Link>
                    </li>
                    {canWrite &&
                    <>
                        {(canEditTable(tableName) || isAdmin) &&
                            <li className="list-inline-item edit">
                                <Link to="#" className="text-primary d-inline-block edit-item-btn" onClick={() => handleClick(props, DataType.Edit)}>
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                            </li>
                        }
                        {(canDeleteTable(tableName)  || isAdmin ) &&
                            <li className="list-inline-item">
                                <Link to="#" id={`q-${safeName}-col-popconfirm-${props?.id}`} className="btn btn-sm btn-soft-danger btn-hover">
                                    <i className="ri-delete-bin-5-fill fs-14 text-danger"></i>
                                </Link> 
                                <PopConfirm 
                                    targetId={`q-${safeName}-col-popconfirm-${props?.id}`} 
                                    type={ModalType.Alert}
                                    message='Bu kaydı silmek istediğinizden emin misiniz?'
                                    confirmText='Sil!'
                                    onConfirm={async () => await deleteItem(props?.id)} 
                                    onClose={() => toast.error("Silme işlemi iptal edildi!")} 
                                />
                            </li> 
                        }
                    </>
                    }
                </ul> 
            ) : (
                <div className="list-inline-item">
                    <Link to="#" id={`q-${safeName}-col-popconfirm-${props?.id}`} className="btn btn-sm btn-soft-primary hoverColor me-1">
                        <i className="ri-arrow-go-back-fill fs-14 text-primary hoverColor"></i>
                    </Link> 
                    <PopConfirm 
                        targetId={`q-${safeName}-col-popconfirm-${props?.id}`} 
                        type={ModalType.Confirm}
                        message='Bu kaydı geri yüklemek istediğinizden emin misiniz?'
                        confirmText='Geri Yükle!'
                        onConfirm={async () => await backToDelete?.(props?.id)} 
                        onClose={() => toast.warning("Geri yükleme iptal edildi!")} 
                    />
                    <Link to="#" id={`d-${safeName}-col-popconfirm-${props?.id}`} className="btn btn-sm btn-soft-danger hoverColor">
                        <i className="ri-delete-bin-5-fill fs-14 hoverColor text-danger"></i>
                    </Link> 
                    <PopConfirm 
                        targetId={`d-${safeName}-col-popconfirm-${props?.id}`} 
                        type={ModalType.Alert}
                        message='Bu kaydı kalıcı olarak silmek istediğinizden emin misiniz?'
                        confirmText='Kalıcı Olarak Sil!'
                        onConfirm={async () => await hardDeleteTableRow(props?.id)} 
                        onClose={() => toast.warning("Silme işlemi iptal edildi!")} 
                    />
                </div>
            )
        }
        <style>
        {`
            .hoverColor:hover i { color: white !important; }
            .btn-hover:hover { color: white !important; }
            .btn-hover:hover i { color: white !important; }
        `}
        </style>
        </div>
    );
};