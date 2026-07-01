import React from 'react';
import { Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';
import BreadCrumb from 'components/Common/BreadCrumb';
import { useGetAbout } from 'hooks/useAbout';  
import { useGetBrand } from 'hooks/useBrand';
import config from 'config';
import useThemeMode from 'hooks/useThemeMode';

const About = () => {
    const { isDark } = useThemeMode();
    const { data: about, isLoading, isError } = useGetAbout();
    const { data: brand } = useGetBrand();

    document.title = "Hakkımızda | " + (brand?.companyName || "Workgrid");

    const dummy =
        "https://dummyimage.com/1200x500/" +
        (isDark ? "031426" : "F3F6F9") + "/" +
        (isDark ? "fff" : "969696") + "&text=" + (brand?.companyName || "Workgrid");

    const imgUrl = (name?: string | null) =>
        !name
            ? dummy
            : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Hakkımızda" pageTitle={brand?.companyName || "Workgrid"} />

                    {isLoading ? (
                        <div className="text-center py-5"><Spinner color="primary" /></div>
                    ) : isError ? (
                        <div className="text-center py-5 text-danger">
                            <i className="ri-error-warning-line fs-32 d-block mb-2"></i>
                            İçerik yüklenirken bir hata oluştu!
                        </div>
                    ) : (
                        <Row className="justify-content-center">
                            <Col xl={9} lg={11}>
                                <Card className="overflow-hidden">
                                    {/* ── Görsel (üstte, tam genişlik) ── */}
                                    <img
                                        src={imgUrl(about?.url)}
                                        alt={brand?.companyName || "Hakkımızda"}
                                        className="img-fluid w-100"
                                        style={{ objectFit: "cover", maxHeight: 420 }}
                                        onError={(e) => { (e.target as HTMLImageElement).src = dummy; }}
                                    />

                                    {/* ── Metin (altta) ── */}
                                    <CardBody className="p-4 p-lg-5">
                                        <div className="mb-4">
                                            <h3 className="fw-semibold mb-2">
                                                {brand?.companyName || "Workgrid"}
                                            </h3>
                                            <span className="d-block bg-soft-primary rounded" style={{ width: 48, height: 3 }} />
                                        </div>

                                        <div
                                            className="text-muted fs-15"
                                            style={{ lineHeight: 1.9 }}
                                            dangerouslySetInnerHTML={{ __html: about?.description ?? "" }}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default About;