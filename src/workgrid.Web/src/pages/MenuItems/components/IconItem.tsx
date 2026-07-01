import React from "react";
import { DropdownItem } from "reactstrap";
import "../MenuItems.css";
export const IconItem = React.memo(({ icon, onSelect }: { icon: string, onSelect: (i: string) => void }) => (
    <DropdownItem
        className="p-2 d-flex justify-content-center align-items-center rounded icon-item-hover"
        onClick={() => onSelect(icon)}
        style={{ cursor: "pointer", width: "36px", height: "36px" }}
    >
        <i className={`${icon} fs-5`}></i>
    </DropdownItem>
));