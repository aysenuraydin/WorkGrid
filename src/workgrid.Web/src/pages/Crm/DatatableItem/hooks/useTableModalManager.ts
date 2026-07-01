import { Datatable } from "common/data/Datatable";
import { DataType } from "common/enums/DataType";
import { useEffect } from "react";

export const useTableModalManager = (
  modalType: DataType,
  modal: boolean, 
  setModal: React.Dispatch<React.SetStateAction<boolean>>, 
  setTableItem: React.Dispatch<React.SetStateAction<Datatable | undefined>>
) => {  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (modal) setModal(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [modal]);
  useEffect(() => {
      if(modalType ==DataType.Create){
        setTableItem({} as Datatable)
      }
  }, [modalType]);    
}; 