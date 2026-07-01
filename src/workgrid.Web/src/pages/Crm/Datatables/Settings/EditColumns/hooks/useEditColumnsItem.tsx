import { TableColumn } from "common/data/TableColumn";
import { ExtendedTableColumn } from "components/Common/interfaces/TableColumnContextType";
import { useFormik } from "formik";
import { useState } from "react"; 
import * as Yup from "yup";

export const useEditColumnsItem = (
    markToBeEdited: (col: Partial<ExtendedTableColumn> & { id: number }) => void,
    column: TableColumn,
    isMove: { [key: string]: boolean }, 
    moveUp: (columnId: number) => void, 
    moveDown: (columnId: number) => void, 
    confirmOrder: () => void, 
    lastTableOrder: number, 
    resetOrder: () => void
) => {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: (column && column.id) || '',
            name: (column && column.name) || '',
            type: (column && column.type) || '',
            isVisible: (column && column.isVisible) || false,
            tableId: (column && column.tableId) || '',
            tableOrder: (column && column.tableOrder) || 0,
            isFilter: (column && column.isFilter) || false,
        },

        validationSchema: Yup.object({
            name: Yup.string().required('Lütfen Sütun Adını Girin'),
            type: Yup.string().required('Lütfen Sütun Tipini Girin'),
        }),
        onSubmit: async (values) => { }, 
    }); 
    
    const isForeignColumn = column.realColumnId != null || column.realTableId != null;
    const [focusMap, setFocusMap] = useState<{ [key: string]: boolean }>({});
    const [changedMap, setChangedMap] = useState<{ [key: string]: boolean }>({});

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: true }));
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: false }));
        formik.handleBlur(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name.trim();

        const value = target instanceof HTMLInputElement && (target.type === 'checkbox' || target.type === 'radio') ? target.checked : target.value;

        formik.setFieldValue(name, value);
        setChangedMap(prev => ({ ...prev, [name]: true }));

        markToBeEdited({
            id: column.id,
            [name]: value,
        });
    };

    const doMove = (order: number) => {
        const entries = Object.entries(isMove);
        const otherActive = entries.some(([key, move]) => {
            const typedMove = move as boolean;
            return typedMove && key !== String(column.id);
        });
        
        return (
            <span
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    width: "20px",
                }}
                className={`${otherActive ? "d-none" : ""}`}
            >
                <div style={{ 
                        display: "block",
                        width: "16px",
                        height: "10px",
                        transformOrigin: "center center",
                        padding: 0, position: "relative"
                    }}
                    className={`hoverArrow ${order === 0 ? "d-none" : ""}`}
                    onClick={() => { moveUp(column.id); }}>
                    <i style={{ position: "absolute", top: "-10px" }}
                        className="ri-arrow-up-s-line fs-16"
                    ></i> 
                </div>
                {order + 1}
                <div style={{
                    display: "block",
                    width: "16px",
                    height: "10px",
                    transformOrigin: "center center",
                    padding: 0, position: "relative"
                }}
                className={`hoverArrow ${order === lastTableOrder - 1 ? "d-none" : ""}`}
                onClick={() => { moveDown(column.id); }}>
                    <i style={{ position: "absolute", top: "-10px" }}
                        className="ri-arrow-down-s-line fs-16"
                    ></i>
                </div>

                <style>{`
                    .hoverArrow:hover {
                        cursor: pointer;
                        transform: scale(1.3);
                        transition: transform 0.2s ease;
                    }
                    .hoverColor:hover {
                        color: white !important;
                    }
                `}</style>
            </span>
        );
    };

    const moveAction = () => {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",       
                padding: "4px",   
            }}>
                <i className={`btn btn-sm btn-soft-success ri-check-line fs-14 text-success hoverColor me-1`}
                    style={{ width: "23px", height: "23px", padding: 0 }}
                    onClick={() => confirmOrder()}
                ></i>
                <i className="ri-close-line btn btn-sm btn-soft-danger fs-14 text-danger hoverColor"
                    style={{ width: "23px", height: "23px", padding: 0 }}
                    onClick={() => resetOrder()}
                ></i>
            </div>
        ) 
    }

    return {
        formik, 
        doMove, 
        isForeignColumn, 
        handleChange, 
        handleFocus, 
        handleBlur, 
        focusMap, 
        changedMap, 
        moveAction
    }
}