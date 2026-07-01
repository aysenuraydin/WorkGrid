const avatarPalette = [
{ bg: "#CECBF6", color: "#3C3489" },
{ bg: "#9FE1CB", color: "#085041" },
{ bg: "#F5C4B3", color: "#712B13" },
{ bg: "#B5D4F4", color: "#0C447C" },
{ bg: "#FAC775", color: "#633806" },
{ bg: "#F4C0D1", color: "#72243E" },
];
export const getAvatarColor = (name: string, index: number) =>
avatarPalette[(name?.charCodeAt(0) || 0 + index) % avatarPalette.length];