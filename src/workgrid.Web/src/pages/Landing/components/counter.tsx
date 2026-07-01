import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import CountUp from "react-countup";
import { useStatsContext } from 'context/StatsContext';
// 🌟 Yazdığın Stats Context'i sayfaya dahil ediyoruz

const Counter = () => {
    // 🌟 Context üzerinden dinamik istatistik verilerini ve yüklenme durumlarını çekiyoruz
    const { stats, isLoading, isError } = useStatsContext();

    // ── Durum Kontrolleri (Loading & Error) ─────────────────────────────────
    if (isLoading) {
        return (
            <div className="text-center my-4 py-4">
                <div className="spinner-border text-primary spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return null; // Ana sayfa akışını bozmamak için hata durumunda boş geçebiliriz veya sessizce loglayabiliriz
    }

    // Eğer veri henüz gelmediyse veya boşsa şablonun patlamaması için fallback (varsayılan) değerler
    const data = stats ?? {
        projectsCompleted: 100,
        awardsWon: 24,
        satisfiedClients: 20300, // Binlik (k) formatı için ham sayı olarak tutulması daha sağlıklıdır (Örn: 20300)
        employees: 50
    };

    // Satisfied clients için 1000'den büyükse 'k' formatına çevirme mantığı
    const isClientKFormat = data.satisfiedClients >= 1000;
    const clientDisplayValue = isClientKFormat ? data.satisfiedClients / 1000 : data.satisfiedClients;

    return (
        <React.Fragment>
            <section className="py-5 position-relative bg-light">
                <Container>
                    <Row className="text-center gy-4">
                        
                        {/* 🌟 Projects Completed */}
                        <Col lg={3} className="col-6">
                            <div>
                                <h2 className="mb-2">
                                    <span className="counter-value" data-target={data.projectsCompleted}>
                                        <CountUp
                                            start={0}
                                            end={data.projectsCompleted}
                                            duration={3}
                                        />
                                    </span>
                                    +
                                </h2>
                                <div className="text-muted">Projects Completed</div>
                            </div>
                        </Col>

                        {/* 🌟 Win Awards */}
                        <Col lg={3} className="col-6">
                            <div>
                                <h2 className="mb-2">
                                    <span className="counter-value" data-target={data.awardsWon}>
                                        <CountUp
                                            start={0}
                                            end={data.awardsWon}
                                            duration={3}
                                        />
                                    </span>
                                </h2>
                                <div className="text-muted">Win Awards</div>
                            </div>
                        </Col>

                        {/* 🌟 Satisfied Clients */}
                        <Col lg={3} className="col-6">
                            <div>
                                <h2 className="mb-2">
                                    <span className="counter-value" data-target={clientDisplayValue}>
                                        <CountUp
                                            start={0}
                                            end={clientDisplayValue}
                                            duration={3}
                                            // Eğer sayı binlik formattaysa ondalık hanesini (örn: 20.3) gösteriyoruz
                                            decimals={isClientKFormat && data.satisfiedClients % 1000 !== 0 ? 1 : 0}
                                            decimal="."
                                        />
                                    </span>
                                    {isClientKFormat ? 'k' : ''}
                                </h2>
                                <div className="text-muted">Satisfied Clients</div>
                            </div>
                        </Col>

                        {/* 🌟 Employees */}
                        <Col lg={3} className="col-6">
                            <div>
                                <h2 className="mb-2">
                                    <span className="counter-value" data-target={data.employees}>
                                        <CountUp
                                            start={0}
                                            end={data.employees}
                                            duration={3}
                                        />
                                    </span>
                                </h2>
                                <div className="text-muted">Employees</div>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Counter;