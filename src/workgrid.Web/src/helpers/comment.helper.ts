import { Comment } from "common/data/comment";

export const buildCommentTree = (flat: Comment[]): Comment[] => {
    if (!flat || !Array.isArray(flat)) {
        return [];
    }

    const map = new Map<number, Comment>();
    const roots: Comment[] = [];

    // Veriyi işle
    flat.forEach(c => map.set(c.id, { ...c, replies: [] }));

    flat.forEach(c => {
        const node = map.get(c.id)!;
        if (c.parentId != null && map.has(c.parentId)) {
            map.get(c.parentId)!.replies!.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
};

export interface RatingSummary {
    average: number;   
    total: number;     
    distribution: Record<number, number>;  
}

export const getRatingSummary = (flat: Comment[]): RatingSummary => {
    const rated = flat?.filter(c => c.rating != null && c.rating >= 1 && c.rating <= 5);
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rated?.forEach(c => { distribution[c.rating!] += 1; });
    const sum = rated?.reduce((acc, c) => acc + (c.rating ?? 0), 0);
    const average = rated?.length === 0 ? 0 : Math.round((sum / rated?.length) * 10) / 10;
    return { average, total: rated?.length, distribution };
};