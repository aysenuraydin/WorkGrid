import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

// Import Config & Hooks
import config from 'config';
import { useTenantContext } from 'context/TenantContext';
import { useSocialLinksContext } from 'context/SocialLinksContext';
import { useGetBrand } from 'hooks/useBrand';
import { useGetSocialLinks } from 'hooks/useSocialLinks';

const Footer = () => {
    const { data:brand} = useGetBrand();
    const { config: tenantConfig } = useTenantContext();
    const { data:links, isLoading } = useGetSocialLinks();

    return (
        <React.Fragment>
            <footer className="custom-footer bg-dark py-5 position-relative">
                <Container>
                    <Row>
                        {/* Logo ve Açıklama Sütunu */}
                        <Col lg={4} className="mt-4">
                            <div>
                                <div>
                                    <img 
                                        className="wg-logo-sm" 
                                        src={`${config.api.FILE_API_URL}/File/${tenantConfig.logoSmUrl}`} 
                                        alt="Logo"
                                    />
                                </div>
                                <div className="mt-4 fs-14">
                                    <p>{brand?.description || "Premium Multipurpose Admin & Dashboard Template"}</p>
                                </div>
                            </div>
                        </Col>

                        {/* Navigasyon Sütunları */}
                        <Col lg={7} className="ms-lg-auto">
                            <Row>
                                <Col sm={4} className="mt-4">
                                    <h5 className="text-white mb-0">{brand?.companyName}</h5>
                                    <div className="text-muted mt-3">
                                        <ul className="list-unstyled ff-secondary footer-list">
                                            <li><Link to="/about">About Us</Link></li>
                                            <li><Link to="/gallery">Gallery</Link></li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col sm={4} className="mt-4">
                                    <h5 className="text-white mb-0">Support</h5>
                                    <div className="text-muted mt-3">
                                        <ul className="list-unstyled ff-secondary footer-list">
                                            <li><Link to="/faqs">FAQ</Link></li>
                                            <li><Link to="/contacts">Contact</Link></li>
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Alt Kısım: Copyright ve Sosyal Linkler */}
                    <Row className="text-center text-sm-start align-items-center mt-5">
                        <Col sm={6}>
                            <div>
                                <p className="copy-rights mb-0">
                                    {new Date().getFullYear()} © {brand?.companyName || "Workgrid"}
                                </p>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-end mt-3 mt-sm-0">
                                <ul className="list-inline mb-0 footer-social-link">
                                    {!isLoading && links?.map((link) => (
                                        <li key={link.id} className="list-inline-item">
                                            <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="avatar-xs d-block"
                                            >
                                                <div className="avatar-title rounded-circle">
                                                    <i className={link.iconUrl}></i>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;