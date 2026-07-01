import { MenuItem } from "common/data/menuItem";
import { DataType } from "common/enums/DataType";
import { useState } from "react";

export const useMenuModals = () => {
    const [menuItem, setMenuItem] = useState<MenuItem | null>();
    const [divider, setDivider] = useState<MenuItem | null>();
    const [deleteItems, setDeleteItem] = useState<MenuItem>();
    
    const [modalType, setModalType] = useState<DataType>(DataType.Create);
    const [itemModal, setItemModal] = useState(false);
    const [dividerModal, setDividerModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false); 

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);


    const toggleItemModal = () => setItemModal(prev => !prev);
    const toggleDividerModal = () => setDividerModal(prev => !prev);


    return {
        state: { menuItem, divider, deleteItems, modalType, itemModal, dividerModal, deleteModal, isExportCSV },
        actions: { 
            setMenuItem, setDivider, setDeleteItem, setModalType, 
            setItemModal, setDividerModal, setDeleteModal,
            toggleItemModal, toggleDividerModal , setIsExportCSV
        }
    };
};