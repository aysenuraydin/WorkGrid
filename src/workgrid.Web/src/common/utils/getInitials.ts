export const getInitials = (fullName: string) => {
if (!fullName) return "??";
const parts = fullName.trim().split(/\s+/);
return parts.length > 1
    ? (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};


export const getInitialsName = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return "??";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};