import "../MenuItems.css";
interface MenuItemLabelProps {
    label: string;
    visible: boolean;
    isAdmin: boolean;
    locked: boolean;
    icon?: string;
} 
export const MenuItemLabel = ({ label, visible, locked, icon, isAdmin }: MenuItemLabelProps) => (
    <div className="d-flex">
        {icon && <i className={`${icon} me-1 align-bottom`} />}
        <span className={`${!visible ? "text-decoration-line-through" : ""} ${isAdmin ? "text-danger" : ""}`}>
            {label}
        </span>
        {!!locked && <i className="ri-lock-2-fill ms-2" />}
    </div>
);
