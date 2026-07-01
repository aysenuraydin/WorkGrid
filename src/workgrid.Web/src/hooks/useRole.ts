import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthUser } from 'context/AuthContext';
import { 
    getRoles,
    getRoleUsersAll, 
    getRoleUsersByRole, 
    createRole, 
    updateRole, 
    deleteRoleById, 
    updateUserRoleRelation 
} from 'helpers/backend_helper';

export const useGetRoles = () => {
    return useQuery({
        queryKey: ['roles-all'],
        queryFn: getRoles,
    });
};

export const useGetRoleUsersAll = () => {
    return useQuery({
        queryKey: ['role-users-all'],
        queryFn: async() => getRoleUsersAll() as unknown as AuthUser[], 
    });
};

export const useGetRoleUsersByRole = (roleName: string) => {
    return useQuery({
        queryKey: ['role-users-by-role', roleName],
        queryFn: () => getRoleUsersByRole(roleName),
        enabled: !!roleName,
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles-all'] });
        }
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRole,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles-all'] });
        }
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRoleById,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles-all'] });
        }
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUserRoleRelation,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['role-users-all'] });
        }
    });
    };