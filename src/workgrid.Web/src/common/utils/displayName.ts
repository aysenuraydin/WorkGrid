import { AuthUser } from "context/AuthContext";

export const displayName = (user:AuthUser) => 
  user?.firstName || user?.lastName 
    ? `${user.firstName} ${user.lastName}`.trim() 
    : user?.username || "User";