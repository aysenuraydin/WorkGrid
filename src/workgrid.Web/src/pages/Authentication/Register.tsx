import React from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button, Spinner } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

// import images 
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useRegisterMutation } from "hooks/useAuthentication";
import { useTenantContext } from "context/TenantContext";
import config from "config"; 
import { useGetBrand } from "hooks/useBrand";
import useThemeMode from "hooks/useThemeMode";

export interface RegisterVariables {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;  
    confirmAggreement: boolean;  
    isExternalAuthentication: boolean; 
}

const Register = () => {
    const history = useNavigate();
    const registerMutation = useRegisterMutation();

    const validation: any = useFormik({
        enableReinitialize: true,

        initialValues: {
            firstName: '',   
            lastName: '',    
            email: '',
            userName: '',    
            password: '',
            confirmPassword: '',
            confirmAggreement: false 
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                    .required("Lütfen adınızı girin"),
            lastName: Yup.string()
                    .required("Lütfen soyadınızı girin"),
            email: Yup.string()
                    .email("Geçersiz e-posta formatı")
                    .required("Lütfen e-posta adresinizi girin"),
            userName: Yup.string()
                    .min(6, "Kullanıcı adı en az 6 karakter olmalıdır")
                    .matches(/[0-9]/, "Kullanıcı adı en az bir rakam içermelidir") 
                    .required("Lütfen bir kullanıcı adı girin"),
            password: Yup.string()
                    .min(8, "Şifre en az 8 karakter olmalıdır") 
                    .matches(/[a-z]/, "Şifre en az bir küçük harf içermelidir")  
                    .matches(/[A-Z]/, "Şifre en az bir büyük harf içermelidir") 
                    .matches(/[0-9]/, "Şifre en az bir rakam içermelidir")  
                    .matches(/[^a-zA-Z0-9]/, "Şifre en az bir özel karakter içermelidir (!, @, #, vb.)") 
                    .required("Lütfen şifrenizi girin"),
            confirmPassword: Yup.string()
                    .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
                    .required("Lütfen şifrenizi onaylayın"),
            confirmAggreement: Yup.boolean()
                    .oneOf([true], "Kayıt olmak için Kullanım Şartlarını kabul etmelisiniz") 
        }),
        onSubmit: (values) => {
            registerMutation.mutate({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
                userName: values.userName.trim(),
                password: values.password,
                confirmPassword: values.confirmPassword, 
                confirmAggreement: values.confirmAggreement,  
                isExternalAuthentication: false  
            }, {
                onSuccess: () => {
                    toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...", { position: "top-right" });
                    setTimeout(() => history("/login"), 3000);
                },
                onError: (err: any) => {
                    toast.error("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.", { position: "top-right" });
                }
            });
        }
    });
    const { config: tenantConfig} = useTenantContext(); 
    const { data:brand } = useGetBrand();
    const { isDark } = useThemeMode(); 
    document.title = "Kayıt Ol | " +(brand?.companyName || "Workgrid");
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/dashboard" className="d-inline-block auth-logo">
                                            <img  src={`${config.api.FILE_API_URL}/File/${tenantConfig.logoSmUrl}`} height={90} />
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className={`p-4 bg-${isDark?'soft-':''}light`}>
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Yeni Hesap Oluştur</h5>
                                            <p className="text-muted">Ücretsiz Workgrid hesabınızı hemen alın</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation">

                                                {registerMutation.isSuccess && (
                                                    <Alert color="success">
                                                        Kullanıcı kaydı başarılı. Giriş sayfasına yönlendiriliyorsunuz...
                                                    </Alert>
                                                )}

                                                {registerMutation.isError && (
                                                    <Alert color="danger">
                                                        Bu e-posta veya kullanıcı adı daha önce alınmış, lütfen tekrar deneyin.
                                                    </Alert>
                                                )}

                                                {/* First Name & Last Name satırı */}
                                                <Row>
                                                    <Col md={6} className="mb-3">
                                                        <Label className="form-label">Ad <span className="text-danger">*</span></Label>
                                                        <Input
                                                            name="firstName"
                                                            type="text"
                                                            placeholder="Adınız"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.firstName}
                                                            invalid={validation.touched.firstName && validation.errors.firstName ? true : false}
                                                        />
                                                        <FormFeedback>{validation.errors.firstName}</FormFeedback>
                                                    </Col>
                                                    <Col md={6} className="mb-3">
                                                        <Label className="form-label">Soyad <span className="text-danger">*</span></Label>
                                                        <Input
                                                            name="lastName"
                                                            type="text"
                                                            placeholder="Soyadınız"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.lastName}
                                                            invalid={validation.touched.lastName && validation.errors.lastName ? true : false}
                                                        />
                                                        <FormFeedback>{validation.errors.lastName}</FormFeedback>
                                                    </Col>
                                                </Row>

                                                <div className="mb-3">
                                                    <Label className="form-label">E-posta <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="E-posta adresinizi girin"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email}
                                                        invalid={validation.touched.email && validation.errors.email ? true : false}
                                                    />
                                                    <FormFeedback>{validation.errors.email}</FormFeedback>
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Kullanıcı Adı <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="userName"
                                                        type="text"
                                                        placeholder="Kullanıcı adınızı girin"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.userName}
                                                        invalid={validation.touched.userName && validation.errors.userName ? true : false}
                                                    />
                                                    <FormFeedback>{validation.errors.userName}</FormFeedback>
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Şifre <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Şifrenizi girin"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password}
                                                        invalid={validation.touched.password && validation.errors.password ? true : false}
                                                    />
                                                    <FormFeedback>{validation.errors.password}</FormFeedback>
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Şifre Onayı <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="confirmPassword"
                                                        type="password"
                                                        placeholder="Şifrenizi onaylayın"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.confirmPassword}
                                                        invalid={validation.touched.confirmPassword && validation.errors.confirmPassword ? true : false}
                                                    />
                                                    <FormFeedback>{validation.errors.confirmPassword}</FormFeedback>
                                                </div>

                                                {/* Onay kutusu (Checkbox) Alanı */}
                                                <div className="mb-4 form-check">
                                                    <Input
                                                        id="confirmAggreement"
                                                        name="confirmAggreement"
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        checked={validation.values.confirmAggreement}
                                                        invalid={validation.touched.confirmAggreement && validation.errors.confirmAggreement ? true : false}
                                                    />
                                                    <Label htmlFor="confirmAggreement" className="form-check-label text-muted fst-italic">
                                                        Kayıt olarak Workgrid {" "}
                                                        <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium">Kullanım Şartlarını</Link> kabul etmiş olursunuz.
                                                    </Label>
                                                    <FormFeedback>{validation.errors.confirmAggreement}</FormFeedback>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success" className="w-100" type="submit" disabled={registerMutation.isPending}>
                                                        {registerMutation.isPending && <Spinner size="sm" className='me-2'> Yükleniyor... </Spinner>}
                                                        Kayıt Ol
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Zaten bir hesabınız var mı? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Giriş Yap </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
            <ToastContainer  closeButton={true}  limit={3} style={{marginTop:"100px"}}/>
        </React.Fragment>
    );
};

export default Register;