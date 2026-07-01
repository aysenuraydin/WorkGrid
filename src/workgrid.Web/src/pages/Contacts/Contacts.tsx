import React from 'react';
import { Col, Container, Form, Row } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetContact } from 'hooks/useContact';
import { useGetBrand } from 'hooks/useBrand';
import { useGetSocialLinks } from 'hooks/useSocialLinks';

const validationSchema = Yup.object({
    name: Yup.string().required('Lütfen adınızı girin'),
    email: Yup.string().email('Geçerli bir e-posta girin').required('Lütfen e-postanızı girin'),
    subject: Yup.string().required('Lütfen bir konu girin'),
    comments: Yup.string().required('Lütfen mesajınızı girin'),
});

const ContactInfoItem = ({ icon, label, value }:any) => (
    <div className="d-flex align-items-start gap-3 mb-4">
        <div className="avatar-sm flex-shrink-0">
            <div className="avatar-title rounded-3 bg-primary bg-opacity-10 text-primary fs-18">
                <i className={icon}></i>
            </div>
        </div>
        <div>
            <p className="text-uppercase fw-semibold fs-11 text-primary letter-spacing mb-1">{label}</p>
            <p className="mb-0 ff-secondary" style={{ whiteSpace: 'pre-line' }}>{value}</p>
        </div>
    </div>
);

const FieldWrapper = ({ label, htmlFor, error, children }:any) => (
    <div className="mb-3">
        <label htmlFor={htmlFor} className="form-label text-uppercase fw-semibold fs-11 text-muted">
            {label}
        </label>
        {children}
        {error && <div className="text-danger fs-12 mt-1">{error}</div>}
    </div>
);

const Contact = () => {
    const { data, isLoading, isError } = useGetContact();
    const { data: brand } = useGetBrand();
    const { data: links, isLoading: isLinksLoading } = useGetSocialLinks();

    const formik = useFormik({
        initialValues: { name: '', email: '', subject: '', comments: '' },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log('Mesaj gönderiliyor:', values);
            resetForm();
        },
    });

    if (isLoading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5 text-danger">
                <i className="ri-error-warning-line fs-32"></i>
                <p className="mt-2">İletişim verileri yüklenemedi.</p>
            </div>
        );
    }

    return (
        <React.Fragment>
            <section className="section page-content" id="contact">
                <Container fuild>

                    {/* Başlık */}
                    <Row className="justify-content-center  pt-4">
                        <Col lg={7} className="text-center">
                            <p className="text-primary text-uppercase fw-bold fs-12 ls-wider mb-2">İletişim</p>
                            <h2 className="fw-bold mb-3">Bir projeniz mi var?<br />Konuşalım.</h2>
                            <p className="text-muted ff-secondary mb-5">
                                Fikir aşamasından canlıya geçişe kadar her adımda yanınızdayız.
                                Bize ulaşın, birlikte değerlendirelim.
                            </p>
                        </Col>
                    </Row>

                    <Row className="align-items-stretch">

                        <Col lg={4}>
                            <div className="bg-soft-primary rounded-4 p-4 h-100">
                                <p className="text-primary text-uppercase fw-bold fs-11 ls-wider mb-4">
                                    Bize ulaşın
                                </p>

                                {data?.address1 && (
                                    <ContactInfoItem
                                        icon="ri-map-pin-2-line"
                                        label="Ofis Adresi 1"
                                        value={data.address1}
                                    />
                                )}
                                {data?.address2 && (
                                    <ContactInfoItem
                                        icon="ri-building-line"
                                        label="Ofis Adresi 2"
                                        value={data.address2}
                                    />
                                )}
                                {data?.email && (
                                    <ContactInfoItem
                                        icon="ri-mail-line"
                                        label="E-posta"
                                        value={data.email}
                                    />
                                )}
                                {data?.phone && (
                                    <ContactInfoItem
                                        icon="ri-phone-line"
                                        label="Telefon"
                                        value={data.phone}
                                    />
                                )}

                                {!isLinksLoading && (links ?? []).length > 0 && (
                                    <div className="d-flex gap-2 mt-4 pt-4 border-top border-secondary">
                                        {links?.map((link) => (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="avatar-xs d-flex align-items-center justify-content-center rounded-3 text-muted link-primary border"
                                                title={link.platform}
                                            >
                                                <i className={link.iconUrl}></i>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>

                        <Col lg={8}>
                            <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm h-100">
                                <Form onSubmit={formik.handleSubmit} noValidate>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <FieldWrapper
                                                label="Ad Soyad"
                                                htmlFor="name"
                                                error={formik.touched.name && formik.errors.name}
                                            >
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    className={`form-control bg-light border-light ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                                    placeholder="Adınız ve soyadınız"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.name}
                                                />
                                            </FieldWrapper>
                                        </Col>

                                        <Col md={6}>
                                            <FieldWrapper
                                                label="E-posta"
                                                htmlFor="email"
                                                error={formik.touched.email && formik.errors.email}
                                            >
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    className={`form-control bg-light border-light ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                                    placeholder="ornek@sirket.com"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}
                                                />
                                            </FieldWrapper>
                                        </Col>

                                        <Col md={12}>
                                            <FieldWrapper
                                                label="Konu"
                                                htmlFor="subject"
                                                error={formik.touched.subject && formik.errors.subject}
                                            >
                                                <input
                                                    id="subject"
                                                    name="subject"
                                                    type="text"
                                                    className={`form-control bg-light border-light ${formik.touched.subject && formik.errors.subject ? 'is-invalid' : ''}`}
                                                    placeholder="Mesajınızın konusu"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.subject}
                                                />
                                            </FieldWrapper>
                                        </Col>

                                        <Col md={12}>
                                            <FieldWrapper
                                                label="Mesaj"
                                                htmlFor="comments"
                                                error={formik.touched.comments && formik.errors.comments}
                                            >
                                                <textarea
                                                    id="comments"
                                                    name="comments"
                                                    rows={5}
                                                    className={`form-control bg-light border-light ${formik.touched.comments && formik.errors.comments ? 'is-invalid' : ''}`}
                                                    placeholder="Projenizi veya isteğinizi kısaca anlatın..."
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.comments}
                                                />
                                            </FieldWrapper>
                                        </Col>

                                        <Col md={12} className="text-end">
                                            <button
                                                type="submit"
                                                className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2"
                                            >
                                                <i className="ri-send-plane-line"></i>
                                                Mesaj Gönder
                                            </button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>

                    <hr className="my-5" />
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <p className="text-muted fs-13 mb-0">
                                © {new Date().getFullYear()} {brand?.companyName || 'Workgrid'}. Tüm hakları saklıdır.
                            </p>
                        </Col>
                        <Col sm={6} className="text-sm-end mt-3 mt-sm-0">
                            <p className="text-muted fs-13 mb-0">Workgrid ❤</p>
                        </Col>
                    </Row>

                </Container>
            </section>
        </React.Fragment>
    );
};

export default Contact;