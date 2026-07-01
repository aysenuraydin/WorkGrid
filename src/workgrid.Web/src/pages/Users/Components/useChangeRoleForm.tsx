import { AuthUser } from "context/AuthContext";
import { useUpdateUserRole } from "hooks/useRole";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useChangeRoleForm = (
    user: AuthUser | undefined,
    onClose: () => void
) => {
    const { mutate: updateUserRole } = useUpdateUserRole();
    const [value,      setValue]      = useState("");
    const [focusMap,   setFocusMap]   = useState<Record<string, boolean>>({});
    const [changedMap, setChangedMap] = useState<Record<string, boolean>>({});

    useEffect(() => { setValue(user?.roles[0] ?? ""); }, [user]);

    const handleFocus  = (e: React.FocusEvent<any>)  =>
        setFocusMap(p  => ({ ...p, [e.target.name]: true  }));
    const handleBlur   = (e: React.FocusEvent<any>)  =>
        setFocusMap(p  => ({ ...p, [e.target.name]: false }));
    const handleChange = (e: React.ChangeEvent<any>) => {
        setValue(e.target.value);
        setChangedMap(p => ({ ...p, [e.target.name]: true }));
    };

    const handleSubmit = () => {
        if (!user?.id) return;
        updateUserRole({ userId: user.id, newRole: value }, {
            onSuccess: () => { toast.success("Role changed!"); onClose(); },
            onError:   () =>   toast.error("Role could not be changed!"),
        });
    };

    return { value, focusMap, changedMap, handleFocus, handleBlur, handleChange, handleSubmit };
};
