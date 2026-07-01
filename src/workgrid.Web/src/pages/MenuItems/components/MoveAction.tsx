import { useMenu } from 'context/MenuContext';
import { useChangeMenuItemOrder } from 'hooks/useMenuItems';
import { toast } from 'react-toastify';
import "../MenuItems.css";
export const MoveAction = ({ item }: {item:any}) => {
    const { mutate: changeMenuItemOrderMutation } = useChangeMenuItemOrder();

    const {  
        isMove,
        setIsMove,  
        resetOrder,  
    } = useMenu();   

    const confirmOrder = async () => {
        await changeMenuItemOrderMutation(
            { id: item?.id, order: item.order },
            {
                onSuccess: () => {
                    toast.success("Sıralama başarıyla güncellendi!");
                    setIsMove((prev: any) => ({
                        ...prev,
                        [item.id]: { 
                            active: !prev[item.id]?.active, 
                            initialOrder: prev[item.id]?.initialOrder ?? item.order 
                        },
                    }));
                },
                onError: () => {
                    toast.error("Sıralama güncellenemedi!");
                },
            }
        );
    };

    return (
        <div>
            <i
                className="ms-3 btn btn-sm btn-soft-primary ri-check-line fs-14 text-primary hoverColor"
                style={{ width: "23px", height: "23px", padding: 0 }}
                onClick={confirmOrder}
            />
            <i
                className="ri-close-line btn btn-sm btn-soft-danger fs-14 text-danger hoverColor"
                style={{ width: "23px", height: "23px", padding: 0 }}
                onClick={() => resetOrder(item.id, isMove[item.id]?.initialOrder)}
            />
        </div>
    );
}; 
