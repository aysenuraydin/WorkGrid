import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
} from "reactstrap";
import { icons } from "common/data/icons";
import { useCallback, useMemo, useState } from "react"; 
import {ICON_MENU_STYLE } from "styled/iconMenu";
import { IconItem } from "./IconItem";
import "../MenuItems.css";
export const IconDropdown = ({ selectedIcon, onSelect, disabled }: { selectedIcon?: string; onSelect: (icon: string) => void, disabled:boolean }) => {
    const [open, setOpen] = useState(false); 

    const handleSelect = useCallback((icon: string) => {
        onSelect(icon);
        setOpen(false);
    }, [onSelect]);

    const iconList = useMemo(() => icons.map((icon) => (
        <IconItem key={icon} icon={icon} onSelect={handleSelect} />
    )), [handleSelect]); 
    return (
        <UncontrolledDropdown toggle={() => setOpen(!open)}>
        <DropdownToggle
            className="p-0 text-reset dropdown-btn d-flex align-items-center gap-2"
            tag="a"
            role="button"
            disabled={disabled}
        >
            <span 
            style={{border:"1px solid #b1b1b196", padding:"5px"}}
            className="rounded">
                {selectedIcon ? (
            <i className={`${selectedIcon} fs-5`}></i>
            ) : (
            <span className="text-muted">--</span>
            )}
            <i className="mdi mdi-chevron-down ms-1 text-muted"></i>
            </span>
        </DropdownToggle>

        <DropdownMenu
            className={`dropdown-menu-end p-2 border ${!open ?"d-none":""}`}
            style={ICON_MENU_STYLE}
        >
            {iconList} 
        </DropdownMenu> 
        </UncontrolledDropdown>
    );
};


