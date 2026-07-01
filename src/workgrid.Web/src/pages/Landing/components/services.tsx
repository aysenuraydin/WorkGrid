import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import classnames from "classnames";
import { useServicesContext } from 'context/ServicesContext';
// 🌟 Yazdığın Services Context'i sayfaya dahil ediyoruz

const Services = () => {
    // 🌟 Context üzerinden dinamik servis verilerini ve yüklenme durumlarını çekiyoruz
    const { services, isLoading, isError } = useServicesContext();

    // ── Durum Kontrolleri (Loading & Error) ─────────────────────────────────
    if (isLoading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError || !services) {
        return (
            <div className="text-center my-5 py-5 text-danger">
                <i className="ri-error-warning-line fs-32"></i>
                <p className="mt-2">Services verileri yüklenirken bir hata oluştu!</p>
            </div>
        );
    }

    return (
        <React.Fragment>
            <section className="section" id="services">
                <Container>
                    {/* Üst Başlık Alanı (Dinamikleştirildi, Tasarım Birebir Aynı) */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h1 className="mb-3 ff-secondary fw-semibold lh-base">
                                    {services.mainTitle || "A Digital web design studio creating modern & engaging online"}
                                </h1>
                                <p className="text-muted">
                                    {services.mainDescription}
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* 🌟 Tamamen Dinamik Servis Öğeleri Listesi */}
                    <Row className="g-3">
                        {services.items?.map((item) => {
                            return (
                                <Col lg={4} key={item.id}>
                                    <div className="d-flex p-3">
                                        {/* Sol Taraf: İkon ve Efekt Çemberi */}
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar-sm icon-effect">
                                                <div className="avatar-title bg-transparent text-primary rounded-circle">
                                                    {/* DB'den gelen ri- ikon sınıfını dinamik basıyoruz, yoksa fallback ikon */}
                                                    <i className={classnames(item.icon || "ri-pencil-ruler-2-line", "fs-36")}></i>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Sağ Taraf: Metin İçerikleri */}
                                        <div className="flex-grow-1">
                                            <h5 className="fs-18">{item.title}</h5>
                                            <p className="text-muted my-3 ff-secondary">
                                                {item.description}
                                            </p>
                                            <div>
                                                <Link to="#" className="fs-13 fw-medium link-primary">
                                                    Learn More <i className="ri-arrow-right-s-line align-bottom"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Services;