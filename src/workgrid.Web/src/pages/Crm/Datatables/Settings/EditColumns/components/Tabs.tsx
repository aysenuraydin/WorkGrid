import { Nav, NavItem, NavLink } from 'reactstrap';
import { useTableColumn } from 'context/TableColumnContext';

export const Tabs = ({ }) => {
    const {
        isAllDatas,
        setIsAllDatas,
    } = useTableColumn();

    return (
        <Nav className="nav-tabs nav-tabs-custom nav-primary px-3" role="tablist">
            <NavItem>
                <NavLink 
                    active={isAllDatas === 1} 
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsAllDatas(1)}
                >
                    <i className='ri-grid-line'></i>{" "}
                    Tüm Sütunlar
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink 
                    active={isAllDatas === 2} 
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsAllDatas(2)}
                >
                    <i className='ri-delete-bin-line'></i>{" "}
                    Silinen Sütunlar
                </NavLink>
            </NavItem>

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
    )
}