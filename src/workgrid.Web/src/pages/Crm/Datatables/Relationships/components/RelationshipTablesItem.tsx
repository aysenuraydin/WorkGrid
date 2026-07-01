import { Alert, Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, Input, ListGroup, ListGroupItem, UncontrolledDropdown } from 'reactstrap';
import { TableColumn } from 'common/data/TableColumn';
import { DataType } from 'common/enums/DataType';
import { ModalType } from 'common/enums/ModalType';
import Loader from 'components/Common/Loader';
import { PopConfirm } from 'components/Common/PopConfirm'; 
import { useDeleteDataTable } from 'hooks/useDatatables';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDataTable } from 'context/DatatableContext';
import { RelationshipTable } from '../hooks/useRelationships';
import { useRelationshipTablesItem } from '../hooks/useRelationshipTablesItem';
import { TabItem } from '../../hooks/useTabState';
import { isLockControl } from 'common/data/constans';

export const RelationshipTablesItem = ({ table }: { table: RelationshipTable }) => {
    const { modal, tabState, setTableList, isTablesLoading } = useDataTable();   
    const { cardRef, origin, isDragging, changeIsOpen } = useRelationshipTablesItem(setTableList, table);  
    const { mutate: deleteDataTableMutation } = useDeleteDataTable();  

    return (
        <Card
            innerRef={cardRef}
            style={{
                width: "300px",
                position: "absolute",
                top: origin.y,
                left: origin.x,
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                zIndex: table?.zIndex ?? 9999,
            }}
            className='shadow bg-white border border-1 border-primary relationship-card-shadow'
        >
            <CardHeader
                className="align-items-center d-flex p-3 bg-soft-primary bg-primary-subtle relative"
                onClick={!isDragging ? changeIsOpen : undefined}
                style={{ cursor: "pointer" }}
            >
                <h4 className="card-title mb-0 flex-grow-1">
                    <Link to="#" onClick={(e) => e.preventDefault()} className="fw-medium link-primary">
                        #{table?.id}
                    </Link>
                    {" "}{table?.name}{" "} 
                </h4>
                <div>
                    {!isLockControl(table?.name) 
                    ? <>
                        <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-soft-primary btn-sm btn-hover" onClick={(e) => e.stopPropagation()}>
                            <i className="text-primary ri-more-fill align-middle fs-4"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem onClick={() => modal.handleTableClick(table, DataType.View)}>
                                <i className="text-primary ri-eye-fill align-bottom me-2"></i> Tabloyu Görüntüle
                            </DropdownItem>
                            <DropdownItem onClick={() => modal.handleTableClick(table, DataType.Edit)}>
                                <i className="text-primary ri-pencil-fill align-bottom me-2"></i> Tabloyu Düzenle
                            </DropdownItem>
                            <div id={`table-popconfirm-${table?.id}`} className='px-3 py-2 cursor-pointer dropdown-item text-danger'>
                                <i className="ri-delete-bin-5-fill fs-14 text-danger me-2"></i> Tabloyu Sil
                            </div>
                            <PopConfirm 
                                targetId={`table-popconfirm-${table?.id}`}
                                type={ModalType.Alert}
                                message='Bu tabloyu silmek istediğinizden emin misiniz?'
                                confirmText='Sil!'
                                onConfirm={async () => { 
                                    await deleteDataTableMutation(table?.id, {
                                        onSuccess: () => toast.success("Tablo başarıyla silindi!"),
                                        onError: () => toast.error("Tablo silinemedi!")
                                    }); 
                                }} 
                                onClose={() => toast.error("Silme işlemi iptal edildi!")} 
                            />
                            <DropdownItem onClick={() => modal.handleEditColumnsClick(table)}>
                                <i className="text-primary ri-edit-fill align-bottom me-2"></i> Sütunları Düzenle
                            </DropdownItem>
                            <DropdownItem onClick={() => modal.handleRelationClick(table)}>
                                <i className="text-primary ri-edit-fill align-bottom me-2"></i> İlişkileri Düzenle
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                tabState.setTabs((prev: TabItem[]) => {
                                    if (prev.some(tab => tab.id === table?.id)) return prev;
                                    return [...prev, { name: table?.name ?? "", id: table?.id }];
                                });
                                tabState.toggleTab({ name: table?.name ?? "", id: table?.id });
                                modal.handleRowsClick(table)
                            }}>
                                <i className="text-primary ri-edit-fill align-bottom me-2"></i> Satırları Düzenle
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </>
                    : <>
                        {isLockControl(table?.name) && <i className={`ri-lock-fill text-primary fs-16 ms-2`}></i>}
                    </>}
                </div>
                <div className="ms-2">
                    {table?.isOpen
                        ? <i className='fs-3 text-primary ri-arrow-down-s-line'></i>
                        : <i className='fs-3 text-primary ri-arrow-up-s-line'></i>
                    }
                </div>
            </CardHeader>
            {table?.isOpen && (
                <CardBody>
                    <div className="live-preview">
                        <ListGroup>
                            <ListGroupItem style={{ height: "50px" }} tag="label" className='relative'>
                                <span className='text-primary'>Id</span> - <i className='text-muted'>Number</i>
                            </ListGroupItem>
                            {table?.columnsFk && table?.columnsFk?.length ? (
                                table?.columnsFk.map((col: TableColumn, index: number) => (
                                    <ListGroupItem style={{ height: "50px" }} tag="label" className='relative' key={`${col.id}-${index}`}>
                                        {col.name} - <i className='text-muted'>{col.type}</i>
                                        {" "}
                                        {col.realTableId && <span className='text-primary'>#{col.realTableId}</span>}
                                    </ListGroupItem>
                                ))
                            ) : (
                                <Alert color='primary'>Kolon bulunamadı</Alert>
                            )}
                            {isTablesLoading && <div className="pt-4"><Loader isText={true} /></div>}
                        </ListGroup>
                    </div>
                </CardBody>
            )}
            <style>{`
                .btn-hover:hover i { color: white !important; } 
                .relationship-card-shadow { box-shadow: 4px 5px 15px 0px rgba(0, 0, 0, 0.20) !important; }
            `}</style>
        </Card>
    );
};