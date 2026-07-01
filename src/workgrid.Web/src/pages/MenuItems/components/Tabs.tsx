import { Nav, NavItem, NavLink } from 'reactstrap' 
import { useMenu } from 'context/MenuContext';

export const Tabs = () => { 
    const {     
        isAllDatas, 
        setIsAllDatas,      
    } = useMenu();  
        
    return (
        <Nav className="nav-tabs nav-tabs-custom nav-primary px-3 my-1" role="tablist">
            <NavItem>
                <NavLink 
                    active={isAllDatas} 
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsAllDatas(true)}
                >
                    <i className='ri-list-check'></i>{" "}
                    Menü Öğeleri
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink 
                    active={!isAllDatas} 
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsAllDatas(false)}
                >
                    <i className='ri-delete-bin-line'></i>{" "}
                    Silinen Öğeler
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