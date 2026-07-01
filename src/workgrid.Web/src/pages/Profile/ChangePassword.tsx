

import { Link } from 'react-router-dom';
import { Col, Form, Input, Label, Row, FormFeedback } from 'reactstrap';
import { useFormik } from "formik";  
import * as Yup from "yup"; 
import { useAuth } from 'context/AuthContext';
import { useUpdatePassword } from 'hooks/useUser';
import { toast, ToastContainer } from 'react-toastify'; 

export const ChangePassword = () => {
    const { user } = useAuth();
    const { mutateAsync: updatePasswordMutation } = useUpdatePassword(); 

    const passwordValidationSchema = Yup.object({
        currentPassword: Yup.string().required("Please enter your current password"),
        newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters") 
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")  
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter") 
            .matches(/[0-9]/, "Password must contain at least one number")  
            .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character (!, @, #, etc.)") 
            .required("Please enter your new password"),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords do not match")
            .required("Please confirm your new password"),
    });

    const validation = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
        validationSchema: passwordValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const requestPayload = {
                    id: user?.id ?? "",
                    ...values
                };

                await updatePasswordMutation(requestPayload, {
                    onSuccess: (response: any) => {
                        toast.success(response?.data?.message || "Password updated successfully.");
                        resetForm(); 
                    },
                    onError: (error: any) => {
                        const serverMessage = error?.response?.data?.message || "Password could not be updated!";
                        toast.error(serverMessage);
                    }
                });
            } catch (error) {
                console.error("Form submit error:", error);
            }
        }
    });

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
        }}>
            <Row className="g-2">
                <Col lg={4}>
                    <div className="mb-3">
                        <Label htmlFor="oldpasswordInput" className="form-label">Old Password*</Label>
                        <Input
                            type="password"
                            className="form-control"
                            id="oldpasswordInput"
                            name="currentPassword"
                            placeholder="Enter current password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.currentPassword}
                            invalid={validation.touched.currentPassword && validation.errors.currentPassword ? true : false}
                        />
                        {validation.touched.currentPassword && validation.errors.currentPassword ? (
                            <FormFeedback type="invalid">{validation.errors.currentPassword}</FormFeedback>
                        ) : null}
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="mb-3">
                        <Label htmlFor="newpasswordInput" className="form-label">New Password*</Label>
                        <Input
                            type="password"
                            className="form-control"
                            id="newpasswordInput"
                            name="newPassword"
                            placeholder="Enter new password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.newPassword}
                            invalid={validation.touched.newPassword && validation.errors.newPassword ? true : false}
                        />
                        {validation.touched.newPassword && validation.errors.newPassword ? (
                            <FormFeedback type="invalid">{validation.errors.newPassword}</FormFeedback>
                        ) : null}
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="mb-3">
                        <Label htmlFor="confirmpasswordInput" className="form-label">Confirm Password*</Label>
                        <Input
                            type="password"
                            className="form-control"
                            id="confirmpasswordInput"
                            name="confirmNewPassword"
                            placeholder="Confirm password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirmNewPassword}
                            invalid={validation.touched.confirmNewPassword && validation.errors.confirmNewPassword ? true : false}
                        />
                        {validation.touched.confirmNewPassword && validation.errors.confirmNewPassword ? (
                            <FormFeedback type="invalid">{validation.errors.confirmNewPassword}</FormFeedback>
                        ) : null}
                    </div>
                </Col>

                <Col lg={12}>
                    <div className="mb-3">
                        <Link to="#" className="link-primary text-decoration-underline">Forgot Password ?</Link>
                    </div>
                </Col>

                <Col lg={12}>
                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};
