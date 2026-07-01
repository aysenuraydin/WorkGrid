import { Form } from "reactstrap";
import { useDataTable } from "context/DatatableContext";
import 'react-toastify/dist/ReactToastify.css';
import useThemeMode from "hooks/useThemeMode";
import { useTableAccessForm } from "./hooks/useTableAccessForm";
import { AccessForm } from "./components/AccessForm";

export const EditTableAccess = () => {
    const { modal } = useDataTable();
    const { isDark } = useThemeMode();
    const {
        formik, 
        handleChange,
        handleFocus,
        handleBlur
    } = useTableAccessForm();

    return (
        <div className={`p-4 bg-${isDark ? "soft-" : ""}light rounded rounded-3`}>
            <Form
                className="tablelist-form"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    formik.handleSubmit();
                }}
            >
                <div style={{ marginBottom: "0px" }}>
                    <AccessForm
                        formik={formik}
                        handleChange={handleChange}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                    />
                </div>

                <div className="hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => modal.setEditSettingModal(false)}
                    >
                        <i className="ri-close-line fs-16 me-2"></i>
                        İptal
                    </button>
                    <button type="submit" className="btn btn-success">
                        <i className="ri-save-3-fill fs-16 me-2"></i>
                        Erişimi Kaydet
                    </button>
                </div>
            </Form>
        </div>
    );
};