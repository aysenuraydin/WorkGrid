import { useMenu } from "context/MenuContext";
import { DoMove } from "./DoMove";
import { EditPanel } from "./EditPanel";
import "../MenuItems.css";
export const HeaderMenuItem = ({ item}: { item: any }) => {

    const {  isMove } = useMenu();
    
    return(
        <div className="d-flex">
            <div
                className={`divider p-1 mb-4 m-1 text-primary d-flex justify-content-between border-bottom border-${item.isAdmin ? "secondary" : "primary"} w-100`}
                style={{ color: !item.visible ? "#00000020" : "", position: "relative" }}
            >
                {!!isMove[item.id]?.active && (
                    <DoMove id={item.id} left="3px" top="-1px" />
                )}
                <span
                    className={`text-uppercase ${!item.visible ? "text-decoration-line-through" : ""} ${item.isAdmin ? "text-secondary" : ""}`}
                    style={{ paddingLeft: "85px" }}
                >
                    {item.label}
                    {!!item.locked && <i className="ri-lock-2-fill ms-2" />}
                </span>
                <span className="d-flex" style={{ marginRight: "14px" }}>
                    {!item.locked && (
                        <EditPanel item={item} />
                    )}
                </span>
            </div>
        </div>
    )
}