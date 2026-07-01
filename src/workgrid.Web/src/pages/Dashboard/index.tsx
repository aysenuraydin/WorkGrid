import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { useAuth } from 'context/AuthContext';
import { useGetBrand } from 'hooks/useBrand';
import { useUserProfile } from 'hooks/useUser';
import { useTenantContext } from 'context/TenantContext';
import useThemeMode from 'hooks/useThemeMode';
import { getUserInitials } from 'common/utils/getUserInitials';
import config from 'config';

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return "İyi geceler";
    if (h < 12) return "Günaydın";
    if (h < 18) return "İyi günler";
    return "İyi akşamlar";
};

const QUICK_LINKS: {
    to: string;
    label: string;
    icon: string;
    color: string;
    feature: string | string[] | null;
    wgOnly?: boolean; 
}[] = [
    { to: "/menuitems",        label: "Menü",      icon: "ri-list-check-2",   color: "secondary", feature: null, wgOnly: true },
    { to: "/datatables",       label: "Tables",    icon: "ri-table-line",     color: "primary",   feature: ["showCrm", "showBLog", "showECommerce"] },
    { to: "/store",            label: "E-Ticaret", icon: "ri-shopping-bag-line", color: "success", feature: "showECommerce" },
    { to: "/blog-list",        label: "Blog",      icon: "ri-article-line",   color: "info",      feature: "showBLog" },
    { to: "/calendar",         label: "Takvim",    icon: "ri-calendar-2-line", color: "warning",  feature: "showCalendar" },
    { to: "/projects",         label: "Görevler",  icon: "ri-briefcase-line", color: "danger",    feature: "showTask" },
    { to: "/kanbanboard",      label: "Kanban",    icon: "ri-layout-grid-line", color: "primary", feature: "showKanban" },
    { to: "/chat",             label: "Sohbet",    icon: "ri-chat-3-line",    color: "info",      feature: "showChat" },
    { to: "/landing",          label: "Landing",   icon: "ri-pages-line",     color: "warning",   feature: "showLanding" },
    { to: "/profile-settings", label: "Ayarlar",   icon: "ri-settings-3-line", color: "secondary", feature: null },
]; 


export const Dashboard = () => { 
    const { data: brand } = useGetBrand();
    const { user: usr } = useAuth();
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? ""); 
    const { config: tenantConfig } = useTenantContext();

    document.title = "Panel | " + (brand?.companyName || "Workgrid");

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Kullanıcı";
    const roles: string[] = user?.roles ?? [];

    const isWG =  roles.includes("WG");

    const visibleLinks = QUICK_LINKS.filter((q) => {
        if (q.wgOnly) return isWG;
        
        if (q.feature === null) return true;
        
        const flags = Array.isArray(q.feature) ? q.feature : [q.feature];
        return flags.some(
            (f) => !!tenantConfig?.[f as keyof typeof tenantConfig]
        );
    });

    return (
        <div className="page-content">
            <Container fluid>
                <Card className="overflow-hidden">
                    <div className="bg-primary-subtle">
                        <CardBody className="p-4">
                            <Row className="align-items-center">
                                <Col>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-md flex-shrink-0">
                                            {!user?.profilePictureUrl ? (
                                                <div className={`avatar-title border border-2 bg-light text-primary rounded-circle text-uppercase`} 
                                                style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {getUserInitials(user?.firstName??"", user?.lastName??"")}
                                                </div>
                                            ) : (
                                                <div> 
                                                    <img 
                                                    style={{ width: '70px', height: '70px'}}
                                                    className="rounded-circle header-profile-user border" 
                                                        src={`${config.api.FILE_API_URL}/File/${user.profilePictureUrl}`}
                                                        alt={user?.firstName +" "+ user?.lastName}
                                                    /> 
                                                </div>
                                            )} 
                                        </div>
                                        <div>
                                            <p className="text-muted mb-1">{getGreeting()},</p>
                                            <h4 className="fw-semibold mb-1">
                                                {isUserLoading ? "Yükleniyor..." : fullName} 👋
                                            </h4>
                                            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-1">
                                                {roles.map((r) => (
                                                    <span key={r} className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs="auto" className="d-none d-md-block">
                                    <div className="text-end">
                                        <h5 className="mb-0 fw-semibold">{brand?.companyName || "Workgrid"}</h5>
                                        <p className="text-muted mb-0 fs-13">
                                            {new Date().toLocaleDateString("tr-TR", {
                                                weekday: "long", day: "numeric", month: "long", year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </div>
                </Card>

                {/* ── Hızlı erişim ── */}
                <h5 className="mb-3 fw-semibold">Hızlı Erişim</h5>
                <div>
                    <Row className="g-3">
                        {visibleLinks.map((q) => (
                            <Col key={q.to} xs={6} sm={4} md={3} lg={2} >
                                <Link to={q.to} className="text-decoration-none">
                                    <Card className="mb-0 h-100 dash-quick">
                                        <CardBody className="text-center p-4">
                                            <div className="avatar-sm mx-auto mb-3">
                                                <div className={`avatar-title bg-${q.color}-subtle text-${q.color} rounded fs-22`}>
                                                    <i className={q.icon} />
                                                </div>
                                            </div>
                                            <h6 className="mb-0 text-body">{q.label}</h6>
                                        </CardBody>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>

            <style>{`
                .dash-quick { transition: transform .2s ease, box-shadow .2s ease; cursor: pointer; }
                .dash-quick:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,.10);
                }
            `}</style>
        </div>
    );
};