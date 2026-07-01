import { AuthUser } from "context/AuthContext";
import { useGetRoles } from "hooks/useRole";
import { useChangeRoleForm } from "./useChangeRoleForm";
import { Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import useThemeMode from "hooks/useThemeMode";
import { useTenantContext } from "context/TenantContext";


export const ChangeRoleModal = ({ isOpen, onClose, user }: {
    isOpen: boolean; onClose: () => void; user: AuthUser | undefined;
}) => {
    const { data: roles } = useGetRoles();
    const { config: tenantConfig } = useTenantContext(); 
    const { isDark } = useThemeMode();  
    const { value, focusMap, changedMap, handleFocus, handleBlur, handleChange, handleSubmit } =
        useChangeRoleForm(user, onClose);

    return (
        <Modal isOpen={isOpen} toggle={()=>onClose()} size="md" centered>
            <ModalHeader className={`bg-${isDark?"dark":"light"} p-3`}  toggle={onClose}>Edit Role</ModalHeader>
            <ModalBody>
                <Label htmlFor="role" className="form-label">Role</Label>
                <Input
                    id="role" name="role" type="select" value={value}
                    className={`w-100 form-control
                        ${isDark?"border-light":""}
                        ${focusMap["role"]   ? "border-primary shadow-sm"   : ""}
                        ${changedMap["role"] ? "bg-opacity-10" : ""}
                    `}
                    onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                >
                    {(roles ?? [])
                    ?.filter((r: any) => {
                        if (r.name === "WG") return false;

                        if (!tenantConfig.showBLog && !tenantConfig.showCalendar && r.name === "EndUser") {
                            return false;
                        }

                        return true;
                    })
                    ?.map((r: any) => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                </Input>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-light" onClick={onClose}>
                    <i className="ri-close-line fs-16 me-2" />Kapat
                </button>
                <button className="btn btn-success" onClick={handleSubmit}>
                    <i className="ri-save-3-fill fs-16 me-2" />Rolü Kaydet
                </button>
            </ModalFooter>
        </Modal>
    );
};

