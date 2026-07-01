import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { ICtaConfig } from 'common/data/tenant';
import { useGetLandingCta } from 'hooks/useFeatures';

const Cta = () => {
    const { data: ctaData, isLoading, isError } = useGetLandingCta();

    if (isLoading) {
        return (
            <section className="py-5 bg-primary position-relative bg-opacity-50">
                <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
                <Container>
                    <div className="text-center text-white-50">Yükleniyor...</div>
                </Container>
            </section>
        );
    }

    const config: ICtaConfig = ctaData || {
        text: "Build your web App/SaaS with Workgrid dashboard",
        buttonText: "Buy Now",
        buttonUrl: "//1.envato.market/workgrid-admin"
    };

    const isExternal = config.buttonUrl?.startsWith('http') || config.buttonUrl?.startsWith('//');

    return (
        <React.Fragment>
            <section className="py-5 bg-primary position-relative bg-opacity-50">
                {/* Velzon'un şık dokulu arka plan deseni aynen korundu */}
                <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
                <Container>
                    <Row className="align-items-center gy-4">
                        
                        {/* Sol Taraf: Dinamik Metin Alanı */}
                        <Col className="col-sm">
                            <div>
                                <h4 className="text-white mb-0 fw-semibold">
                                    {config.text}
                                </h4>
                            </div>
                        </Col>
                        
                        {/* Sağ Taraf: Dinamik Buton Alanı */}
                        <Col className="col-sm-auto">
                            <div>
                                {isExternal ? (
                                    // Eğer dış bağlantı ise normal a etiketi gibi davranan target_blank yapısı
                                    <a 
                                        href={config.buttonUrl} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="btn bg-gradient btn-danger"
                                    >
                                        <i className="ri-shopping-cart-2-line align-middle me-1"></i> 
                                        {config.buttonText}
                                    </a>
                                ) : (
                                    // Eğer site içi bir link ise (Örn: /register veya /pricing) react-router Link yapısı
                                    <Link 
                                        to={config.buttonUrl || "/"} 
                                        className="btn bg-gradient btn-danger"
                                    >
                                        <i className="ri-shopping-cart-2-line align-middle me-1"></i> 
                                        {config.buttonText}
                                    </Link>
                                )}
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Cta;