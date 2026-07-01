import { getUserInitials } from "common/utils/getUserInitials";
import config from "config";
import useThemeMode from "hooks/useThemeMode";
import { Link } from "react-router-dom";
import { Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

interface UserCardProps {
    user: any;
    onView:   (u: any) => void;
    onEdit:   (u: any) => void;
    onDelete: (id: string) => void;
    onToggleBlock: (u: any) => void;
}
export const UserCard = ({ user, onView, onEdit, onDelete, onToggleBlock }: UserCardProps) => {
    const { isDark } = useThemeMode(); 
    return(
        <Card className="card border border-2 p-1 h-100 my-auto position-relative">
        <CardBody>
            <div className="d-flex align-items-center pt-2">
                <Link to={`/profile/${user.id}`} className="flex-shrink-0">
                    {user.profilePictureUrl ? (
                        <img src={`${config.api.FILE_API_URL}/File/${user?.profilePictureUrl}`} alt="" className="rounded"
                            style={{ width: 100, height: 100, objectFit: "cover" }} />
                    ) : (
                        <div className="avatar-title border bg-light text-primary rounded text-uppercase fs-24 p-2"
                            style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {getUserInitials(user.firstName, user.lastName)}
                        </div>
                    )}
                </Link>

                <div className="flex-grow-1 ms-3">
                    <Link to={`/profile/${user.id}`}>
                        <h5 className="fs-16 mb-1">
                            {user.firstName} {user.lastName}
                            {user.isBlocked && (
                                <span className="badge bg-danger-subtle text-danger ms-2 align-middle">Bloklu</span>
                            )}
                        </h5>
                        <p className="text-muted mb-2">@{user.username}</p>
                    </Link>

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

                    <div className="d-flex gap-4 mt-2 text-muted">
                        <div className="text-truncate" style={{ maxWidth: 150 }}>
                            <i className="ri-mail-fill me-1" style={{ color: "lightgray" }} />
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>
        </CardBody>

        <UncontrolledDropdown className="position-absolute end-0">
            <DropdownToggle href="#" className={`btn btn-${isDark?'dark':'light'} btn-sm me-2`} tag="button">
                <i className="ri-more-fill" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
                <DropdownItem onClick={() => onView(user)}>
                    <i className="ri-eye-fill align-bottom me-2 text-muted" /> Görüntüle
                </DropdownItem>
                <DropdownItem onClick={() => onEdit(user)}>
                    <i className="ri-pencil-fill align-bottom me-2 text-muted" /> Rolü değiştir
                </DropdownItem>
                <DropdownItem onClick={() => onToggleBlock(user)}>
                    {user.isBlocked ? (
                        <><i className="ri-lock-unlock-line align-bottom me-2 text-success" /> Blok Aç</>
                    ) : (
                        <><i className="ri-lock-line align-bottom me-2 text-warning" /> Blokla</>
                    )}
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => onDelete(user.id)}>
                    <i className="ri-delete-bin-fill align-bottom me-2 text-muted" /> Sil
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    </Card>
    )
};
