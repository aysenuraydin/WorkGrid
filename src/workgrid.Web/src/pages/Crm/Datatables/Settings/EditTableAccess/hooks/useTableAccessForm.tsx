import { AccessLevel } from "common/data/Datatable";
import { useDataTable } from "context/DatatableContext";
import { useFormik } from "formik";
import { useGetTableAccess, useUptadeTableAccess } from "hooks/useDatatables";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export interface ITableAccessFormValues {
    id: number | string | undefined;
    readAccess: string;
    writeAccess: string;
    readRequiredRole: string[];
    writeRequiredRole: string[];
}
export interface TableAccessResponse {
    id: number;
    readAccess: AccessLevel;
    writeAccess: AccessLevel;
    readRequiredRole?: string | null;
    writeRequiredRole?: string | null;
    isOwnerScoped: boolean;
    ownerColumn?: string | null;
}

const toRoleArray = (val: any): string[] =>
    Array.isArray(val)
        ? val
        : (val ? String(val).split(",").map(s => s.trim()).filter(Boolean) : []);

export const useTableAccessForm = () => {
    const { modal } = useDataTable();
    const {  data: table } = useGetTableAccess(modal?.table?.id);
    const [focusMap, setFocusMap] = useState<Record<string, boolean>>({});
    const [changedMap, setChangedMap] = useState<Record<string, boolean>>({});

    const { mutate: setTableAccessMutation } = useUptadeTableAccess(); 

    const extractApiMessage = (err: any, fallback: string): string => {
        const data = err?.response?.data;
        if (typeof data === "string" && data?.trim()) return data;
        if (data?.message) return data.message;
        if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors[0];
        if (err?.message) return err.message;
        return fallback;
    };
    const initialValues: ITableAccessFormValues = useMemo(() => ({
        id: table?.id,
        readAccess: table?.readAccess ?? AccessLevel.Public,
        writeAccess: table?.writeAccess ?? AccessLevel.Public,
        readRequiredRole: toRoleArray(table?.readRequiredRole ?? "Admin"),
        writeRequiredRole: toRoleArray(table?.writeRequiredRole ?? "Admin"),
    }), [table]);

    const formik = useFormik<ITableAccessFormValues>({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            readAccess: Yup.string().required("Lütfen okuma erişimini seçiniz"),
            writeAccess: Yup.string().required("Lütfen yazma erişimini seçiniz"),
            readRequiredRole: Yup.array().of(Yup.string()).when("readAccess", {
                is: (read: string) => read === AccessLevel.RoleBased,
                then: (schema) => schema.min(1, "RoleBased okuma için en az bir rol seçiniz"),
                otherwise: (schema) => schema.notRequired(),
            }),
            writeRequiredRole: Yup.array().of(Yup.string()).when("writeAccess", {
                is: (write: string) => write === AccessLevel.RoleBased,
                then: (schema) => schema.min(1, "RoleBased yazma için en az bir rol seçiniz"),
                otherwise: (schema) => schema.notRequired(),
            }),
        }),
        onSubmit: async (values) => {
            const readRoles = Array.isArray(values.readRequiredRole) ? values.readRequiredRole : [];
            const writeRoles = Array.isArray(values.writeRequiredRole) ? values.writeRequiredRole : [];

            setTableAccessMutation({
                id: Number(table?.id ?? 0),
                readAccess: values.readAccess as AccessLevel,
                writeAccess: values.writeAccess as AccessLevel,
                readRequiredRole:
                    values.readAccess === AccessLevel.RoleBased && readRoles.length > 0
                        ? readRoles.join(",")
                        : null,
                writeRequiredRole:
                    values.writeAccess === AccessLevel.RoleBased && writeRoles.length > 0
                        ? writeRoles.join(",")
                        : null,
            }, {
                onSuccess: (res: any) => {
                    if (res && res.succeeded === false) {
                        const msg = res.message || "Erişim ayarları kaydedilemedi!";
                        toast.error(msg);
                        formik.setFieldError("readRequiredRole", msg);
                        return;
                    }
                    toast.success("Erişim ayarları güncellendi!");
                },
                onError: (err: any) => {
                    const msg = extractApiMessage(err, "Erişim ayarları kaydedilirken bir hata oluştu!");
                    toast.error(msg);
                    formik.setFieldError("readRequiredRole", msg);
                    formik.setFieldTouched("readRequiredRole", true, false);
                },
            });
        },
    });

    useEffect(() => {
        setFocusMap({});
        setChangedMap({});
    }, [table]);

    const handleFocus = (e: React.FocusEvent<any>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleBlur = (e: React.FocusEvent<any>) => {
        setFocusMap(prev => ({ ...prev, [e.target.name]: false }));
        formik.handleBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        formik.setFieldValue(name, value);
        setChangedMap(prev => ({ ...prev, [name]: true }));
    };

    return { formik, focusMap, changedMap, handleFocus, handleBlur, handleChange };
};