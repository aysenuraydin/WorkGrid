import { MenuItem } from "common/data/menuItem";
import { DataType } from "common/enums/DataType";
import { Dispatch, SetStateAction } from "react";

export interface MenuContextType { 
    // useMenuList'ten gelenler 
    isDeletedMenuItemsLoading:boolean; 
    isAllDatas:boolean; 
    setIsAllDatas: React.Dispatch<React.SetStateAction<boolean>>;
    menuItemList: MenuItem[];
    setDatamenuItems: Dispatch<SetStateAction<MenuItem[]>>;
    deletedMenuItemList: MenuItem[];
    setDeletedDatamenuItems: Dispatch<SetStateAction<MenuItem[]>>;
    openMenus: { [key: string]: boolean };
    setOpenMenus: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
    isMenuItemsLoading: boolean;
    menuItemsError: any;   
    deletedMenuItemsError: any;  
    menuItems: any; 

    // useMenuModals'tan gelenler
    state: {
        menuItem: MenuItem | null | undefined;
        divider: MenuItem | null | undefined;
        deleteItems: MenuItem | undefined;
        modalType: DataType;
        itemModal: boolean;
        dividerModal: boolean;
        deleteModal: boolean;
        isExportCSV: boolean;
    };
    actions: {
        setMenuItem: Dispatch<SetStateAction<MenuItem | null | undefined>>;
        setDivider: Dispatch<SetStateAction<MenuItem | null | undefined>>;
        setDeleteItem: Dispatch<SetStateAction<MenuItem | undefined>>;
        setModalType: Dispatch<SetStateAction<DataType>>;
        setItemModal: Dispatch<SetStateAction<boolean>>;
        setDividerModal: Dispatch<SetStateAction<boolean>>;
        setDeleteModal: Dispatch<SetStateAction<boolean>>;
        toggleItemModal: () => void;
        toggleDividerModal: () => void;
        setIsExportCSV: Dispatch<SetStateAction<boolean>>;
    };

    // useMenuOrder'dan gelenler - DOĞRULANMIŞ TİPLER
    isMove: { [key: string]: { active: boolean; initialOrder: number } };  
    setIsMove: Dispatch<SetStateAction<{ [key: string]: { active: boolean; initialOrder: number } }>>;
    moveUp: (id: number) => void;
    moveDown: (id: number) => void;
    resetOrder: (id: number, initialOrder: number) => void; 
}