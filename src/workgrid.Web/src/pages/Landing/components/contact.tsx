import React from 'react';
import { Col, Container, Form, Row } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContactContext } from 'context/ContactContext';

// Formik için validasyon şeması (Formik & Yup standardımız)
const validationSchema = Yup.object({
    name: Yup.string().required('Please enter your name'),
    email: Yup.string().email('Please enter a valid email').required('Please enter your email'),
    subject: Yup.string().required('Please enter a subject'),
    comments: Yup.string().required('Please enter your message'),
});

const Contact = () => {
    // 🌟 Context üzerinden dinamik tenant iletişim bilgilerini çekiyoruz
    const { contact, isLoading, isError } = useContactContext();

    // Formik Form Yönetimi
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            comments: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log("Mesaj gönderiliyor:", values);
            // Burada backend'e mesaj gönderme hook'unu tetikleyebilirsin (Örn: useSendMessage)
            // İşlem başarılı olduktan sonra:
            resetForm();
        },
    });

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

    if (isError) {
        return (
            <div className="text-center my-5 py-5 text-danger">
                <i className="ri-error-warning-line fs-32"></i>
                <p className="mt-2">Contact verileri yüklenirken bir hata oluştu!</p>
            </div>
        );
    }

    return (
        <React.Fragment>
            <section className="section" id="contact">
                <Container>
                    {/* Üst Başlık Alanı (Birebir Aynı) */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h3 className="mb-3 fw-semibold">Get In Touch</h3>
                                <p className="text-muted mb-4 ff-secondary">
                                    We thrive when coming up with innovative ideas but also
                                    understand that a smart concept should be supported with faucibus sapien odio measurable
                                    results.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="gy-4">
                        {/* 🌟 Sol Taraf: Tamamen Context'ten Gelen Dinamik Adres Bilgileri */}
                        <Col lg={4}>
                            <div>
                                {contact?.address1 && (
                                    <div className="mt-4">
                                        <h5 className="fs-13 text-muted text-uppercase">Office Address 1:</h5>
                                        <div className="ff-secondary fw-semibold" style={{ whiteSpace: 'pre-line' }}>
                                            {contact.address1}
                                        </div>
                                    </div>
                                )}
                                {contact?.address2 && (
                                    <div className="mt-4">
                                        <h5 className="fs-13 text-muted text-uppercase">Office Address 2:</h5>
                                        <div className="ff-secondary fw-semibold" style={{ whiteSpace: 'pre-line' }}>
                                            {contact.address2}
                                        </div>
                                    </div>
                                )}
                                {contact?.workingHours && (
                                    <div className="mt-4">
                                        <h5 className="fs-13 text-muted text-uppercase">Working Hours:</h5>
                                        <div className="ff-secondary fw-semibold">{contact.workingHours}</div>
                                    </div>
                                )}
                                {/* Ekstra İletişim Bilgileri (İhtiyaca Göre Context'ten Ekledim) */}
                                {contact?.email && (
                                    <div className="mt-4">
                                        <h5 className="fs-13 text-muted text-uppercase">Email:</h5>
                                        <div className="ff-secondary fw-semibold">{contact.email}</div>
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Right Side: Formik & Yup Entegre Edilmiş Kusursuz Form Alanı */}
                        <Col lg={8}>
                            <div>
                                <Form onSubmit={formik.handleSubmit}>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="mb-4">
                                                <label htmlFor="name" className="form-label fs-13">Name</label>
                                                <input 
                                                    name="name" 
                                                    id="name" 
                                                    type="text"
                                                    className="form-control bg-light border-light" 
                                                    placeholder="Your name*"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.name}
                                                />
                                                {formik.touched.name && formik.errors.name ? (
                                                    <div className="text-danger fs-12 mt-1">{formik.errors.name}</div>
                                                ) : null}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-4">
                                                <label htmlFor="email" className="form-label fs-13">Email</label>
                                                <input 
                                                    name="email" 
                                                    id="email" 
                                                    type="email"
                                                    className="form-control bg-light border-light" 
                                                    placeholder="Your email*"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}
                                                />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className="text-danger fs-12 mt-1">{formik.errors.email}</div>
                                                ) : null}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={12}>
                                            <div className="mb-4">
                                                <label htmlFor="subject" className="form-label fs-13">Subject</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control bg-light border-light" 
                                                    id="subject"
                                                    name="subject" 
                                                    placeholder="Your Subject.." 
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.subject}
                                                />
                                                {formik.touched.subject && formik.errors.subject ? (
                                                    <div className="text-danger fs-12 mt-1">{formik.errors.subject}</div>
                                                ) : null}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={12}>
                                            <div className="mb-3">
                                                <label htmlFor="comments" className="form-label fs-13">Message</label>
                                                <textarea 
                                                    name="comments" 
                                                    id="comments" 
                                                    rows={3}
                                                    className="form-control bg-light border-light"
                                                    placeholder="Your message..."
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.comments}
                                                ></textarea>
                                                {formik.touched.comments && formik.errors.comments ? (
                                                    <div className="text-danger fs-12 mt-1">{formik.errors.comments}</div>
                                                ) : null}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={12} className="text-end">
                                            <input 
                                                type="submit" 
                                                id="submit" 
                                                name="send" 
                                                className="submitBnt btn btn-primary"
                                                value="Send Message" 
                                            />
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Contact;