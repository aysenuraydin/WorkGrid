import { useDeleteMenuItem, useHardDeleteMenuItem } from "hooks/useMenuItems";
import { toast } from "react-toastify";

export const useDeleteItem = (isHard?:boolean) => {
    const { mutate: deleteItemMutation } = useDeleteMenuItem();
    const { mutate: deleteHardItemMutation } = useHardDeleteMenuItem();
    const activeMutation = isHard ? deleteHardItemMutation : deleteItemMutation;

    const deleteItem = async(itemId: number) => {
        await activeMutation(itemId, {
            onSuccess: () => {
                toast.success("Items deleted!"); 
            },
            onError: (error) => { 
                toast.error("Items could not be deleted!");
                console.error(error);
            }
        });
    };
    return { deleteItem };
}; 