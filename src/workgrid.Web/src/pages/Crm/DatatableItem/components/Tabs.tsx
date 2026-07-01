import { Nav, NavItem, NavLink } from 'reactstrap';
import { useDataTableItem } from 'context/DatatableItemContext';
import { canDeleteTable, getTableLabel, isLockControl } from 'common/data/constans';
import { useAuth } from 'context/AuthContext';
import { useUserProfile } from 'hooks/useUser';

export const Tabs = () => { 
    const {     
        table,
        isAllDatas, 
        setIsAllDatas,      
    } = useDataTableItem();  

    const { user: usr } = useAuth(); 
    const { data: user } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("WG") || user?.roles?.includes("Admin");
    
    const tableName = getTableLabel(table?.name) || "Kayıtlar";
    return (
        <Nav className="nav-tabs nav-tabs-custom nav-primary px-3" role="tablist">
            <NavItem>
                <NavLink 
                    active={isAllDatas === 1} 
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsAllDatas(1)}
                >
                    <i className='ri-list-check'></i>{" "}
                    Tüm {tableName}
                </NavLink>
            </NavItem>
            {((!isLockControl(table?.name??"") || canDeleteTable(table?.name??"")) && isAdmin ) &&
                <NavItem>
                    <NavLink 
                        active={isAllDatas === 2} 
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsAllDatas(2)}
                    >
                        <i className='ri-delete-bin-line'></i>{" "}
                        Silinen {tableName}
                    </NavLink>
                </NavItem> 
            }
            <style>
                {`
                .icon-size {
                    font-size: 25px !important;
                    position: absolute;
                    top: -1px;
                }
                `}
            </style>
        </Nav>
    );
};