import { Datatable } from "common/data/Datatable";
import { ForeignTable } from "common/data/ForeignTable";
import { DataType } from "common/enums/DataType";
import { ModalSizeType } from "common/enums/ModalSizeType";
import { TableViewType } from "common/enums/TableViewType";
import { useDataTable } from "context/DatatableContext";
import { useFormik } from "formik";
import { useCreateDataTable, useUpdateDataTable } from "hooks/useDatatables";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup"; 

interface UseTableFormOptions {
    table?: Datatable;
    type?: DataType;
    modal?: boolean;
    toggle?: () => void;
}

export interface ITableFormValues {
    id: number | string | undefined;
    name: string;
    modalSize: string;
    viewType: string;
    pageSize: number | string;
    foreignTablesId: number[];
}

export const useTableForm = ({ table, type = DataType.Edit, modal, toggle }: UseTableFormOptions) => {
    const [focusMap, setFocusMap] = useState<Record<string, boolean>>({});
    const [changedMap, setChangedMap] = useState<Record<string, boolean>>({});
    const { modal:data } = useDataTable(); 

    const { mutate: updateDataTableMutation } = useUpdateDataTable();
    const { mutate: createDataTableMutation } = useCreateDataTable();

    const extractApiMessage = (err: any, fallback: string): string => {
        const data = err?.response?.data;
        if (typeof data === "string" && data.trim()) return data;
        if (data?.message) return data.message;
        if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors[0];
        if (err?.message) return err.message;
        return fallback;
    };
    

    const isCreate = type === DataType.Create;

    const formik = useFormik<ITableFormValues>({
        enableReinitialize: true,
        initialValues: {
            id: isCreate ? '' : table?.id,
            name: isCreate ? '' : table?.name ?? '',
            modalSize: isCreate ? '' : table?.modalSize ?? '',
            viewType: isCreate ? '' : table?.viewType ?? '',
            pageSize: isCreate ? '' : table?.pageSize ?? '',
            foreignTablesId: table?.foreignTablesFk?.map((ft: ForeignTable) => ft.foreignTableId) ?? [],
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Lütfen Tablo Adını Giriniz")
                .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ]/, "Tablo adı bir harf ile başlamalıdır")
                .matches(/^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]+$/, "Tablo adı sadece harf, rakam ve boşluk içerebilir"),
            modalSize: Yup.string().required("Lütfen Modal Boyutunu Giriniz"),
            viewType: Yup.string().required("Lütfen Görünüm Türünü Seçiniz"),
            pageSize: Yup.string().required("Lütfen Sayfa Boyutunu Giriniz"),
        }),
        onSubmit: async (values) => { 
            if (isCreate) {
                await createDataTableMutation({
                    name: values.name.trim(),
                    modalSize: values.modalSize,
                    viewType: values.viewType,
                    pageSize: values.pageSize,
                }, {
                    onSuccess: (res: any) => {
                        if (res && res.succeeded === false) {
                            const msg = res.message || "Tablo oluşturulamadı!";
                            toast.error(msg);
                            formik.setFieldError("name", msg);
                            return;
                        }
                        toast.success("Tablo başarıyla oluşturuldu!");
                        formik.resetForm();
                        toggle?.();
                    },
                    onError: (err: any) => {
                        const msg = extractApiMessage(err, "Tablo oluşturulurken bir hata oluştu!");
                        toast.error(msg);
                        formik.setFieldError("name", msg);
                        formik.setFieldTouched("name", true, false);
                    },
                });
            } else { 
                data.setTable({
                    id: table?.id ?? 0,
                    name: values.name.trim(),
                    modalSize: values.modalSize as ModalSizeType,
                    viewType: values.viewType as TableViewType, 
                    pageSize: values?.pageSize ? Number(values.pageSize) : undefined,
                    foreignTablesFk: table?.foreignTablesFk ?? [],
                } as Datatable)
                await updateDataTableMutation({
                    id: table?.id ?? 0,
                    name: values.name.trim(),
                    modalSize: values.modalSize,
                    viewType: values.viewType,
                    pageSize: values.pageSize,
                    foreignTablesFk: table?.foreignTablesFk ?? [],
                }, {
                    onSuccess: () => { 
                        toast.success("Tablo başarıyla güncellendi!"); 
                        toggle?.(); 
                    },
                    onError: () => toast.error("Tablo güncellenirken bir hata oluştu!"),
                });
            }
        },
    });

    useEffect(() => {
        if (modal === false) return;
        if (isCreate) formik.resetForm();
        setFocusMap({});
        setChangedMap({});
    }, [modal, type, table]);

    const handleFocus = (e: React.FocusEvent<any>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleBlur = (e: React.FocusEvent<any>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: false }));
        formik.handleBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, type, value } = e.target; 
        const val = (e.target instanceof HTMLInputElement && (type === 'checkbox' || type === 'radio'))
            ? e.target.checked
            : value;

        formik.setFieldValue(name, val);
        setChangedMap(prev => ({ ...prev, [name]: true }));
    };

    return { formik, focusMap, changedMap, handleFocus, handleBlur, handleChange };
};