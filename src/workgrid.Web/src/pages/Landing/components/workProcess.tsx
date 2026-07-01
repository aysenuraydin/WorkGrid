import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import classnames from "classnames";
// 🌟 Yazdığın Works Context'i sayfaya dahil ediyoruz

// Import Images (Velzon Orijinal Yön Oku Görseli)
import processArrow from "../../../assets/images/landing/process-arrow-img.png";
import { useWorksContext } from 'context/WorksContext';

const WorkProcess = () => {
    // 🌟 Context üzerinden dinamik iş akışı verilerini ve yüklenme durumlarını çekiyoruz
    const { works, isLoading, isError } = useWorksContext();

    // ── Durum Kontrolleri (Loading & Error) ─────────────────────────────────
    if (isLoading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading Work Process...</span>
                </div>
            </div>
        );
    }

    if (isError || !works || works.length === 0) {
        return null; // Landing page akışını bozmamak için hata durumunda boş geçiyoruz
    }

    return (
        <React.Fragment>
            <section className="section">
                <Container>
                    {/* Üst Başlık Alanı */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h3 className="mb-3 fw-semibold">Our Work Process</h3>
                                <p className="text-muted mb-4 ff-secondary">
                                    In an ideal world this website wouldn’t exist, a client would
                                    acknowledge the importance of having web copy before the Proin vitae ipsum vel ex
                                    finibus semper design starts.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* 🌟 Tamamen Dinamik İş Akışı Adımları (Döngü) */}
                    <Row className="text-center justify-content-center">
                        {works.map((item, index) => {
                            // Dinamik olarak kart genişliğini adım sayısına göre ayarlayabiliriz 
                            // (Genelde 3 adım için lg={4} idealdir, daha fazla adım gelirse esnek kalır)
                            const columnWidth = works.length <= 3 ? 4 : Math.max(3, Math.floor(12 / works.length));

                            return (
                                <Col lg={columnWidth} md={6} key={item.id || index} className="col-12">
                                    <div className="process-card mt-4">
                                        
                                        {/* 🌟 Akıllı Ok Kontrolü: Son adım hariç, aralardaki adımlara yön okunu ekliyoruz */}
                                        {index !== works.length - 1 && (
                                            <div className="process-arrow-img d-none d-lg-block">
                                                <img src={processArrow} alt="next-step" className="img-fluid" />
                                            </div>
                                        )}

                                        {/* İkon Çemberi ve Efekti (Birebir Aynı) */}
                                        <div className="avatar-sm icon-effect mx-auto mb-4">
                                            <div className="avatar-title bg-transparent text-primary rounded-circle h1">
                                                {/* category alanından 'ri-quill-pen-line' gibi ikon sınıfı gelirse basar, yoksa fallback ikon */}
                                                <i className={classnames(item.category || "ri-book-mark-line")}></i>
                                            </div>
                                        </div>

                                        {/* Adım Başlığı */}
                                        <h5>{item.title}</h5>
                                        
                                        {/* Adım Açıklaması (clientName alanını açıklama metni olarak kullanabilirsin) */}
                                        <p className="text-muted ff-secondary">
                                            {item.clientName || "We quickly learn to fear and thus automatically avoid potentially."}
                                        </p>
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

export default WorkProcess;