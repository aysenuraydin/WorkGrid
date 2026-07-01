import React, { useState } from 'react';
import { 
    useGetRoles, 
    useCreateRole, 
    useUpdateRole, 
    useDeleteRole 
} from '../../hooks/useRole';
import Loader from 'components/Common/Loader';
import { Button, Card, CardBody, Col, Container, Form, Input, Row } from 'reactstrap';
import BreadCrumb from 'components/Common/BreadCrumb';
import { PopConfirm } from 'components/Common/PopConfirm';
import { ModalType } from 'common/enums/ModalType';
import { toast, ToastContainer } from 'react-toastify';
import { toSafeId } from 'common/utils/stringUtils'; 
import { useGetBrand } from 'hooks/useBrand';

export const RoleManagementPage: React.FC = () => {
    const { data: roles, isLoading, isError } = useGetRoles();
    const { data: brand } = useGetBrand();
    const createRoleMutation = useCreateRole();
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();

    const [newRoleName, setNewRoleName] = useState('');
    const [editingRole, setEditingRole] = useState<{ id: string; name: string } | null>(null);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        createRoleMutation.mutate({ name: newRoleName }, {
            onSuccess: () => {
                setNewRoleName('');
                toast.success("Rol başarıyla oluşturuldu!");
            }
        });
    };

    const handleUpdate = (id: string) => {
        if (!editingRole || !editingRole.name.trim()) return;
        updateRoleMutation.mutate({ id, name: editingRole.name }, {
            onSuccess: () => {
                setEditingRole(null);
                toast.success("Rol başarıyla güncellendi!");
            }
        });
    };

    const handleDelete = (id: string) => {
        deleteRoleMutation.mutate(id, {
            onSuccess: () => toast.success("Rol başarıyla silindi!"),
        });
    };

    const isProtectedRole = (name: string) => {
        const lower = name.toLowerCase();
        return lower === 'admin' || lower === 'user' || lower === 'wg'|| lower === 'enduser';
    };

    if (isLoading) return <div className="pt-4 mt-4"><Loader isText /></div>;
    if (isError) return <div className="p-4 text-danger">Rol listesi yüklenirken bir hata oluştu!</div>;

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Rol Yönetimi" pageTitle={brand?.companyName || "Workgrid"} />

                <div className="mb-4"> 
                    <Form onSubmit={handleCreate} className="row g-3 align-items-center d-flex justify-content-end">
                        <div className="col-auto">
                            <Input
                                type="text"
                                className="form-control px-3 py-2"
                                style={{ borderRadius: '8px', minWidth: '250px' }}
                                placeholder="Rol adı (Örn: Yönetici)"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                            />
                        </div>
                        <div className="col-auto">
                            <Button 
                                type="submit"
                                color="primary" 
                                disabled={createRoleMutation.isPending}
                            >
                                <i className='ri-user-add-line me-2'></i>
                                {createRoleMutation.isPending ? <Loader isText /> : 'Ekle'}
                            </Button>
                        </div>
                    </Form>
                </div>

                <Row className="gy-2 mb-2">
                    {(roles || [])?.map((role: any) => {
                        const isProtected = isProtectedRole(role.name);
                        const safeName = toSafeId([role?.id, role?.name], "r");
                        return(
                            <Col className="col-lg-12" key={role.id}>
                                <Card className="mb-0 border border-2">
                                    <CardBody>
                                        <div className="d-lg-flex align-items-center justify-content-between">
                                            <div className="flex-shrink-0 d-flex"> 
                                                <i className="ri-shield-user-line fs-4 me-2 opacity-50"></i>
                                                {editingRole?.id === role.id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        style={{ borderRadius: '6px', maxWidth: '300px' }}
                                                        value={editingRole?.name}
                                                        onChange={(e) => setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className={`fs-15 ${isProtected ? 'text-primary' : 'text-dark'}`}>
                                                            {role.name}
                                                        </span>
                                                        {isProtected && ( 
                                                            <span className="badge bg-dark-subtle text-body ms-2">Sistem</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div> 
                                            <div className="col-12 col-md-4 text-md-end">
                                                {isProtected ? (
                                                    <div className="text-muted small fst-italic pe-md-3">
                                                        <i className="ri-lock-2-fill text-primary me-1"></i> Korumalı Rol
                                                    </div>
                                                ) : (
                                                    <div className="btn-group btn-group-sm" style={{ overflow: 'hidden' }}>
                                                        {editingRole?.id === role.id ? (
                                                            <>
                                                                <button className="btn btn-outline-success px-3" onClick={() => handleUpdate(role.id)}>Kaydet</button>
                                                                <button className="btn btn-outline-danger px-3" onClick={() => setEditingRole(null)}>İptal</button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="btn btn-outline-warning px-3" onClick={() => setEditingRole({ id: role.id, name: role.name })}>Düzenle</button>
                                                                <button id={safeName} className="btn btn-outline-danger px-3">Sil</button>  
                                                                <PopConfirm 
                                                                    targetId={safeName} 
                                                                    type={ModalType.Alert}
                                                                    message='Bu kaydı silmek istediğinizden emin misiniz?'
                                                                    confirmText='Sil!'
                                                                    onConfirm={async () => {
                                                                        await handleDelete(role.id)
                                                                    }} 
                                                                    onClose={() => toast.warning("Silme işlemi iptal edildi!")} 
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        );
                    })}
                </Row> 
                <ToastContainer closeButton={true} limit={3} />
            </Container>
        </div>
    );
};