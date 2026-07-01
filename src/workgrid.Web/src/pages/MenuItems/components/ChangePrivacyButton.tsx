import { MenuItem } from "common/data/menuItem";
import { useChangePrivacyMenuItem } from "hooks/useMenuItems";
import { toast } from "react-toastify";
import "../MenuItems.css";

export const ChangePrivacyButton = ({ item }: { item: MenuItem }) => { 
    const { mutate: changePrivacyMenuItemMutation } = useChangePrivacyMenuItem();
    
    const changePrivacyItem = async () => {
        await changePrivacyMenuItemMutation(
            {
                id: item?.id, 
                isAdmin: !item?.isAdmin
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
            onClick={changePrivacyItem}
            className={`hoverIcon d-none fs-14 ${item?.isAdmin ? "ri-shield-user-line text-secondary" : "ri-user-line text-primary"}`}
            title={item?.isAdmin ? "Admine Özel" : "Herkese Açık"}
        ></i>
        </span>
    );
};