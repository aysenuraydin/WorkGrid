export const getUserInitials = (firstName: string, lastName: string): string => {
  const f = firstName ? firstName.charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${f}${l}` || "WG";
}; 