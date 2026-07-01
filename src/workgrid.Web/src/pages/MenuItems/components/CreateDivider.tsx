import { Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { DataType } from 'common/enums/DataType'; 
import { useDividerForm } from '../hooks/useDividerForm';
import { useMenu } from 'context/MenuContext';
import "../MenuItems.css";
import useThemeMode from 'hooks/useThemeMode';
import { useGetTenantConfig } from 'hooks/useTenant';

export const CreateDivider = () => {   
    const { data: tenantConfig } = useGetTenantConfig();  
    const { isDark } = useThemeMode(); 
    const { state, actions } = useMenu();
    
    const formik = useDividerForm(
      state.divider, 
      state.modalType!, 
      actions.toggleDividerModal, 
      actions.setDivider
    );

  return (
    <Modal 
        id="showModal" 
        isOpen={state.dividerModal} 
        toggle={actions.toggleDividerModal} 
        centered 
        style={{ userSelect: "none" }}
        contentClassName="border-0 shadow-lg"
    >
        <ModalHeader 
            className={`bg-${isDark ? "dark" : "light"} px-4 py-3`} 
            toggle={actions.toggleDividerModal}
        >
            <span className="d-flex align-items-center gap-2">
                <i className="ri-separator text-primary fs-18"></i>
                <span>
                    <span className="text-capitalize">{state.modalType}</span> Ayraç
                </span>
            </span>
        </ModalHeader>

        <Form className="tablelist-form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                formik.handleSubmit();
                return false;
            }}>
            <ModalBody className="px-4 py-4">
                <input type="hidden" id="id" />

                {/* Ayraç Adı */}
                <div className="mb-4">
                    <Label htmlFor="label" className="form-label fw-semibold text-muted small text-uppercase mb-2">
                        Ayraç Adı
                    </Label>
                    <Input
                        name="label"
                        id="label"
                        className="form-control"
                        placeholder="Ayraç adını girin"
                        type="text"
                        style={{ borderRadius: 8, padding: "10px 14px" }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.label || ""}
                    />
                </div>

                {/* Ayarlar */}
                <div 
                    className="d-flex gap-3"
                    style={{ 
                        background: isDark ? "rgba(255,255,255,0.03)" : "#F8F9FA",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E9EBEC"}`,
                        borderRadius: 10,
                        padding: "14px 16px",
                    }}
                >
                    {/* Görünürlük */}
                    <div 
                        className="d-flex align-items-center justify-content-between flex-grow-1 gap-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => formik.setFieldValue("visible", !formik.values.visible)}
                    >
                        <span className="d-flex align-items-center gap-2">
                            <i className={`fs-16 ${formik.values.visible ? "ri-eye-line text-success" : "ri-eye-off-line text-muted"}`}></i>
                            <span className="fw-medium fs-14">Görünürlük</span>
                        </span>
                        <div className="form-check form-switch m-0" onClick={(e) => e.stopPropagation()}>
                            <input
                                name="visible"
                                id="visible"
                                type="checkbox"
                                role="switch"
                                className="form-check-input"
                                style={{ 
                                    width: 38,
                                    height: 20,
                                    cursor: 'pointer',
                                }}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={!!formik.values.visible} 
                            />
                        </div>
                    </div>

                    <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.08)" : "#E9EBEC" }} />

                    {/* Sadece Admin */}
                    <div 
                        className="d-flex align-items-center justify-content-between flex-grow-1 gap-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => formik.setFieldValue("isAdmin", !formik.values.isAdmin)}
                    >
                        <span className="d-flex align-items-center gap-2">
                            <i className={`fs-16 ${formik.values.isAdmin ? "ri-shield-user-line text-warning" : "ri-shield-line text-muted"}`}></i>
                            <span className="fw-medium fs-14">Sadece Admin</span>
                        </span>
                        <div className="form-check form-switch m-0" onClick={(e) => e.stopPropagation()}>
                            <input
                                name="isAdmin"
                                id="isAdmin"
                                type="checkbox"
                                role="switch"
                                className="form-check-input"
                                style={{ 
                                    width: 38,
                                    height: 20,
                                    cursor: 'pointer',
                                }}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={!!formik.values.isAdmin} 
                            />
                        </div>
                    </div>
                </div>
            </ModalBody>
            
            <ModalFooter className="modal-footer px-4 py-3">
                <div className="hstack gap-2 justify-content-end w-100">
                    <button
                        type="button"
                        className="btn btn-light"
                        style={{ borderRadius: 8 }}
                        onClick={() => actions.setDividerModal(false)}
                    >
                        Kapat
                    </button>

                    {state.modalType !== DataType.View && (
                        <button type="submit" className="btn btn-success" style={{ borderRadius: 8 }}>
                            <i className="ri-check-line align-bottom me-1"></i>
                            <span className="text-capitalize">{state.modalType}</span> Ayraç
                        </button>
                    )}
                </div>
            </ModalFooter>
        </Form>
    </Modal>
  );
};