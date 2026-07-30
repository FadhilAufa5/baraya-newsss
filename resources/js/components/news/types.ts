export interface NewsFormData {
    title: string;
    slug: string;
    category: string;
    author: string;
    excerpt: string;
    content: string;
    image: File | null;
    image_caption: string;
    meta_description: string;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    published_at: string;
}

export interface NewsErrors {
    title?: string;
    slug?: string;
    category?: string;
    author?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    image_caption?: string;
    meta_description?: string;
    tags?: string;
    status?: string;
    published_at?: string;
}
