import { useState } from "react";

export const useFormUIEffects = (formik: any) => { 
    const [focusMap, setFocusMap] = useState<Record<string, boolean>>({});
    const [changedMap, setChangedMap] = useState<Record<string, boolean>>({});

    const handleFocus = (e: React.FocusEvent<FormElement>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: true }));
    };
    const handleBlur = (e: React.FocusEvent<FormElement>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: false }));
        formik.handleBlur(e);
    };
    const handleChange = (e: React.ChangeEvent<FormElement>) => {
        const { name, type, value } = e.target; 
        const val = (e.target instanceof HTMLInputElement && (type === 'checkbox' || type === 'radio'))
            ? e.target.checked
            : value;

        formik.setFieldValue(name, val);
        setChangedMap(prev => ({ ...prev, [name]: true }));
    };

    return { 
        focusMap, 
        changedMap, 
        handleFocus, 
        handleBlur, 
        handleChange
    };
}; 
