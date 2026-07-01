import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getUserDetailById, 
    getAllUsers, 
    getUsersByRole, 
    updateUserProfile, 
    updateUserPassword, 
    updateUserAvatarUrl, 
    deleteUserById,
    updateExperienceProfile
} from "../../src/helpers/backend_helper";  
import { AuthUser } from 'context/AuthContext';
import { string } from 'yup';
export interface UpdateProfileRequest {
    id: string;  
    firstName: string;
    lastName: string;
    phoneNumber?: string; 
    email: string;
    joiningDate?: string;     
    address?: string;     
    skils?: string;      
    designation?: string;     
    website?: string;         
    city?: string;            
    country?: string;         
    zipCode?: string;         
    description?: string;
}
export interface UpdateExperienceProfileRequest {
    id: string;  
    jobTitle?: string;       
    companyName?: string;  
    experienceYears?: string; 
    jobDescription?: string;  
}

export const useUserProfile = (userId: string) => {
  return useQuery<AuthUser>({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserDetailById(userId) as unknown as AuthUser, 
    enabled: !!userId,
  });
}; 

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['users-all'],
    queryFn: getAllUsers, 
  });
};

export const useUsersByRole = (roleName: string) => {
  return useQuery({
    queryKey: ['users-by-role', roleName],
    queryFn: () => getUsersByRole(roleName),
    enabled: !!roleName,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: UpdateProfileRequest) => updateUserProfile(user),
    onSuccess: (_,user) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] }); 
    }
  });
};
export const useUpdateExperienceProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: UpdateExperienceProfileRequest) => updateExperienceProfile(user),
    onSuccess: (_,user) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] }); 
    }
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updateUserPassword,
  });
};
export const useUpdateAvatarUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, profilePictureUrl }: { userId: string, profilePictureUrl: string }) => 
      updateUserAvatarUrl({ userId, profilePictureUrl }),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ['user-profile', userId],
        refetchType: 'active' 
      }); 
    }
  });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: (id: string) => deleteUserById(id),
        onSuccess: (_,id) => {  
            queryClient.invalidateQueries({ queryKey: ['user-profile', id] });
            queryClient.invalidateQueries({ queryKey: ['role-users-all'] });
            queryClient.invalidateQueries({ queryKey: ['users-by-role'] });
            queryClient.invalidateQueries({ queryKey: ['users-all'] }); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
