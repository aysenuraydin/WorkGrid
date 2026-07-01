import { TableColumn } from "common/data/TableColumn";
import { useFormik } from "formik";
import { useState } from "react"; 
import * as Yup from "yup"; 

export const useTableColumnForm = (
    tableId: number,
    markToBeAdded: (newColumn: Partial<TableColumn>) => void
) => {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
            type: '',
            isVisible: false,
            tableId: tableId,
            tableOrder: 0,
            isFilter: false,
        },

        validationSchema: Yup.object({
            name: Yup.string().required('Lütfen Sütun Adını Girin'),
            type: Yup.string().required('Lütfen Sütun Tipini Girin'),
        }),
        onSubmit: async (values) => {
            const addColumn = {
                id : Date.now(),
                name: values.name.trim(),
                type: values.type,
                isVisible: values.isVisible,
                tableId: tableId,
                tableOrder: 0,
                isFilter: values.isFilter,
            };

            markToBeAdded(addColumn as TableColumn);
            formik.resetForm();
        },
    });

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        formik.handleSubmit();
    };
    
    const [focusMap, setFocusMap] = useState<{ [key: string]: boolean }>({});
    const [changedMap, setChangedMap] = useState<{ [key: string]: boolean }>({});

    // Tip tanımı (HTMLInputElement veya HTMLSelectElement kapsanmıştır)
    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: true }));
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: false }));
        formik.handleBlur(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target; 
        const val = (e.target instanceof HTMLInputElement && 
            (type === 'checkbox' || type === 'radio'))
            ? e.target.checked
            : value;

        formik.setFieldValue(name, val);
        setChangedMap(prev => ({ ...prev, [name]: true }));
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            formik.handleSubmit();
        }
    };

    return {
        formik, 
        handleSubmit,
        handleChange, 
        handleBlur, 
        handleFocus, 
        focusMap,
        changedMap,
        handleKeyDown
    };
};