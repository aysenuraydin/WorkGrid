import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    deleteMenuItemById,
    getMenuItems,
    createMenuItem,
    createDivider,
    updateMenuItem,
    updateDivider,
    showOrHideMenuItem,
    changeMenuItemOrder,
    getDeletedMenuItems,
    hardDeleteMenuItemById,
    restoreDeletedMenuItemById,
    changePrivacyMenuItem,
} from "../../src/helpers/backend_helper";
import { MenuItem } from 'common/data/menuItem';
import { IResult } from 'common/data/iResult';

const invalidateMenuCaches = (queryClient: QueryClient, id?: number) => {
    queryClient.invalidateQueries({ queryKey: ['GetMenuItems'] });
    queryClient.invalidateQueries({ queryKey: ['GetDeletedMenuItems'] });
    if (id) {
        queryClient.invalidateQueries({ queryKey: ['GetMenuItemById', id] });
    }
};
const useMenuItemMutation = (mutationFn: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: (_, variables:any) => { 
            const id = typeof variables === 'number' ? variables : variables?.id;
            invalidateMenuCaches(queryClient, id);
        },
        onError: (err: any) => console.error("Hata:", err)
    });
}

export const useGetMenuItems = () => {
    return useQuery<IResult<MenuItem[]>>({
        queryKey: ['GetMenuItems'], 
        queryFn: async () => await getMenuItems() as unknown as IResult<MenuItem[]>,
        // staleTime: 1000 * 60 * 5,  
        // gcTime: 1000 * 60 * 10,  
        // refetchOnWindowFocus: false,  
        // placeholderData: (previousData) => previousData, 
    });
}; 
export const useGetDeletedMenuItems = () => {
    return useQuery<IResult<MenuItem[]>>({
        queryKey: ['GetDeletedMenuItems'], 
        queryFn: async () => await getDeletedMenuItems() as unknown as IResult<MenuItem[]>
    });
};
export const useGetMenuItem = () => {
    return useQuery<IResult<MenuItem>>({
        queryKey: ['GetMenuItem'], 
        queryFn: async () => await getMenuItems() as unknown as IResult<MenuItem>
    });
};
export const useRestoreDeletedMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id }: { id: number}) => restoreDeletedMenuItemById(id),
        onSuccess: (_, { id }) => { 
            queryClient.invalidateQueries({ queryKey: ["GetMenuItemById",id] });
            queryClient.invalidateQueries({ queryKey: ["GetDeletedMenuItems"] });
            queryClient.invalidateQueries({ queryKey: ["GetMenuItems"] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useCreateMenuItem = () => useMenuItemMutation(createMenuItem);
export const useCreateDivider = () => useMenuItemMutation(createDivider);
export const useUpdateMenuItem = () => useMenuItemMutation(updateMenuItem);
export const useUpdateDivider = () => useMenuItemMutation(updateDivider);
export const useShowOrHideMenuItem = () => useMenuItemMutation(showOrHideMenuItem);
export const useChangePrivacyMenuItem = () => useMenuItemMutation(changePrivacyMenuItem);
export const useChangeMenuItemOrder = () => useMenuItemMutation(changeMenuItemOrder);
export const useDeleteMenuItem = () => useMenuItemMutation(deleteMenuItemById);
export const useHardDeleteMenuItem = () => useMenuItemMutation(hardDeleteMenuItemById);
