import { DataType } from "common/enums/DataType";
import { useFormik } from "formik";
import { useCreateMenuItem, useUpdateMenuItem } from "hooks/useMenuItems";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const useMenuItemForm = (item: any, type: DataType, toggle: () => void, setItem: any) => {
    const { mutate: updateMenuItemMutation } = useUpdateMenuItem(); 
    const { mutate: createMenuItemMutation } = useCreateMenuItem(); 

    const formik = useFormik({ 
      enableReinitialize: true,
      initialValues: {
        id: item?.id || 0,
        label: item?.label || "",
        link: item?.link || "",
        icon: item?.icon || "ri-circle-line",
        visible: item?.visible ?? false,
        isAdmin: item?.isAdmin ?? false,
        isHeader: item?.isHeader ?? false,
        order: item?.order || 0,
        parentId: item?.parentId ?? null,
        locked: item?.locked ?? false,
        badgeName: item?.badgeName || "",
        badgeColor: item?.badgeColor || "",
      },
      validationSchema: Yup.object({
        label: Yup.string().required("Please enter a menu label"),
      }),
      onSubmit: async(values) => {
        const mutation = type === DataType.Edit ? updateMenuItemMutation : createMenuItemMutation;
        const message = type === DataType.Edit ? 'updated' : 'created';

        await mutation({ ...values, id: item?.id }, {
            onSuccess: () => {
                toast.success(`Menu Item ${message} successfully!`);
                toggle(); 
                formik.resetForm();
            },
            onError: () => toast.error(`Menu Item could not be ${message}!`)
        });
      },
    });

    useEffect(() => {
      if (formik.values.parentId) {
        formik.setFieldValue("badgeName", "");
        formik.setFieldValue("badgeColor", "");
        formik.setFieldValue("icon", "");
      }
    }, [formik.values.parentId]);

    useEffect(() => {
        if (type === DataType.Create) {
          formik.resetForm();
          setItem({});
        }
    }, [type, setItem]);

    return formik;
};  