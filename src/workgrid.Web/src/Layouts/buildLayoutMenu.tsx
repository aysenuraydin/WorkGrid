import { MenuItem } from 'common/data/menuItem';

export const buildLayoutMenu = (menuItemList: MenuItem[], openMenus:any, setOpenMenus:any): any[] => {
    // Ana menü (parent)
    const parentList: MenuItem[] = (menuItemList ?? [])
        .filter(item => item.parentId === null)
        .map(item => ({
            ...item,
            link: item.link && item.link !== "/" ? item.link : undefined,
            stateVariables: openMenus[item.id] || false,
            click: (e: any) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenMenus((prev:any) => ({ ...prev, [item.id]: !prev[item.id] }));
            },
        }));

    // Diğer öğeler
    // (Array.isArray(menuItemList) ? menuItemList : [])
    (menuItemList ?? [])
        .filter(item => item.parentId !== null)
        .forEach((item: any) => {
            const parent = parentList.find(p => p.id === item.parentId);
            if (!parent) return []; 
            if (!(parent as any).subItems) (parent as any).subItems = [];

            const newSubItem: MenuItem = {
                ...item,
                link: item.link && item.link !== "/" ? item.link : undefined,
                stateVariables: openMenus[item.id] || false,
                childItems: [],
                click: (e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenus((prev:any) => ({ ...prev, [item.id]: !prev[item.id] }));
                },
            };
            (parent as any).subItems.push(newSubItem);
        });

    // Alt öğelere child ekle (recursive)
    const addChildren = (items: any[]) => {
        items.forEach((item: any) => {
            if (!item.childItems) item.childItems = [];

            const children: any[] = (menuItemList ?? [])
                .filter(i => i.parentId === item.id)
                .map(child => ({
                    ...child,
                    link: child.link && child.link !== "/" ? child.link : undefined,
                    stateVariables: openMenus[child.id] || false,
                    childItems: [],
                    click: (e: any) => {
                        e.preventDefault();
                        setOpenMenus((prev:any) => ({
                            ...prev,
                            [child.id]: !prev[child.id],
                        }));
                    },
                }));

            item.childItems.push(...children);

            // isChildItem kontrolü
            item.isChildItem = (item.childItems.length > 0);

            // Recursive olarak alt çocukları ekle
            if (children.length > 0) addChildren(children);
            else {
                // childItems yoksa property’yi sil
                delete item.childItems;
            }

            // subItems boşsa sil
            if (item.subItems && item.subItems.length === 0) {
                delete item.subItems;
            }
        });
    };

    parentList.forEach((item: any) => {
        if (item.subItems) addChildren(item.subItems);
    });

    var list = [
        ...parentList?.filter(x=> !x.isHeader),
        ...menuItemList?.filter(x=>x.isHeader)
        ]
        .sort(
        (a, b) =>
            (a.order ?? Number.MAX_SAFE_INTEGER) -
            (b.order ?? Number.MAX_SAFE_INTEGER)
        );

    return list;
};