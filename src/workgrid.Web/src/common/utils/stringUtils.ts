
export const toSafeId = (
    parts: (string | number | null | undefined)[], 
    prefix: string = "", 
    fallback: string = "element"
): string => {
    const combinedText = parts
        .filter(p => p !== null && p !== undefined && p !== "")
        .join("-");

    if (!combinedText) return prefix ? `${prefix}-${fallback}` : fallback;

    const safe = combinedText
        .toLowerCase()
        .trim()
        .replace(/[<>&"']/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .replace(/-+/g, "-");

    const result = safe.length > 0 ? safe : fallback;
    return prefix ? `${prefix}-${result}` : result;
};