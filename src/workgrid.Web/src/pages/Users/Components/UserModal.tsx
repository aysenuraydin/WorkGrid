import { getUserInitials } from "common/utils/getUserInitials";
import Loader from "components/Common/Loader";
import config from "config";
import useThemeMode from "hooks/useThemeMode";
import { useUserProfile } from "hooks/useUser";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export const UserModal = ({ isOpen, onClose, userId }: {
    isOpen: boolean; onClose: () => void; userId: string;
}) => {
    const { data: user, isLoading } = useUserProfile(userId);
    const { isDark } = useThemeMode();  
    return (
        <Modal id="showModal" isOpen={isOpen} toggle={()=>onClose()} size="md" centered >
            <ModalHeader className={`bg-${isDark?"dark":"light"} p-3`} toggle={onClose}>Kullanıcı Görüntüleme</ModalHeader>
            <ModalBody>
                {isLoading && <div className="pt-4 mt-4">
                    <Loader isText />
                </div> }
                {user && (
                    <div className="d-flex align-items-center pt-2">
                        <div className="flex-shrink-0">
                            {user.profilePictureUrl ? (
                                <img src={`${config.api.FILE_API_URL}/File/${user?.profilePictureUrl}`} alt="" className="rounded"
                                    style={{ width: 100, height: 100, objectFit: "cover" }} />
                            ) : (
                                <div className="avatar-title border bg-light text-primary rounded text-uppercase fs-24 p-2"
                                    style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {getUserInitials(user.firstName, user.lastName)}
                                </div>
                            )}
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h5 className="fs-16 mb-1">{user.firstName} {user.lastName}</h5>
                            <p className="text-muted mb-2">@{user.username}</p>
                            <div className="d-flex flex-wrap gap-2">
                                {user.roles?.length > 0
                                    ? user.roles.map((r: string, i: number) => (
                                        <span key={i} className="badge bg-primary-subtle text-primary text-uppercase">
                                            <i className="mdi mdi-shield-account me-1" />{r}
                                        </span>
                                    ))
                                    : <span className="badge text-bg-warning">Rol Yok</span>
                                }
                            </div>
                            <div className="mt-2 text-muted text-truncate" style={{ maxWidth: 200 }}>
                                <i className="ri-mail-fill text-primary me-1" />{user.email}
                            </div>
                        </div>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-light" onClick={onClose}>
                    <i className="ri-close-line fs-16 me-2" />Kapat
                </button>
            </ModalFooter>
        </Modal>
    );
}; 