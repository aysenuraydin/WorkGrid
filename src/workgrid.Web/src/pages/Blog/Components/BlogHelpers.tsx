// ListView/BlogHelpers.ts
import config from 'config'

export type ViewMode = 'list' | 'grid';

export const resolveImg = (fileName?: string): string | null => {
    if (!fileName) return null;
    if (fileName.startsWith('http')) return fileName;
    return `${config.api.FILE_API_URL}/File/${fileName}`;
};

export const parseTags = (raw?: string): string[] => {
    if (!raw) return [];
    return raw.split(/[,\s]+/).map(t => t.trim()).filter(Boolean);
};

export const formatDate = (iso?: string): string => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
};


export const CATEGORY_FILTER_COLUMN = 'categoryId';

export const dateFilterToApi = (value: string): string[] => {
    const now       = new Date();
    const pad       = (n: number) => String(n).padStart(2, '0');
    const fmt       = (d: Date)   => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

    switch (value) {
        case 'Today':
            return [`createdAt:gte:${fmt(today)}`];
        case 'Yesterday':
            return [`createdAt:gte:${fmt(yesterday)}`, `createdAt:lt:${fmt(today)}`];
        case 'Last 7 Days': {
            const d = new Date(today); d.setDate(today.getDate() - 7);
            return [`createdAt:gte:${fmt(d)}`];
        }
        case 'Last 30 Days': {
            const d = new Date(today); d.setDate(today.getDate() - 30);
            return [`createdAt:gte:${fmt(d)}`];
        }
        case 'This Month': {
            const d = new Date(now.getFullYear(), now.getMonth(), 1);
            return [`createdAt:gte:${fmt(d)}`];
        }
        case 'Last Year': {
            const start = new Date(now.getFullYear() - 1, 0, 1);
            const end   = new Date(now.getFullYear(), 0, 1);
            return [`createdAt:gte:${fmt(start)}`, `createdAt:lt:${fmt(end)}`];
        }
        default:
            return [];
    }
};