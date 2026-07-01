import { Link } from 'react-router-dom';
import { Col, Form, Input, Label, Row, FormFeedback } from 'reactstrap';
import { useFormik } from "formik";  
import * as Yup from "yup"; 
import { useAuth } from 'context/AuthContext';
import { useUpdateExperienceProfile, useUserProfile } from 'hooks/useUser';
import Loader from 'components/Common/Loader';
import { toast } from 'react-toastify'; 

export const Experience = () => {
    const { user } = useAuth();
    const { data: userDetail, isLoading } = useUserProfile(user?.id ?? "");
    const { mutateAsync: updateProfileMutation } = useUpdateExperienceProfile();

    const rawYears = userDetail?.experienceYears || "";
    const splitYears = rawYears.includes("-") ? rawYears.split("-") : ["", ""];
    const initialStartYear = splitYears[0] || "";
    const initialEndYear = splitYears[1] || "";

    const validationSchema = Yup.object({
        jobTitle: Yup.string().required("Lütfen iş unvanınızı giriniz"),
        companyName: Yup.string().required("Lütfen şirket adını giriniz"),
        startYear: Yup.string().required("Lütfen başlangıç yılını seçiniz"),
        endYear: Yup.string().required("Lütfen bitiş yılını seçiniz"),
        jobDescription: Yup.string().required("Lütfen iş tanımını giriniz")
    });

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: user?.id ?? "",
            jobTitle: userDetail?.jobTitle || "",
            companyName: userDetail?.companyName || "",
            startYear: initialStartYear,
            endYear: initialEndYear,
            jobDescription: userDetail?.jobDescription || ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const combinedYears = `${values.startYear}-${values.endYear}`;
                const updatePayload = {
                    id: values.id,
                    jobTitle: values.jobTitle,
                    companyName: values.companyName,
                    experienceYears: combinedYears,  
                    jobDescription: values.jobDescription
                };

                await updateProfileMutation(updatePayload, {
                    onSuccess: () => {
                        toast.success("Deneyim başarıyla güncellendi!");
                    },
                    onError: () => {
                        toast.error("Deneyim güncellenemedi!");
                    }
                });
            } catch (error) {
                console.error("Gönderim hatası:", error);
            }
        }
    });

    if (isLoading) return <div className="pt-4"> <Loader isText={true} /> </div>;
    
    const yearsArray = Array.from({ length: 26 }, (_, i) => (2001 + i).toString());

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
        }}>
            <Row>
                <Col lg={12}>
                    <div className="mb-3">
                        <Label htmlFor="jobTitle" className="form-label">İş Unvanı</Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="jobTitle"
                            name="jobTitle"
                            placeholder="İş unvanı"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.jobTitle}
                            invalid={validation.touched.jobTitle && validation.errors.jobTitle ? true : false}
                        />
                        {validation.touched.jobTitle && validation.errors.jobTitle && (
                            <FormFeedback type="invalid">{validation.errors.jobTitle}</FormFeedback>
                        )}
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="mb-3">
                        <Label htmlFor="companyName" className="form-label">Şirket Adı</Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="companyName"
                            name="companyName"
                            placeholder="Şirket adı"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.companyName}
                            invalid={validation.touched.companyName && validation.errors.companyName ? true : false}
                        />
                        {validation.touched.companyName && validation.errors.companyName && (
                            <FormFeedback type="invalid">{validation.errors.companyName}</FormFeedback>
                        )}
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="mb-3">
                        <Label className="form-label">Deneyim Yılları</Label>
                        <Row>
                            <Col lg={5}>
                                <select
                                    className={`form-control ${validation.touched.startYear && validation.errors.startYear ? 'is-invalid' : ''}`}
                                    name="startYear"
                                    id="startYear"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.startYear}
                                >
                                    <option value="">Yıl seçiniz</option>
                                    {yearsArray.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                                {validation.touched.startYear && validation.errors.startYear && (
                                    <div className="invalid-feedback">{validation.errors.startYear}</div>
                                )}
                            </Col>

                            <div className="col-auto align-self-center">-</div>

                            <Col lg={5}>
                                <select
                                    className={`form-control ${validation.touched.endYear && validation.errors.endYear ? 'is-invalid' : ''}`}
                                    name="endYear"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.endYear}
                                >
                                    <option value="">Yıl seçiniz</option>
                                    {yearsArray.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                                {validation.touched.endYear && validation.errors.endYear && (
                                    <div className="invalid-feedback">{validation.errors.endYear}</div>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col lg={12}>
                    <div className="mb-3">
                        <Label htmlFor="jobDescription" className="form-label">İş Tanımı</Label>
                        <Input
                            type="textarea"
                            className="form-control"
                            id="jobDescription"
                            name="jobDescription"
                            rows={3}
                            placeholder="İş tanımını giriniz"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.jobDescription}
                            invalid={validation.touched.jobDescription && validation.errors.jobDescription ? true : false}
                        />
                        {validation.touched.jobDescription && validation.errors.jobDescription && (
                            <FormFeedback type="invalid">{validation.errors.jobDescription}</FormFeedback>
                        )}
                    </div>
                </Col>

                <Col lg={12} className="mt-2">
                    <div className="hstack gap-2 justify-content-end">
                        <Link to={`/profile/${user?.id}`} className="btn btn-soft-secondary">İptal</Link>
                        <button type="submit" className="btn btn-primary">Güncelle</button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};