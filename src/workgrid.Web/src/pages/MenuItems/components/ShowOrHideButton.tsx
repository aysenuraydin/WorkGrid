import { MenuItem } from "common/data/menuItem";
import { useShowOrHideMenuItem } from "hooks/useMenuItems";
import { toast } from "react-toastify";
import "../MenuItems.css";

export const ShowOrHideButton = ({ item }: { item: MenuItem }) => { 
    const { mutate: showOrHideMenuItemMutation } = useShowOrHideMenuItem();
    
    const showOrHideItem = async () => {
        await showOrHideMenuItemMutation(
            {
                id: item?.id, 
                visible: !item?.visible
            }, 
            {
                onSuccess: () => toast.success('Menü öğesi durumu güncellendi!'),
                onError: () => toast.error('Menü öğesi güncellenemedi!')
            }
        ); 
    };

    return (
        <span>
            <i 
            onClick={showOrHideItem}
            className={`hoverIcon d-none fs-14 ${item?.visible ? "ri-eye-off-fill" : "ri-eye-fill text-primary"}`}
            style={{ cursor: 'pointer' }}
            title={item?.visible ? "Gizle" : "Göster"}
        ></i>
        </span>
    );
};