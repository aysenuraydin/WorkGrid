import React, { useState, useEffect } from "react";
import { Collapse, Container, NavbarToggler, NavLink } from "reactstrap";
import Scrollspy from "react-scrollspy";
import { Link } from "react-router-dom";
import { useTenantContext } from "context/TenantContext";
import config from "config"; 
import { AuthUser, useAuth } from "context/AuthContext";
import useThemeMode from "hooks/useThemeMode";
import { displayName } from 'common/utils/displayName';
import { getUserInitials } from 'common/utils/getUserInitials';   
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useGetTenantConfig } from "hooks/useTenant";
import { useGetBrand } from "hooks/useBrand";
import { useUserProfile } from "hooks/useUser";
const Navbar = () => { 
    const [isOpenMenu, setisOpenMenu] = useState(false);
    const [navClass, setnavClass] = useState("");
    const [activeLink, setActiveLink] = useState<any>();
    const toggle = () => setisOpenMenu(!isOpenMenu);
    
    const { mode } = useThemeMode();
    const { user:usr, logout }: { user: AuthUser | null, logout: (isRedirect?:boolean) => void } = useAuth();
    const { data: tenantConfig, } = useGetTenantConfig(); 
    const { data:brand } = useGetBrand();
    const { data: user, isLoading } = useUserProfile(usr?.id ?? "");
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);

    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    // Logo: dark mode → light logo, light mode → dark logo
    const resolveLogo = (name?: string) =>
        name ? `${config.api.FILE_API_URL}/File/${name}` : "";
    const logoSrc   = resolveLogo(tenantConfig?.logoDarkUrl);
    const logoClass = "wg-logo-light";

    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
        return () => window.removeEventListener("scroll", scrollNavigation, true);
    }, []);

    const scrollNavigation = () => {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setnavClass("is-sticky");
        } else {
            setnavClass("");
        }
    }

    useEffect(() => {
        const activation = (event: any) => {
            const target: any = event.target;
            if (target) {
                target.classList.add('active');
                setActiveLink(target);
                if (activeLink && activeLink !== target) {
                    activeLink.classList.remove('active');
                }
            }
        };

        const links = document.querySelectorAll('.navbar a');
        links.forEach((link) => {
            link.addEventListener('click', activation);
        });

        return () => {
            links.forEach((link) => {
                link.removeEventListener('click', activation);
            });
        };
    }, [activeLink]);

    return (
        <React.Fragment>
            <nav className={"navbar navbar-expand-lg navbar-landing fixed-top " + navClass} id="navbar">
                <Container>
                    <Link className="navbar-brand" to="/index">
                        <img className={`card-logo ${logoClass}`} src={logoSrc} alt="logo" />
                    </Link>

                    <NavbarToggler className="navbar-toggler py-0 fs-20 text-body" onClick={toggle} type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <i className="mdi mdi-menu"></i>
                    </NavbarToggler>

                    <Collapse
                        isOpen={isOpenMenu}
                        className="navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <Scrollspy
                            offset={-18}
                            items={["hero", "services", "features", "plans", "reviews", "team", "contact"]}
                            currentClassName="active"
                            className="navbar-nav mx-auto mt-2 mt-lg-0"
                            id="navbar-example"
                        >
                            <li className="nav-item"><NavLink href="#hero">Home</NavLink></li>
                            <li className="nav-item"><NavLink href="#services">Services</NavLink></li>
                            <li className="nav-item"><NavLink href="#features">Features</NavLink></li>
                            <li className="nav-item"><NavLink href="#plans">Plans</NavLink></li>
                            <li className="nav-item"><NavLink href="#reviews">Reviews</NavLink></li>
                            <li className="nav-item"><NavLink href="#team">Team</NavLink></li>
                            <li className="nav-item"><NavLink href="#contact">Contact</NavLink></li>
                        </Scrollspy>

                        {/* Dinamik Profil / Auth Bölümü */}
                        <div className="d-flex align-items-center">
                            <> 
                                <style>{`
                                .ms-sm-3.header-item.topbar-user.dropdown{
                                    background-color: transparent !important;
                                }
                                `}</style>
                                { !user?.id && !isProfileDropdown && (
                                    <div className={`ms-sm-3 bg-none header-item topbar-user p-2`} style={{minWidth:"200px"}}>
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
                                                        <img className="rounded-circle header-profile-user border" 
                                                            src={`${config.api.FILE_API_URL}/File/${user.profilePictureUrl}`}
                                                            alt="Header Avatar" 
                                                        /> 
                                                    </div>
                                                )} 
                                                <span className="text-start ms-xl-2">
                                                    <span className="d-xl-inline-block ms-1 fw-medium user-name-text text-dark">
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
                                                        <span className="align-middle">Profile</span>
                                                    </Link>
                                                </DropdownItem>
                                                {tenantConfig?.showChat &&
                                                    <DropdownItem className='p-0'>
                                                        <Link to="/chat" className="dropdown-item">
                                                            <i className="ri-chat-3-line text-muted fs-16 align-middle me-1"></i> 
                                                            <span className="align-middle">Messages</span>
                                                        </Link>
                                                    </DropdownItem>
                                                }
                                                {tenantConfig?.showTask &&
                                                    <DropdownItem className='p-0'>
                                                        <Link to="/toDoList" className="dropdown-item">
                                                            <i className="ri-task-line text-muted fs-16 align-middle me-1"></i> 
                                                            <span className="align-middle">Taskboard</span>
                                                        </Link>
                                                    </DropdownItem>
                                                }
                                                {tenantConfig?.showKanban &&
                                                    <DropdownItem className='p-0'>
                                                        <Link to="/kanbanboard" className="dropdown-item">
                                                            <i className="ri-task-line text-muted fs-16 align-middle me-1"></i> 
                                                            <span className="align-middle">Kanban</span>
                                                        </Link>
                                                    </DropdownItem>
                                                }
                                                {tenantConfig?.showTask &&
                                                    <DropdownItem className='p-0'>
                                                        <Link to="/calendar" className="dropdown-item">
                                                            <i className="ri-calendar-todo-line text-muted fs-16 align-middle me-1"></i> 
                                                            <span className="align-middle">Calendar</span>
                                                        </Link>
                                                    </DropdownItem>
                                                }
                                            </>
                                        )} 
                                        
                                        <DropdownItem className='p-0'>
                                            <Link to="/documents" className="dropdown-item">
                                                <i className="ri-file-text-line text-muted fs-16 align-middle me-1"></i> 
                                                <span className="align-middle">Documents</span>
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem className='p-0'>
                                            <Link to="/workgrid" className="dropdown-item">
                                                <i className="ri-grid-line text-muted fs-16 align-middle me-1"></i> 
                                                <span className="align-middle">Workgrid</span>
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem className='p-0'>
                                            <Link to="/faqs" className="dropdown-item">
                                                <i className="ri-question-line text-muted fs-16 align-middle me-1"></i> 
                                                <span className="align-middle">Help</span>
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
                                                            <span className="align-middle">Settings</span>
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
                                                        <span className="align-middle">Lock screen</span>
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem className='p-0' onClick={() => logout()}>
                                                    <div className="dropdown-item" style={{ cursor: "pointer" }}>
                                                        <i className="ri-logout-box-r-line text-muted fs-16 align-middle me-1"></i> 
                                                        <span className="align-middle" data-key="t-logout">Logout</span>
                                                    </div>
                                                </DropdownItem>
                                            </>
                                        ) : (
                                            <DropdownItem className='p-0'>
                                                <Link to="/login" className="dropdown-item">
                                                    <i className="ri-login-box-line text-muted fs-16 align-middle me-1"></i> 
                                                    <span className="align-middle" data-key="t-login">Signin</span>
                                                </Link> 
                                            </DropdownItem>
                                        )}
                                    </DropdownMenu>
                                </Dropdown>}
                            </>
                        </div>
                    </Collapse>
                </Container>
            </nav>
        </React.Fragment>
    );
};

export default Navbar;