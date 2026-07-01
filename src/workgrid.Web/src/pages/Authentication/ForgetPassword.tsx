import PropTypes from "prop-types";
import React, { useState } from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form, Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useForgetPasswordMutation } from "hooks/useAuthentication";
import { useTenantContext } from "context/TenantContext";
import config from "config"; 
import { useGetBrand } from "hooks/useBrand";
import useThemeMode from "hooks/useThemeMode";

export const ForgetPasswordPage = (props: any) => {
  const forgetPasswordMutation = useForgetPasswordMutation();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Geçersiz e-posta adresi").required("Lütfen e-posta adresinizi girin"),
    }),
    onSubmit: (values: any) => {
      setErrorMsg(null);
      setSuccessMsg(null);

      forgetPasswordMutation.mutate({ email: values.email }, {
        onSuccess: (response: any) => {
          setSuccessMsg("Şifrenizi sıfırlamanız için gerekli talimatlar e-posta adresinize gönderildi!");
        },
        onError: (err: any) => {
          setErrorMsg("Bir hata oluştu. Lütfen e-posta adresinizi kontrol edin veya daha sonra tekrar deneyin.");
        }
      });
    }
  });
  const { config: tenantConfig} = useTenantContext(); 
  const { data:brand } = useGetBrand(); 
  const { isDark } = useThemeMode(); 
  document.title = "Şifremi Sıfırla | " +(brand?.companyName || "Workgrid");
  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/dashboard" className="d-inline-block auth-logo">
                    <img className="wg-logo-sm"  src={`${config.api.FILE_API_URL}/File/${tenantConfig.logoSmUrl}`} />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-semibold text-dark">Premium Yönetim Paneli ve Dashboard Şablonu</p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4 border border-2 shadow">

                <CardBody   className={`pt-4 bg-${isDark?'soft-':''}light`}>
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Şifrenizi mi unuttunuz?</h5>
                    <p className="text-muted">Workgrid ile şifrenizi sıfırlayın</p>

                    <i className="ri-mail-send-line display-5 text-success mb-3"></i>
                  </div>

                  <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                    E-posta adresinizi girin, size gerekli talimatları gönderelim!
                  </Alert>
                  
                  <div className="p-2">
                    {/* 🎯 Dinamik Hata Mesajı */}
                    {errorMsg && (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {errorMsg}
                      </Alert>
                    )}
                    
                    {/* 🎯 Yarım kalan ve şimdi tamamlanan Dinamik Başarı Mesajı */}
                    {successMsg && (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {successMsg}
                      </Alert>
                    )}

                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">E-posta</Label>
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
                          <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        {/* 🎯 Düz buton yerine loading spinner'lı reactstrap Button bileşenine geçtik, stil birebir aynı */}
                        <Button 
                          color="primary" 
                          className="w-100" 
                          type="submit" 
                          disabled={forgetPasswordMutation.isPending}
                        >
                          {forgetPasswordMutation.isPending && <Spinner size="sm" className='me-2'> Yükleniyor... </Spinner>}
                          Sıfırlama Bağlantısı Gönder
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Dur, şifremi hatırladım... <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Buraya tıkla </Link> </p>
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);