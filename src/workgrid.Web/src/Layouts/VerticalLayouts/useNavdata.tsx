import React, { useEffect, useState } from "react";
import { MenuItem } from "common/data/menuItem";
import { useGetMenuItems } from "hooks/useMenuItems";
import { useUserProfile } from "hooks/useUser";
import { useAuth } from "context/AuthContext";
import { buildLayoutMenu } from "Layouts/buildLayoutMenu";

/**
 * Menü verisini hook olarak döndürür.
 * ÖNEMLİ: Artık <Navdata/> diye render etmiyoruz, navdata() diye de çağırmıyoruz.
 * Bunun yerine layout component'leri içinde: const items = useNavdata();
 */
export const useNavdata = (): any[] => {
    const { user: usr } = useAuth();
    const { data: user } = useUserProfile(usr?.id ?? "");
    const isCanSee =
        user?.roles?.includes("Admin") || user?.roles?.includes("WG");
    const { data: menuItems } = useGetMenuItems();

    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
    const [menuItemList, setDatamenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        if (menuItems?.data) {
            const list = isCanSee
                ? menuItems.data
                : menuItems.data.filter((x: MenuItem) => !x.isAdmin);
            setDatamenuItems(list);
        }
    }, [menuItems, isCanSee]);

    const items = React.useMemo(
        () =>
            buildLayoutMenu(
                (menuItemList ?? []).filter((x: MenuItem) => x.visible) ?? [],
                openMenus,
                setOpenMenus
            ),
        [menuItemList, openMenus]
    );

    return items;
};

export default useNavdata;