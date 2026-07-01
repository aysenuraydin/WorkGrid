import { Link } from 'react-router-dom'; 
import { ShowOrHideToggle } from './ShowOrHideToggle';
import { DoMove } from './DoMove';
import { EditPanel } from './EditPanel';
import { ChildMenuList } from './ChildMenuList'; 
import { useMenu } from 'context/MenuContext'; 
import "../MenuItems.css" 

export const ParentMenuItem = ({ item }: { item: any}) => { 
    const { openMenus,  isMove } = useMenu();
    const isMoveActive = !!isMove[item.id]?.active;
    const hasChildren = item?.children?.length > 0;
    const shouldRender = item.parentId === null || item?.isOrphan; 

    return (
        <ul
            style={{ backgroundColor: "rgba(var(--vz-primary-rgb), 0.1)" }}
            className={`list-unstyled mt-2 p-3 ps-5 rounded shadow border ${isMoveActive ? "border-2 border-primary shadow-lg" : ""} `}
        >
            {shouldRender && ( 
                <li className="p-0 parent-title d-flex gap-2">
                    {hasChildren
                        ? <ShowOrHideToggle onClick={item.click} isOpen={!!openMenus[item.id]} />
                        : <div style={{ width: "9px" }} />
                    }
                    <Link
                        to={item.link || "#"}
                        onClick={(e) => e.preventDefault()}
                        style={{ position: "relative" }}
                        className={`fw-medium fs-18 d-flex justify-content-between w-100 itemStyle`}
                    >
                        <div className="d-flex">
                            {isMoveActive && <DoMove id={item.id} />}
                            {item.icon && <i className={`${item.icon} me-1 align-bottom`} />}
                            <span className={`${!item.visible ? "text-decoration-line-through" : ""} ${item.isAdmin ? "text-secondary" : ""}`} >
                                {item.label}
                            </span>
                            {!!item.locked && <i className="ri-lock-2-fill ms-2" />}
                        </div>
                        <div className="d-flex">
                            {!item.locked && (
                                <div className="mt-1">
                                    <EditPanel item={item} />
                                </div>
                            )}
                        </div>
                    </Link>
                </li>
            )}
            {openMenus[item.id] && hasChildren && (
                <ChildMenuList item={item} level={0} />
            )} 
        </ul>
    );
}; 