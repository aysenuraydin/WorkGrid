import { MenuProvider } from "context/MenuContext";   
import { MenuItems } from "./components/MenuItems";
import "./MenuItems.css";

export const MainMenuItems = () => { 
    return (
        <MenuProvider>
            <MenuItems />
        </MenuProvider>
    );
}