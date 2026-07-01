import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";

//Import Components
import VerticalLayout from "./VerticalLayouts";
import TwoColumnLayout from "./TwoColumnLayout";
import { Container } from "reactstrap";
import HorizontalLayout from "./HorizontalLayout";
import { getContrastIconClass } from "common/utils/getContrastIconClass";
import { useTenantContext } from "context/TenantContext";
import config from "config";
import useThemeMode from "hooks/useThemeMode";

const Sidebar = ({ layoutType: layoutTypeProp }: any) => { 
  const { config: tenantConfig } = useTenantContext();
  const { isDark } = useThemeMode();
  const layoutType = tenantConfig?.layoutType || layoutTypeProp || "vertical";

  // Dark mode'da sidebar zemini sabit koyu (TenantDynamicCss'teki DARK.sidebarBg
  // ile aynı tonu referans alıyoruz); light'ta config'in rengi.
  const sidebarBgColor = isDark ? "#5c636b" : (tenantConfig?.sidebarBg || "#2a3042");
  const sidebarTextColorClass = getContrastIconClass(sidebarBgColor);

  const isDarkText = sidebarTextColorClass === "text-dark";
  const subTextColorClass = isDarkText ? "text-muted" : "text-white-50";

  // Logo seçimi mode'a göre: dark → light logo, light → dark logo
  const resolveLogo = (name?: string) =>
    name ? `${config.api.FILE_API_URL}/File/${name}` : "";
  const smLogo   = resolveLogo(tenantConfig.logoSmUrl);
  const bigLogo  = resolveLogo(isDark ? tenantConfig.logoLightUrl : tenantConfig.logoDarkUrl);
  const bigClass = isDark ? "wg-logo-light" : "wg-logo-dark";

  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
    } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  }; 
  return (
    <React.Fragment>
      <div className="app-menu navbar-menu border-end">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo">
            <span className="logo-sm">
              <img className="wg-logo-sm" src={smLogo} alt="logo" />
            </span>
            <span className="logo-lg">
              <img className={bigClass} src={bigLogo} alt="logo" />
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>
        {layoutType === "horizontal" ? (
          <div id="scrollbar" className={`${isDark ? "border-bottom border-2 border-dark" :""}`}>
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout layoutType={layoutType}/> 
              </ul>
            </Container>
          </div>
        ) : layoutType === 'twocolumn' ? (
          <React.Fragment>
            <TwoColumnLayout layoutType={layoutType} />
            <div className="sidebar-background"></div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  <VerticalLayout layoutType={layoutType} /> 
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </React.Fragment>
        )}
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;