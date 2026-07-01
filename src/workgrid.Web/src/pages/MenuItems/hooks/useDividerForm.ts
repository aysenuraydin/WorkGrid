
import { DataType } from "common/enums/DataType";
import { useFormik } from "formik";
import { useCreateDivider, useUpdateDivider } from "hooks/useMenuItems";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const useDividerForm = (item: any, type: DataType, toggle: () => void, setItem: any) => {
  const { mutate: updateDividerMutation } = useUpdateDivider(); 
  const { mutate: createDividerMutation } = useCreateDivider(); 

    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        id: item?.id || 0,
        label: item?.label || "",
        visible: item?.visible ?? false,
        isAdmin: item?.isAdmin ?? false,
        locked:item?.locked ?? false,
        isHeader: item?.isHeader ?? true,
      },
      validationSchema: Yup.object({
        label: Yup.string().required("Please enter a menu label"),
      }),
      onSubmit: async(values) => {
        console.log("values",values)
            if (type === DataType.Edit) { 
              await updateDividerMutation({ ...values, id: item?.id }, {
                  onSuccess: () => {
                    toast.success('Divider uptaded successfully!');
                    toggle(); 
                    formik.resetForm();
                  },
                  onError: () => toast.error('Divider could not be updated!')
              });
            }
      
            if (type === DataType.Create) { 
              await createDividerMutation({ ...values }, {
                  onSuccess: () => {
                    toast.success('Divider created successfully!'); 
                    toggle(); 
                    formik.resetForm();
                  },
                  onError: () => toast.error('Divider could not be updated!')
              }); 
            }
          },
    });

    useEffect(() => {
        if (type === DataType.Create) {
          formik.resetForm();
          setItem({});
        }
    }, [type]);
  

    return formik;
}; 