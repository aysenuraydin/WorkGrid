import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Form } from 'reactstrap';

//import Components
import SearchOption from '../components/Common/SearchOption'; 
import MyCartDropdown from '../components/Common/MyCartDropdown';
import FullScreenDropdown from '../components/Common/FullScreenDropdown';
import NotificationDropdown from '../components/Common/NotificationDropdown';
import ProfileDropdown from '../components/Common/ProfileDropdown';
import LightDark from '../components/Common/LightDark';

import { changeSidebarVisibility } from '../slices/thunks';
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect'; 
import { useTenantContext } from 'context/TenantContext';
import config from 'config';
import useThemeMode from 'hooks/useThemeMode';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }: any) => {
    const { mode } = useThemeMode();
    const { config: tenantConfig } = useTenantContext();
    const dispatch: any = useDispatch();

    const isDark = mode !== "dark";

    // Mode'a göre logoları seç:
    // - dark mode  → açık (light) logo
    // - light mode → koyu (dark) logo
    const resolveLogo = (name?: string) =>
        name ? `${config.api.FILE_API_URL}/File/${name}` : "";

    const smLogo   = resolveLogo(tenantConfig.logoSmUrl);
    const bigLogo  = resolveLogo(isDark ? tenantConfig.logoLightUrl : tenantConfig.logoDarkUrl);
    const bigClass = isDark ? "wg-logo-light" : "wg-logo-dark";

    const selectDashboardData = createSelector(
        (state: any) => state.Layout,
        (sidebarVisibilitytype) => sidebarVisibilitytype.sidebarVisibilitytype
    );
    const sidebarVisibilitytype = useSelector(selectDashboardData);

    const [search, setSearch] = useState(false);
    const toogleSearch = () => {
        setSearch(!search);
    };

    const toogleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;
        const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;
        dispatch(changeSidebarVisibility("show"));

        if (windowSize > 767)
            humberIcon.classList.toggle('open');

        if (document.documentElement.getAttribute('data-layout') === "horizontal") {
            document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
        }

        if (sidebarVisibilitytype === "show" && (document.documentElement.getAttribute('data-layout') === "vertical" || document.documentElement.getAttribute('data-layout') === "semibox")) {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'sm') ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }

        if (document.documentElement.getAttribute('data-layout') === "twocolumn") {
            document.body.classList.contains('twocolumn-panel') ? document.body.classList.remove('twocolumn-panel') : document.body.classList.add('twocolumn-panel');
        }
    };

    return (
        <React.Fragment>
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">

                            <div
                                className="navbar-brand-box horizontal-logo bg-transparent"
                                style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}
                            >
                                <Link to="/dashboard" className="logo">
                                    <span className="logo-sm">
                                        <img className="wg-logo-sm" src={smLogo} alt="logo" />
                                    </span>
                                    <span className="logo-lg">
                                        <img className={bigClass} src={bigLogo} alt="logo" />
                                    </span>
                                </Link>
                            </div>

                            <button
                                onClick={toogleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>

                            <SearchOption />
                        </div>

                        <div className="d-flex align-items-center">

                            <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                    aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown>

                            {/* LanguageDropdown */}
                            {/* <LanguageDropdown /> */}

                            {/* FullScreenDropdown */}
                            <FullScreenDropdown />

                            {/* Dark/Light Mode set */}
                            <LightDark />

                            {tenantConfig.showECommerce && <>
                                <Link to={"/wishlist"}>
                                    <button type="button"
                                        className={`btn btn-icon btn-ghost-dark rounded-circle`}>
                                        <i className={`ri-heart-line fs-22`}></i>
                                    </button>
                                </Link>

                                {/* MyCartDropdwon */}
                                <MyCartDropdown />
                            </>
                            }

                            {/* NotificationDropdown */}
                            <NotificationDropdown />

                            {/* ProfileDropdown */}
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;