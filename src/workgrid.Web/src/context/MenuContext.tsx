import React, { createContext, useContext } from 'react';
import { MenuContextType } from 'components/Common/interfaces/MenuContextType';

const MenuContext = createContext<MenuContextType>({} as MenuContextType); 
export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    // 🔒 Hidden. useMenuList/useMenuModals/useMenuOrder + yerel state birleştirilir.
    throw new Error("Source available on request.");
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) throw new Error("useMenu sadece MenuProvider içinde kullanılabilir!");
    return context;
};