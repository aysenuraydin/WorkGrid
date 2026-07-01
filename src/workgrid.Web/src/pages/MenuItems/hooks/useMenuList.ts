import { MenuItem } from "common/data/menuItem";
import { useGetDeletedMenuItems, useGetMenuItems } from "hooks/useMenuItems";
import { useEffect, useState } from "react"; 

export const useMenuList = () => {
    const [menuItemList, setDatamenuItems] = useState<MenuItem[]>([]);
    const [deletedMenuItemList, setDeletedDatamenuItems] = useState<MenuItem[]>([]);
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
    const { 
        data: menuItems, 
        isLoading: isMenuItemsLoading, 
        error:menuItemsError 
    } = useGetMenuItems();
    const { 
        data: deletedMenuItems, 
        isLoading: isDeletedMenuItemsLoading, 
        error:deletedMenuItemsError 
    } = useGetDeletedMenuItems();

    useEffect(() => {
        setDatamenuItems(menuItems?.data || []);
    }, [menuItems]);

    useEffect(() => {
        setDeletedDatamenuItems(deletedMenuItems?.data || []);
    }, [deletedMenuItems]);

    return { 
        menuItems, 
        isMenuItemsLoading, 
        menuItemsError, 
        openMenus, 
        setOpenMenus, 

        menuItemList,
        setDatamenuItems,
        deletedMenuItemList, 
        setDeletedDatamenuItems, 
        isDeletedMenuItemsLoading,
        deletedMenuItemsError
    };
}; 