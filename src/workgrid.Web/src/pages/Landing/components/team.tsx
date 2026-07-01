import React from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from "classnames";
// 🌟 Yönetim panelinde kullandığın servis ve konfigürasyonları dahil ediyoruz
import { useGetRoleUsersAll } from "hooks/useRole";
import config from "config";
import { AuthUser } from "context/AuthContext";

const Team = () => {
    // 🌟 Aynı API servisinden tüm takım üyelerini çekiyoruz
    const { data: users, isLoading, isError } = useGetRoleUsersAll();

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

    if (isError || !users) {
        return null; // Landing page akışını kesmemek için hata durumunda gizlenebilir
    }

    return (
        <React.Fragment>
            <section className="section bg-light" id="team">
                <Container>
                    {/* Üst Başlık Alanı (Birebir Aynı Tutuldu) */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h3 className="mb-3 fw-semibold">Our <span className="text-primary">Team</span></h3>
                                <p className="text-muted mb-4 ff-secondary">
                                    To achieve this, it would be necessary to have uniform grammar,
                                    pronunciation and more common words. If several languages coalesce the grammar.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* 🌟 Tamamen Dinamik Takım Üyeleri Listesi */}
                    <Row>
                        {users.map((item: AuthUser, key: any) => {
                            // Baş harfleri oluşturma mantığı (Örn: Nancy Martino -> NM)
                            const firstLetter = (item.firstName ?? "").charAt(0);
                            const lastLetter = (item.firstName ?? "").split(" ")?.slice(-1).toString().charAt(0);
                            const initials = firstLetter + lastLetter;

                            return (
                                <Col lg={3} sm={6} key={item.id || key}>
                                    <Card>
                                        <CardBody className="text-center p-4">
                                            {/* Profil Resmi Alanı (Tasarım ve Pozisyonlar Aynen Korundu) */}
                                            <div className="avatar-xl mx-auto mb-4 position-relative">
                                                {item.profilePictureUrl != null ? (
                                                    <img 
                                                        src={`${config.api.FILE_API_URL}/File/${item.profilePictureUrl}`} 
                                                        alt={`${item.firstName} ${item.lastName}`} 
                                                        className="img-fluid rounded-circle " 
                                                        style={{ aspectRatio: "1/1", width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    // 🌟 Resim yoksa şablonun yuvarlak renkli avatar yapısı devreye giriyor
                                                    <div 
                                                        className="avatar-title text-uppercase border rounded-circle bg-light text-primary font-size-24 font-weight-semibold d-flex align-items-center justify-content-center border border-2" 
                                                        style={{ width: "100%", height: "100%" }}
                                                    >
                                                        {initials || "U"}
                                                    </div>
                                                )}
                                                
                                                {/* Sağ Alttaki Mail İkon Butonu (Birebir Aynı) */}
                                                <Link 
                                                    to="/chat" // Doğrudan chat'e veya profile yönlendirebilirsin
                                                    className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle avatar-xs"
                                                >
                                                    <div className="avatar-title bg-transparent">
                                                        <i className="ri-mail-fill align-bottom"></i>
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* İsim ve Unvan Bilgileri (Dinamik) */}
                                            <h5 className="mb-1 text-truncate">
                                                <Link to={`/profile/${item.id}`} className="text-body">
                                                    {item.firstName} {item.lastName}
                                                </Link>
                                            </h5>
                                            <p className="text-muted mb-0 ff-secondary text-truncate">
                                                {(item as any).jobTitle ?? "Software Developer"}
                                            </p>
                                        </CardBody>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>

                    {/* Alt Kısım: Tüm Üyeleri Gör Butonu (Birebir Aynı) */}
                    <Row>
                        <div className="col-lg-12">
                            <div className="text-center mt-2">
                                <Link to="/pages-team" className="btn btn-primary">
                                    View All Members <i className="ri-arrow-right-line ms-1 align-bottom"></i>
                                </Link>
                            </div>
                        </div>
                    </Row>

                </Container>
            </section>
        </React.Fragment>
    );
};

export default Team;