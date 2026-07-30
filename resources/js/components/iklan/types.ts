export interface Ad {
    id: number;
    title: string;
    sponsor_name: string | null;
    description: string | null;
    cta_text: string;
    cta_url: string;
    type: 'leaderboard' | 'in-feed' | 'rectangle';
    position: 'top' | 'middle' | 'sidebar';
    is_active: boolean;
    sort_order: number;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
}

export interface PaginatedData {
    data: Ad[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface AdFormData {
    title: string;
    sponsor_name: string;
    description: string;
    cta_text: string;
    cta_url: string;
    type: 'leaderboard' | 'in-feed' | 'rectangle';
    position: 'top' | 'middle' | 'sidebar';
    is_active: boolean;
    sort_order: number;
    starts_at: string;
    ends_at: string;
}
