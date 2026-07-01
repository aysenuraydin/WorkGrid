import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-toastify"; 
import { API, AUTH_LOGOUT, AUTHENTICATE } from "helpers/url_helper";
import { getApiClient } from "helpers/api_helper";
import { getUserDetailById } from "helpers/backend_helper";

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    phoneNumber?: string; 
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    roles: string[];
    
    designation?: string;     
    website?: string;         
    city?: string;            
    country?: string;         
    zipCode?: string;         
    address?: string;
    description?: string;     
    joiningDate?: string;     
    skils?: string;           

    jobTitle?: string;       
    companyName?: string;  
    experienceYears?: string; 
    jobDescription?: string;  
}


interface AuthenticationRequest {
    email: string;
    password: string;
}

interface AuthContextType {
    accessToken: string | null;
    user: AuthUser | null;  
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: AuthenticationRequest) => Promise<void>;
    logout: (isRedirect?:boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeToken = (token: string): AuthUser | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const claims = JSON.parse(jsonPayload); 

        const rolesClaim = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || claims.role || claims.roles || [];
        return {
            id: claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || claims.nameid || claims.id,
            username: claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || claims.unique_name || claims.userName,
            email: claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || claims.email,
            profilePictureUrl: claims.profilePictureUrl ||claims.ProfilePictureUrl || claims.avatarUrl || undefined, 
            firstName: claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || claims.firstName || claims.FirstName || "",
            lastName: claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || claims.lastName || claims.LastName || "",
            
            // Rol string gelebilir veya birden fazla rol varsa array gelebilir, garantiye alıyoruz:
            roles: Array.isArray(rolesClaim) ? rolesClaim : (rolesClaim ? [rolesClaim] : [])
        };
    } catch (e) {
        console.error("JWT Decode Hatası:", e);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const authUserStr = localStorage.getItem("authUser");
        if (authUserStr) {
            const authUser = JSON.parse(authUserStr);
            setAccessToken(authUser.token);
            
            if (authUser.token) {
                const decoded = decodeToken(authUser.token);
                if (decoded) {
                    const apiUser = authUser.user;
                    decoded.profilePictureUrl = apiUser?.profilePictureUrl || decoded.profilePictureUrl;
                    decoded.firstName = apiUser?.firstName || decoded.firstName;
                    decoded.lastName = apiUser?.lastName || decoded.lastName;
                    decoded.phoneNumber = apiUser?.phoneNumber || decoded.phoneNumber;
                    decoded.designation = apiUser?.designation || "";
                    decoded.website = apiUser?.website || "";
                    decoded.city = apiUser?.city || "";
                    decoded.country = apiUser?.country || "";
                    decoded.zipCode = apiUser?.zipCode || "";
                    decoded.zipCode = apiUser?.zipCode || "";
                    decoded.description = apiUser?.description || "";
                    decoded.joiningDate = apiUser?.joiningDate || "";
                    decoded.skils = apiUser?.skils || "";  
                    decoded.jobTitle = apiUser?.jobTitle || "";
                    decoded.companyName = apiUser?.companyName || "";
                    decoded.experienceYears = apiUser?.experienceYears || "";
                    decoded.jobDescription = apiUser?.jobDescription || "";
                    decoded.address = apiUser?.address || "";

                    setUser(decoded);
                }
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: AuthenticationRequest) => {
        try {
            setIsLoading(true);
            const client = getApiClient();
            const response = await client.create(AUTHENTICATE, credentials);
            const data = response?.data !== undefined ? response.data : response;
            const accessToken = data.AccessToken || data.accessToken;
            const refreshToken = data.RefreshToken || data.refreshToken;

            if (!accessToken) {
                throw new Error("Token could not be retrieved from server response.");
            }

            const decodedUser = decodeToken(accessToken);
            let fullUserDetail: AuthUser = decodedUser as AuthUser;

            const initialAuthData = {
                token: accessToken,
                refreshToken: refreshToken,
                user: decodedUser
            };
            localStorage.setItem("authUser", JSON.stringify(initialAuthData));
            setAccessToken(accessToken);


            if (decodedUser && decodedUser.id) {
                try {
                    const userDetailResponse = await getUserDetailById(decodedUser.id);
                    const actualData = userDetailResponse?.data !== undefined ? userDetailResponse.data : userDetailResponse;
                    
                    fullUserDetail = {
                        ...decodedUser,
                        ...actualData 
                    } as AuthUser;

                    const finalAuthData = {
                        token: accessToken,
                        refreshToken: refreshToken,
                        user: fullUserDetail  
                    };
                    localStorage.setItem("authUser", JSON.stringify(finalAuthData));
                    
                } catch (apiError) {
                    console.warn("Kullanıcı profil detayları API'den tamamlanamadı, ama login engellenmedi:", apiError);
                }
            }

            setUser(fullUserDetail); 
        } catch (error: any) {
            console.error("Login failed:", error);
            toast.error(error.response?.status === 401 ? "Invalid credentials or unauthorized request!" : "Login error.");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const logout = async (isRedirect?:boolean) => {
        try { 
            const client = getApiClient();
            await client.create(AUTH_LOGOUT, {});
            console.log("Backend session cleared successfully.");
        } catch (error) {
            console.error("Backend logout failed or session already expired:", error);
        } finally {
            localStorage.removeItem("authUser");
            setAccessToken(null);
            setUser(null);  
            if(isRedirect) window.location.href = "/login"; 
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, user, isAuthenticated: !!accessToken, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};