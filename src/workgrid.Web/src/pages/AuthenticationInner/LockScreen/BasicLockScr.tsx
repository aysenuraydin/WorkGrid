import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Row } from 'reactstrap';
import ParticlesAuth from "../ParticlesAuth";
import { getUserInitials } from 'common/utils/getUserInitials'; // Avatar fallback için ekledik

//formik
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTenantContext } from 'context/TenantContext';
import config from 'config';
import { useAuth } from 'context/AuthContext'; 
import { useGetBrand } from 'hooks/useBrand';

const BasicLockScreen = () => {
    const { config: tenantConfig } = useTenantContext();
    const { login } = useAuth(); 
    const navigate = useNavigate();
    
    const [lockedUser, setLockedUser] = useState<any>(null);
    const [loginError, setLoginError] = useState<string | null>(null);

    useEffect(() => {
        const userJson = localStorage.getItem("locked_user");
        if (userJson) {
            setLockedUser(JSON.parse(userJson));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Please Enter Password")
        }),
        onSubmit: async (values) => {
            try {
                setLoginError(null);
                await login({
                    email: lockedUser.email,
                    password: values.password 
                });
                
                localStorage.removeItem("locked_user");
                navigate("/dashboard");
            } catch (error: any) {
                setLoginError(error?.message || "Invalid password. Please try again.");
            }
        }
    });

    const handleResetLock = () => {
        localStorage.removeItem("locked_user");
    }; 

    const { data: brand } = useGetBrand();
    document.title = "Kilitli Ekran | " + (brand?.companyName || "Workgrid");

    return (
        <React.Fragment>
            <div className="auth-page-content">
                <div className="auth-page-wrapper">
                    <ParticlesAuth>
                        <div className="auth-page-content">
                            <Container>
                                <Row>
                                    <Col lg={12}>
                                        <div className="text-center mt-sm-5 mb-4 text-white-50">
                                            <div>
                                                <Link to="/dashboard" className="d-inline-block auth-logo">
                                                    <img src={`${config.api.FILE_API_URL}/File/${tenantConfig?.logoSmUrl}`} alt="Logo" height={100} />
                                                </Link>
                                            </div>
                                            <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="justify-content-center">
                                    <Col md={8} lg={6} xl={5}>
                                        <Card className="mt-1 card-bg-fill">
                                            <CardBody className="p-1">
                                                <div className="text-center mt-2">
                                                    <h5 className="text-primary">Lock Screen</h5>
                                                    <p className="text-muted">Enter your password to unlock the screen!</p>
                                                </div>
                                                
                                                {/* Dinamik Kullanıcı Bilgisi ve Profil Resmi */}
                                                <div className="user-thumb text-center">
                                                    {lockedUser?.profilePictureUrl ? (
                                                        <img 
                                                            src={`${config.api.FILE_API_URL}/File/${lockedUser.profilePictureUrl}`} 
                                                            className="rounded-circle img-thumbnail avatar-lg" 
                                                            alt="thumbnail" 
                                                        />
                                                    ) : (
                                                        <div className="avatar-title mx-auto border border-2 bg-light text-primary rounded-circle text-uppercase fw-semibold" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                                            {lockedUser ? getUserInitials(lockedUser.firstName, lockedUser.lastName) : "U"}
                                                        </div>
                                                    )}
                                                    <h5 className="font-size-15 mt-3">
                                                        {lockedUser ? `${lockedUser.firstName} ${lockedUser.lastName}` : "Loading..."}
                                                    </h5>
                                                </div>

                                                <div className="p-2 mt-4">
                                                    {loginError && (
                                                        <div className="alert alert-danger text-center mb-3" role="alert">
                                                            {loginError}
                                                        </div>
                                                    )}

                                                    <Form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        validation.handleSubmit();
                                                        return false;
                                                    }}>
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="userpassword">Password</label>
                                                            <Input 
                                                                type="password" 
                                                                className="form-control" 
                                                                id="userpassword" 
                                                                placeholder="Enter password"
                                                                name="password"
                                                                value={validation.values.password}
                                                                onBlur={validation.handleBlur}
                                                                onChange={validation.handleChange}
                                                                invalid={validation.errors.password && validation.touched.password ? true : false}
                                                            />
                                                            {validation.errors.password && validation.touched.password ? (
                                                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-2 mt-4">
                                                            <Button color="success" className="w-100" type="submit">Unlock</Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <div className="mt-4 text-center">
                                            <p className="mb-0">
                                                Not you? return 
                                                <Link 
                                                    to="/login" 
                                                    onClick={handleResetLock} 
                                                    className="fw-semibold text-primary text-decoration-underline ms-1"
                                                > 
                                                    Signin 
                                                </Link> 
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </ParticlesAuth>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BasicLockScreen;