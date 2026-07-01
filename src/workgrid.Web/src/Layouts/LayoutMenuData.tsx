import React, { useEffect, useState } from "react"; 

import { MenuItem } from "common/data/menuItem";
import { buildLayoutMenu } from "./buildLayoutMenu";
import { useGetMenuItems } from "hooks/useMenuItems";
import { useUserProfile } from "hooks/useUser";
import { useAuth } from "context/AuthContext";

const Navdata = () => { 
    const { user: usr } = useAuth(); 
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
    const isCanSee = user?.roles?.includes("Admin") || user?.roles?.includes("WG");
    const { data: menuItems, isLoading: isMenuItemsLoading, error:menuItemsError } = useGetMenuItems();  

    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
    const [menuItemList, setDatamenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        if(menuItems?.data) {
            const list = isCanSee 
                ? menuItems?.data 
                : menuItems?.data.filter((x:MenuItem)=>!x.isAdmin);
            setDatamenuItems(list)
        };
    }, [menuItems, isCanSee]);

    const items = React.useMemo(
        () => buildLayoutMenu(
            (menuItemList ?? [])
            .filter((x:MenuItem)=>x.visible)
            ?? [], 
            openMenus, 
            setOpenMenus
        ),
        [menuItemList, openMenus, user]
    );

    return <React.Fragment>{items}</React.Fragment>;
};
export default Navdata;




