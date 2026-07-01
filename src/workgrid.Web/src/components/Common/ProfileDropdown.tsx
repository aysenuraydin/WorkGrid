import { displayName } from 'common/utils/displayName';
import { getUserInitials } from 'common/utils/getUserInitials';
import config from 'config';
import { AuthUser, useAuth } from 'context/AuthContext';
import { useGetBrand } from 'hooks/useBrand';
import { useGetTenantConfig } from 'hooks/useTenant';
import useThemeMode from 'hooks/useThemeMode';
import { useUserProfile } from 'hooks/useUser';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const ProfileDropdown = () => {
    const { user:usr, logout }: { user: AuthUser | null, logout: (isRedirect?:boolean) => void } = useAuth();
    const { data: tenantConfig, } = useGetTenantConfig(); 
    const { isDark } = useThemeMode(); 
    const { data:brand } = useGetBrand();
    const { data: user } = useUserProfile(usr?.id ?? "");
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);

    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    return (
        <React.Fragment> 
            <style>{`
            .ms-sm-3.header-item.topbar-user.dropdown{
                background-color: transparent !important;
            }
            `}</style>
            { !user?.id && !isProfileDropdown && (
                <div className={`ms-sm-3 bg-${isDark?'dark':'none'} header-item topbar-user p-2`} style={{minWidth:"200px"}}>
                    <Link to="/login" className="dropdown-item">
                        <i className="ri-login-box-line text-muted fs-16 align-middle me-1"></i> 
                        <span className="align-middle" data-key="t-login">Signin</span>
                    </Link> 
                </div> 
            )}
            { user && <Dropdown isOpen={isProfileDropdown} style={{minWidth:"200px"}}
                toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user"> 
                <DropdownToggle tag="button" type="button" className="btn">
                    { user?.id && ( 
                        <span className="d-flex align-items-center w-100">
                            {!user.profilePictureUrl ? (
                                <div className={`avatar-title border border-2 bg-light text-primary rounded-circle text-uppercase`} 
                                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {getUserInitials(user.firstName, user.lastName)}
                                </div>
                            ) : (
                                <div> 
                                    <img className="rounded-circle header-profile-user" 
                                        src={`${config.api.FILE_API_URL}/File/${user.profilePictureUrl}`}
                                        alt="Header Avatar" 
                                    /> 
                                </div>
                            )} 
                            <span className="text-start ms-xl-2">
                                <span className="d-xl-inline-block ms-1 fw-medium user-name-text">
                                    {displayName(user)} <br />
                                </span>
                                <span className="d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                                    {user.roles && user.roles.length > 0 ? user.roles.join(", ") : "User"}
                                </span>
                            </span>
                        </span>
                    )}
                </DropdownToggle> 
                <DropdownMenu className="dropdown-menu-end"> 
                    { user && (
                        <>
                            <h6 className="dropdown-header">Welcome {user.username}!</h6>
                            <DropdownItem className='p-0'>
                                <Link to="/landing" className="dropdown-item">
                                    <img  src={`${config.api.FILE_API_URL}/File/${tenantConfig?.faviconUrl}`} height={16} />
                                    <span className="align-middle ms-1">{brand?.companyName || "Workgrid"}</span>
                                </Link>
                            </DropdownItem>
                            <DropdownItem className='p-0'>
                                <Link to={`/profile/${user.id}`} className="dropdown-item">
                                    <i className="ri-user-line text-muted fs-16 align-middle me-1"></i>
                                    <span className="align-middle">Profilim</span>
                                </Link>
                            </DropdownItem>
                            {tenantConfig?.showECommerce &&
                                <DropdownItem className='p-0'>
                                    <Link to="/orders" className="dropdown-item">
                                        <i className="ri-shopping-bag-line text-muted fs-16 align-middle me-1"></i> 
                                        <span className="align-middle">Siparişlerim</span>
                                    </Link>
                                </DropdownItem>
                            }
                            {tenantConfig?.showChat &&
                                <DropdownItem className='p-0'>
                                    <Link to="/chat" className="dropdown-item">
                                        <i className="ri-chat-3-line text-muted fs-16 align-middle me-1"></i> 
                                        <span className="align-middle">Mesajlar</span>
                                    </Link>
                                </DropdownItem>
                            }
                            {tenantConfig?.showTask &&
                                <DropdownItem className='p-0'>
                                    <Link to="/toDoList" className="dropdown-item">
                                        <i className="ri-task-line text-muted fs-16 align-middle me-1"></i> 
                                        <span className="align-middle">Görevler</span>
                                    </Link>
                                </DropdownItem>
                            }
                            {tenantConfig?.showKanban &&
                                <DropdownItem className='p-0'>
                                    <Link to="/kanbanboard" className="dropdown-item">
                                        <i className="ri-task-line text-muted fs-16 align-middle me-1"></i> 
                                        <span className="align-middle">Kanban Board</span>
                                    </Link>
                                </DropdownItem>
                            }
                            {tenantConfig?.showTask &&
                                <DropdownItem className='p-0'>
                                    <Link to="/calendar" className="dropdown-item">
                                        <i className="ri-calendar-todo-line text-muted fs-16 align-middle me-1"></i> 
                                        <span className="align-middle">Takvim</span>
                                    </Link>
                                </DropdownItem>
                            }
                        </>
                    )} 
                    
                    <DropdownItem className='p-0'>
                        <Link to="/documents" className="dropdown-item">
                            <i className="ri-file-text-line text-muted fs-16 align-middle me-1"></i> 
                            <span className="align-middle">Doküman</span>
                        </Link>
                    </DropdownItem> 
                    <DropdownItem className='p-0'>
                        <Link to="/faqs" className="dropdown-item">
                            <i className="ri-question-line text-muted fs-16 align-middle me-1"></i> 
                            <span className="align-middle">Yardım</span>
                        </Link>
                    </DropdownItem>
                    
                    <div className="dropdown-divider"></div>
                    
                    { user ? (
                        <>
                            {user.roles[0]=="WG" &&
                                <DropdownItem className='p-0'>
                                    <Link to="/settings" className="dropdown-item">
                                        <span className="badge bg-success-subtle text-success mt-1 float-end">New</span>
                                        <i className="ri-settings-4-line text-muted fs-16 align-middle me-1"></i> 
                                        <span className="align-middle">Ayarlar</span>
                                    </Link>
                                </DropdownItem>
                            }
                                <DropdownItem className='p-0' onClick={() => {if (user) {
                                    localStorage.setItem("locked_user", JSON.stringify({
                                        id: user.id,
                                        email: user.email, 
                                        username: user.username,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        profilePictureUrl: user.profilePictureUrl
                                    }));
                                }
                                logout(false); 
                            }}>
                                <Link to="/auth-lockscreen-basic" className="dropdown-item">
                                    <i className="ri-lock-password-line text-muted fs-16 align-middle me-1"></i> 
                                    <span className="align-middle">EKranı Kilitle</span>
                                </Link>
                            </DropdownItem>
                            <DropdownItem className='p-0' onClick={() => logout(true)}>
                                <div className="dropdown-item" style={{ cursor: "pointer" }}>
                                    <i className="ri-logout-box-r-line text-muted fs-16 align-middle me-1"></i> 
                                    <span className="align-middle" data-key="t-logout">Çıkış yap</span>
                                </div>
                            </DropdownItem>
                        </>
                    ) : (
                        <DropdownItem className='p-0'>
                            <Link to="/login" className="dropdown-item">
                                <i className="ri-login-box-line text-muted fs-16 align-middle me-1"></i> 
                                <span className="align-middle" data-key="t-login">Giriş yap</span>
                            </Link> 
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>}
        </React.Fragment>
    );
};

export default ProfileDropdown;