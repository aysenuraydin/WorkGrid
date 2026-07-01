import { Link } from "react-router-dom";
import { DoMove } from "./DoMove";
import { ShowOrHideToggle } from "./ShowOrHideToggle";
import { EditPanel } from "./EditPanel";
import { ChildMenuList } from "./ChildMenuList";
import { useMenu } from "context/MenuContext";
import "../MenuItems.css";

const getLinkColor = (level: number) => level > 0 ? "gray" : undefined;

export const ChildItem = ({ child, level }: any) => {
    const { openMenus, isMove } = useMenu();

    const hasChildren = child?.children?.length > 0;
    const isActive = !!isMove[child.id]?.active;
    const color = getLinkColor(level);

    return (
        <div className={level === 0 ? "first-list" : undefined} key={child.id}>
            <div className={level === 0 ? "list-wrap" : undefined}>
                <Link
                    to={child.link || "#"}
                    className={`fw-medium ${level === 0 ? "text-primary" : ""} d-inline-block fs-14 w-100 borderNone`}
                    style={color ? { color } : undefined}
                    onClick={(e) => e.preventDefault()}
                >
                    <div className="item-style w-100 d-flex gap-2" style={{ position: "relative" }}>
                        {isActive && <DoMove id={child.id} />}
                        {hasChildren
                            ? <ShowOrHideToggle onClick={child.click} isOpen={!!openMenus[child.id]} />
                            : <div style={{ width: "7px" }} />
                        }
                        {child.icon && <i className={`${child.icon} me-1 align-bottom`} />}
                        <span
                            className={`text-nowrap ${!child.visible ? "text-decoration-line-through" : ""} ${!child.isAdmin ? "text-danger" : ""}`}
                            style={{ color: !child.visible ? "gray" : "" }}
                        >
                            {child.label}
                            {!!child.locked && <i className="ri-lock-2-fill ms-2" />}
                        </span>
                        {!child.locked && (
                            <div className="flex-grow-1 d-flex justify-content-end">
                                <EditPanel item={child}/>
                            </div>
                        )}
                    </div>
                </Link>
            </div>
            {openMenus[child.id] && (
                <ChildMenuList item={child} level={level + 1} />
            )}
        </div>
    );
};  