import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../helpers/api_helper';  
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AUTH_FORGOT_PASSWORD, AUTH_REGISTER, USER_BLOCK, USER_UNBLOCK } from 'helpers/url_helper';

export interface RegisterVariables {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;  
    confirmAggreement: boolean; 
    isExternalAuthentication: boolean; 
}

export const useRegisterMutation = () => {
    const client = getApiClient();

    return useMutation({
        mutationFn: async (variables: RegisterVariables) => {
            return await client.create(AUTH_REGISTER, variables);
        },
        onError: (err: any) => {
            console.error("Register Mutation Hatası:", err);
        }
    });
};

export const useLoginMutation = () => {
    const { login } = useAuth();
    const queryClient = useQueryClient();  

    return useMutation({
        mutationFn: async (variables: { email: string; password: string, rememberMe: boolean, isExternalAuthentication:boolean }) => { 
            return await login(variables);
        },
        onSuccess: () => { 
            queryClient.invalidateQueries();
        },
        onError: (err: any) => {
            console.error("Login Mutation Hatası:", err);
        }
    });
};

export const useLogout = () => {
    const { logout } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();  
        queryClient.clear();  
        navigate("/login");  
    };

    return handleLogout;
};

export const useForgetPasswordMutation = () => {
    const client = getApiClient();

    return useMutation({
        mutationFn: async (variables: { email: string }) => { 
            return await client.create(AUTH_FORGOT_PASSWORD, variables);
        },
        onError: (err: any) => {
            console.error("Forget Password Mutation Hatası:", err);
        }
    });
};

export const useSetUserBlocked = () => {
    const client = getApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, blocked }: { id: string; blocked: boolean }) => {
            const url = blocked ? USER_BLOCK(id) : USER_UNBLOCK(id);
            return await client.patch(url, {});
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["role-users-all"] });
            queryClient.invalidateQueries({ queryKey: ["users-by-role"] });
            queryClient.invalidateQueries({ queryKey: ["users-all"] });
            queryClient.invalidateQueries({ queryKey: ["user-profile", id] });
        },
        onError: (err: any) => {
            console.error("Block/Unblock Mutation Hatası:", err);
        },
    });
};