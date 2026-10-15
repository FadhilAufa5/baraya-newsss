import React from 'react';
import { router } from '@inertiajs/react';
import { PaginationLink } from './types';

interface NewsPaginationProps {
    currentPage: number;
    lastPage: number;
    links: PaginationLink[];
}

export function NewsPagination({
    currentPage,
    lastPage,
    links,
}: NewsPaginationProps) {
    if (lastPage <= 1) return null;

    const handlePageClick = (url: string) => {
        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: false,
            }
        );
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Halaman <span className="font-bold text-gray-800 dark:text-gray-200">{currentPage}</span> dari{' '}
                <span className="font-bold text-gray-800 dark:text-gray-200">{lastPage}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
                {links.map((link, i) => {
                    const cleanLabel = link.label
                        .replace('&laquo; Previous', '‹ Sebelumnya')
                        .replace('Next &raquo;', 'Berikutnya ›')
                        .replace('&laquo;', '‹')
                        .replace('&raquo;', '›');

                    if (!link.url) {
                        return (
                            <span
                                key={i}
                                className="min-w-9 h-9 flex items-center justify-center px-3 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed select-none bg-gray-50/50 dark:bg-gray-900/50"
                            >
                                {cleanLabel}
                            </span>
                        );
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handlePageClick(link.url!)}
                            className={`min-w-9 h-9 flex items-center justify-center px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                link.active
                                    ? 'border-red-600 bg-red-600 text-white shadow-xs shadow-red-600/30'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400'
                            }`}
                            aria-label={`Halaman ${cleanLabel}`}
                        >
                            {cleanLabel}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
