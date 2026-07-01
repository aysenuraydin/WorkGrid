

import { useEffect } from "react";
import { Form } from "reactstrap";
import { registerPlugin } from "react-filepond";
import { DataType } from "common/enums/DataType"; 
import { CreateRowBody } from "./components/CreateRowBody";
import { CreateRowFooter } from "./components/CreateRowFooter"; 
import { useCreateRowFormik } from "./hooks/useCreateRowFormik";
import { useFunctionColumns } from "./hooks/useFunctionColumns"; 
import { useDataTableItem } from "context/DatatableItemContext";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "./CreateRow.css";  ;

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export const CreateRow = ({  }) => {
    const {   
        toggle, 
        columns, 
        table, 
        modal, setModal,
        modalType,  
        fileManagerRefs,
        filteredFileIds, 
        row, setRow, 
        selectedForDeletion,
        effectiveRowId,
        modalSize
    } = useDataTableItem();  

    const { formik, handleChange } = useCreateRowFormik({
        modal,
        modalType,
        modalSize,
        columns,
        table,
        rowId : effectiveRowId, 
        row, 
        fileManagerRefs,
        selectedForDeletion,
        filteredFileIds,
        setModal,
        toggle,
    });

    useFunctionColumns(
        formik.values, 
        columns, 
        formik.setFieldValue
    );

    useEffect(() => {
        if (modalType === DataType.Create) {
            setRow(undefined!);
            formik.resetForm({
                values: {
                    cells: { 0: columns.reduce((acc:any, col:any) => ({ ...acc, [col.id]: "" }), {}) }
                }
            });
        }
    }, [modalType, modal]);  

    return (
        <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }} noValidate>
            <CreateRowBody
                formik={formik}
                handleChange={handleChange}   
            />
            <div className="border-top" style={{ height: "75px" }} />
            <CreateRowFooter />
        </Form>
    );
};