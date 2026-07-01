import { ChildItem } from "./ChildItem";
import "../MenuItems.css";
export const ChildMenuList = ({
    item,
    level = 0, 
}: {item: any; level?: number}) => {
    
    const sorted = [...(item?.children ?? [])].sort((a: any, b: any) => a.order - b.order);

    const listClass =
        level === 0 ? undefined :
        level === 1 ? "second-list list-unstyled" :
        "third-list list-unstyled";

    const Wrapper = level === 0 ? 'li' : 'ul';

    return (
        <Wrapper className={listClass}>
            {sorted.map((child: any) => (
                <ChildItem
                    key={child.id}
                    child={child}
                    level={level} 
                />
            ))}
        </Wrapper>
    );
};
