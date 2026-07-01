import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { AuthUser } from "context/AuthContext"; 
import { useSetUserBlocked } from "hooks/useAuthentication";
import { useGetBrand } from "hooks/useBrand";
import { useGetRoleUsersAll } from "hooks/useRole";
import { useDeleteUser } from "hooks/useUser";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Col, Container, Row, Input, Button, Alert } from "reactstrap"; 
import { UserModal } from "./Components/UserModal";
import { ChangeRoleModal } from "./Components/ChangeRoleModal";
import { UserCard } from "./Components/UserCard";
import { useUserSearch } from "./Components/useUserSearch";

export const UserManagementPage = () => {
    const { data: brand } = useGetBrand();
    document.title = "Kullanıcılar | " + (brand?.companyName || "Workgrid");

    const { data: users, isLoading, isError } = useGetRoleUsersAll();
    const { mutate: deleteUserMutation } = useDeleteUser();
    const { mutate: setUserBlocked } = useSetUserBlocked();

    const handleToggleBlock = (user: any) => {
        const willBlock = !user.isBlocked;
        setUserBlocked(
            { id: user.id, blocked: willBlock },
            {
                onSuccess: () =>
                    toast.success(willBlock ? "Kullanıcı engellendi!" : "Kullanıcının engeli kaldırıldı!"),
                onError: () => toast.error("İşlem başarısız!"),
            }
        );
    };

    const {
        searchTerm, setSearchTerm,
        roleFilter, setRoleFilter,
        applyFilter,
        filteredUsers,
        allRoles,
    } = useUserSearch(users);

    const [selectedUser, setSelectedUser] = useState<AuthUser>();
    const [isUserModal, setUserModal] = useState(false);
    const [isChangeRoleModal, setChangeRoleModal] = useState(false);

    const handleDelete = async (userId: string) => {
        await deleteUserMutation(userId, {
            onSuccess: () => toast.success("Kullanıcı başarıyla silindi!"),
            onError: () => toast.error("Kullanıcı silinemedi!"),
        });
    };

    if (isLoading) return <div className="pt-4 mt-4"><Loader isText /></div>;
    if (isError) return <Alert color="danger">Kullanıcı listesi yüklenirken bir hata oluştu!</Alert>;

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Kullanıcı Yönetimi" pageTitle={brand?.companyName || "Workgrid"} />

                <Row className="g-4 mb-4 align-items-end">
                    <Col className="col-sm">
                        <div className="d-md-flex justify-content-sm-end gap-2"> 
                            <div style={{ minWidth: 160 }}>
                                <Input
                                    type="select"
                                    value={roleFilter}
                                    onChange={e => setRoleFilter(e.target.value)}
                                >
                                    <option value="">Tüm Roller</option>
                                    {allRoles
                                    ?.filter((x: string) => x !== "WG" )
                                    ?.map((r: any) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </Input>
                            </div>
                            <div className="search-box ms-md-2 flex-shrink-0 mb-3 mb-md-0">
                                <Input
                                    type="text"
                                    placeholder="İsim veya kullanıcı adı ara..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && applyFilter()}
                                />
                                <i className="ri-search-line search-icon" />
                            </div>

                            <Button color="primary" onClick={applyFilter}>
                                <i className="ri-filter-3-line me-1" />
                                Filtrele
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row className="g-3 mb-2">
                    {filteredUsers
                    ?.filter((x: any) => x.roles[0] !== "WG" )
                    ?.map((u: any, i: number) => (
                        <Col key={u.id ?? i} className="col-xl-4 col-md-6">
                            <UserCard
                                user={u}
                                onView={u => { setSelectedUser(u); setUserModal(true); }}
                                onEdit={u => { setSelectedUser(u); setChangeRoleModal(true); }}
                                onDelete={handleDelete}
                                onToggleBlock={handleToggleBlock}
                            />
                        </Col>
                    ))}

                    {filteredUsers.length === 0 && (
                        <Col>
                            <Alert color="info">Eşleşen kullanıcı bulunamadı.</Alert>
                        </Col>
                    )}
                </Row>

                <ToastContainer closeButton={true} limit={3} style={{ marginTop: "100px" }} />
            </Container>

            <UserModal
                isOpen={isUserModal}
                onClose={() => setUserModal(false)}
                userId={selectedUser?.id ?? ""}
            />
            <ChangeRoleModal
                isOpen={isChangeRoleModal}
                onClose={() => setChangeRoleModal(false)}
                user={selectedUser}
            />
        </div>
    );
};