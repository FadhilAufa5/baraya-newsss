export interface Article {
    id: number;
    title: string;
    slug: string;
    category: string;
    author: string | null;
    excerpt: string | null;
    content?: string;
    image: string | null;
    image_caption?: string | null;
    tags: string[] | null;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    published_at: string | null;
    views: number;
    reading_time: number;
    user?: { name: string };
    created_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData {
    data: Article[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

export interface Ad {
    id: number;
    title: string;
    sponsor_name: string | null;
    description: string | null;
    cta_text: string;
    cta_url: string;
    type: 'leaderboard' | 'in-feed' | 'rectangle';
    position: 'top' | 'middle' | 'sidebar';
}

export interface NewsFilters {
    search?: string;
    category?: string;
    sort?: string;
    date?: string;
    tag?: string;
}

export interface PopularArticle {
    id: number;
    title: string;
    slug: string;
    category: string;
    image: string | null;
    published_at: string | null;
    views: number;
}

export interface FilterOption {
    label: string;
    value: string;
}

export const DATE_OPTIONS: FilterOption[] = [
    { label: 'Semua Waktu', value: '' },
    { label: 'Hari Ini', value: 'hari-ini' },
    { label: 'Minggu Ini (7 Hari)', value: 'minggu-ini' },
    { label: 'Bulan Ini (30 Hari)', value: 'bulan-ini' },
];

export const SORT_OPTIONS: FilterOption[] = [
    { label: 'Terbaru', value: 'terbaru' },
    { label: 'Terpopuler', value: 'terpopuler' },
    { label: 'Terlama', value: 'terlama' },
];

export function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return (
        d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }) +
        ' • ' +
        d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
        ' WIB'
    );
}

export function formatDateShort(dateStr: string | null): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export interface PublicNewsIndexProps {
    news: PaginatedData;
    filters: NewsFilters;
    categories: string[];
    categoryCounts: Record<string, number>;
    popularTags: string[];
    beritaTerpopuler: PopularArticle[];
    trendingItems: string[];
    ads: Ad[];
}

