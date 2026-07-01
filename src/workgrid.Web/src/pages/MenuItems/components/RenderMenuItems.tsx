import { HeaderMenuItem } from "./HeaderMenuItem";
import { ParentMenuItem } from "./ParentMenuItem";
import "../MenuItems.css";
export const RenderMenuItems = ({ nestedMenu }: { nestedMenu: any[];}) => {  
    return (
        <div className={`p-3 px-4`}>
            {nestedMenu?.map((item, index) => (
                <div key={`${item.id}+${index}`}>
                    {item.isHeader ? (
                        <HeaderMenuItem item={item}/>
                    ) : (
                        <ParentMenuItem item={item} />
                    )}
                </div>
            ))} 
            <style>{`
                .hoverArrow:hover {
                    cursor: pointer;
                    transform: scale(1.3);
                    transition: transform 0.2s ease;
                }
                .hoverColor:hover {
                    color: white !important;
                }
            `}
            </style>
        </div>
    );
}; 

