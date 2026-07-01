import { useGetTable } from "hooks/useDatatables";
import { useDeleteBulkTableRow, useHardDeleteBulkTableRow } from "hooks/useTableRows";
import { useState } from "react";
import { toast } from "react-toastify";

export const useTableOperations = (
  selectedCheckBoxDelete:any, 
  setIsMultiDeleteButton: React.Dispatch<React.SetStateAction<boolean>>,  
  isAllDatas: number, 
  id: number
) => { 
  const [deleteModalMulti, setTableDeleteModalMulti] = useState<boolean>(false);   
  const { data: datatable } = useGetTable(Number(id));
  const { mutate: deleteBulkTableRowMutation } = useDeleteBulkTableRow(); 
  const { mutate: hardDeleteBulkTableRowMutation } = useHardDeleteBulkTableRow(); 
  
  const deleteTableMultiple = () => {
    const checkall: any = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element: any) => { 
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  }; 
  const deleteCheckedRow = async () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(".checkBox:checked");
    const ids = Array.from(checkboxes).map(cb => Number(cb.value));

    if (ids.length === 0) {
      toast.warning("Lütfen silmek için en az bir tablo seçin!");
      return;
    } 

    if(isAllDatas!=1){
      await hardDeleteBulkTableRowMutation({ids:ids, tableId:datatable?.data?.id??0}, {
          onSuccess: () => toast.success(`${ids.length} tablo başarıyla kalıcı olarak silindi!`),
          onError: () =>  {
            toast.error("Hiçbir tablo silinemedi!");
            document.querySelectorAll<HTMLInputElement>(".checkBox:checked")
              .forEach(cb => cb.checked = false);
          }
      });  
    }else { 
      await deleteBulkTableRowMutation({ids:ids, tableId:datatable?.data?.id??0}, {
          onSuccess: () => toast.success(`${ids.length} tablo başarıyla silindi!`),
          onError: () =>  {
            toast.error("Hiçbir tablo silinemedi!");
            document.querySelectorAll<HTMLInputElement>(".checkBox:checked")
              .forEach(cb => cb.checked = false);
          }
      });  
    } 
  };  

  return {
    deleteModalMulti, 
    deleteTableMultiple,
    setTableDeleteModalMulti,
    deleteCheckedRow
  };
};