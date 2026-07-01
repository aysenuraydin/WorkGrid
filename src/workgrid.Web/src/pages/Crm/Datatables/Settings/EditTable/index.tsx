import { Form } from "reactstrap"; 
import { useDataTable } from "context/DatatableContext"; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useTableForm } from "./hooks/useTableForm";
import { EditTableForm } from "./components/EditTableForm";
import useThemeMode from "hooks/useThemeMode";
    
export const EditTable = () => { 
    const { modal } = useDataTable();  
    const { isDark } = useThemeMode();  
    const { 
        formik, 
        focusMap, 
        changedMap, 
        handleChange, 
        handleFocus, 
        handleBlur 
    } = useTableForm({ table: modal.table }); 

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
                    <EditTableForm 
                        modal={modal}
                        formik={formik}
                        focusMap={focusMap}
                        changedMap={changedMap}
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
                    <button 
                        type="submit" 
                        className="btn btn-success"
                    >
                        <i className="ri-save-3-fill fs-16 me-2"></i>
                        Tabloyu Düzenle
                    </button>
                </div>
            </Form>
            
            <style>{`
                .mb-3.w-100.col:hover {
                    border: none !important;
                }
            `}</style>
        </div>
    );
};