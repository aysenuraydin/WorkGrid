import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik"; 
import { useLoginMutation } from 'hooks/useAuthentication';
import { useTenantContext } from 'context/TenantContext';
import config from 'config'; 
import { useGetBrand } from 'hooks/useBrand';
import useThemeMode from 'hooks/useThemeMode';
    // Workgrid7. workgrid@workgrid.com
export interface LoginVariables {
    email: string;
    password: string;
    rememberMe: boolean;             
    isExternalAuthentication: boolean;
}

const Login = (props: any) => {
    const loginMutation = useLoginMutation();
    
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const validation: any = useFormik({
        enableReinitialize: true,

        // 🎯 1. ADIM: initialValues alanına rememberMe ekledik
        initialValues: {
            email: '',  
            password: '',
            rememberMe: false, 
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Geçersiz e-posta formatı").required("Lütfen e-posta adresinizi girin"),
            password: Yup.string().required("Lütfen şifrenizi girin"),
        }),
        onSubmit: (values) => {
            setErrorMsg(null);
            
            loginMutation.mutate({ 
                email: values.email.trim(), 
                password: values.password,
                rememberMe: values.rememberMe,                
                isExternalAuthentication: false 
            }, {
                onSuccess: () => {
                    props.router.navigate("/dashboard");
                },
                onError: (err: any) => {
                    if (err.response?.data?.message) {
                        setErrorMsg(err.response.data.message);
                    } else if (err.response?.status === 401) {
                        setErrorMsg("Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.");
                    } else {
                        setErrorMsg("Giriş sırasında bir hata oluştu. Lütfen bağlantılarınızı kontrol edin.");
                    }
                }
            });
        }
    });

    const socialResponse = (type: any) => {
        console.log("Social login clicked:", type);
    };
                                        
    const { config: tenantConfig} = useTenantContext(); 
    const { data:brand } = useGetBrand(); 
    const { isDark } = useThemeMode(); 
    document.title = "Giriş Yap | " +(brand?.companyName || "Workgrid");
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
                                            <img className="wg-logo-sm"  src={`${config.api.FILE_API_URL}/File/${tenantConfig.logoSmUrl}`}  />
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className={`pt-4 bg-${isDark?'soft-':''}light`}>
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Tekrar Hoş Geldiniz!</h5>
                                            <p className="text-muted">Workgrid'e devam etmek için giriş yapın.</p>
                                        </div>
                                        
                                        {errorMsg && <Alert color="danger"> {errorMsg} </Alert>}
                                        
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">E-posta</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="E-posta adresinizi girin"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">Şifremi unuttum?</Link>
                                                    </div>
                                                    <Label className="form-label" htmlFor="password-input">Şifre</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password"
                                                            value={validation.values.password || ""}
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Şifrenizi girin"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.password && validation.errors.password ? true : false
                                                            }
                                                        />
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                        ) : null}
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon"
                                                            onClick={() => setPasswordShow(!passwordShow)}><i className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>

                                                {/* 🎯 3. ADIM: Checkbox elemanını Formik döngüsüne bağladık */}
                                                <div className="form-check">
                                                    <Input 
                                                        name="rememberMe"
                                                        type="checkbox" 
                                                        className="form-check-input" 
                                                        id="auth-remember-check" 
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        checked={validation.values.rememberMe}
                                                    />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Beni hatırla</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button 
                                                        color="success"
                                                        disabled={loginMutation.isPending}
                                                        className="btn btn-success w-100" 
                                                        type="submit"
                                                    >
                                                        {loginMutation.isPending && <Spinner size="sm" className='me-2'> Yükleniyor... </Spinner>}
                                                        Giriş Yap
                                                    </Button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title">Şununla giriş yap</h5>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-primary btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("facebook");
                                                            }}
                                                        >
                                                            <i className="ri-facebook-fill fs-16" />
                                                        </Link>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-danger btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("google");
                                                            }}
                                                        >
                                                            <i className="ri-google-fill fs-16" />
                                                        </Link>

                                                        <Button color="dark" className="btn-icon"><i className="ri-github-fill fs-16"></i></Button>{" "}
                                                        <Button color="info" className="btn-icon"><i className="ri-twitter-fill fs-16"></i></Button>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">Hesabınız yok mu? <Link to="/register" className="fw-semibold text-primary text-decoration-underline"> Kayıt Ol </Link> </p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default withRouter(Login);