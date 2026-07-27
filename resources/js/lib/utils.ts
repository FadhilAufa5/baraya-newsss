import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Resolve an image path to a full URL.
 * Handles: null/undefined, absolute URLs, and storage paths.
 */
export function imageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) {
        return path;
    }
    return `/storage/${path}`;
}
