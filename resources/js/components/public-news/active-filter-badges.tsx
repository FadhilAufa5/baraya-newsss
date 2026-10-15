import React from 'react';
import { X } from 'lucide-react';
import { DATE_OPTIONS, FilterOption, NewsFilters, SORT_OPTIONS } from './types';

interface ActiveFilterBadgesProps {
    filters: NewsFilters;
    hasActiveFilters: boolean;
    onClearSearch: () => void;
    onClearCategory: () => void;
    onClearTag: () => void;
    onClearDate: () => void;
    onClearSort: () => void;
    sortOptions?: FilterOption[];
    dateOptions?: FilterOption[];
}

export function ActiveFilterBadges({
    filters,
    hasActiveFilters,
    onClearSearch,
    onClearCategory,
    onClearTag,
    onClearDate,
    onClearSort,
    sortOptions = SORT_OPTIONS,
    dateOptions = DATE_OPTIONS,
}: ActiveFilterBadgesProps) {
    if (!hasActiveFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                Filter Aktif:
            </span>

            {/* Search Badge */}
            {filters.search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-2.5 py-0.5 text-xs text-red-700 dark:text-red-300 font-semibold">
                    Pencarian: "{filters.search}"
                    <button
                        onClick={onClearSearch}
                        className="hover:text-red-900 cursor-pointer"
                        aria-label="Hapus filter pencarian"
                    >
                        <X className="size-3" />
                    </button>
                </span>
            )}

            {/* Category Badge */}
            {filters.category && filters.category !== 'Semua' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-2.5 py-0.5 text-xs text-red-700 dark:text-red-300 font-semibold">
                    Kategori: {filters.category}
                    <button
                        onClick={onClearCategory}
                        className="hover:text-red-900 cursor-pointer"
                        aria-label="Hapus filter kategori"
                    >
                        <X className="size-3" />
                    </button>
                </span>
            )}

            {/* Tag Badge */}
            {filters.tag && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 px-2.5 py-0.5 text-xs text-blue-700 dark:text-blue-300 font-semibold">
                    Tag: #{filters.tag}
                    <button
                        onClick={onClearTag}
                        className="hover:text-blue-900 cursor-pointer"
                        aria-label="Hapus filter tag"
                    >
                        <X className="size-3" />
                    </button>
                </span>
            )}

            {/* Date Badge */}
            {filters.date && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                    Waktu: {dateOptions.find((o) => o.value === filters.date)?.label ?? filters.date}
                    <button
                        onClick={onClearDate}
                        className="hover:text-amber-900 cursor-pointer"
                        aria-label="Hapus filter waktu"
                    >
                        <X className="size-3" />
                    </button>
                </span>
            )}

            {/* Sort Badge */}
            {filters.sort && filters.sort !== 'terbaru' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2.5 py-0.5 text-xs text-gray-700 dark:text-gray-300 font-semibold">
                    Urutan: {sortOptions.find((o) => o.value === filters.sort)?.label}
                    <button
                        onClick={onClearSort}
                        className="hover:text-gray-900 cursor-pointer"
                        aria-label="Reset urutan"
                    >
                        <X className="size-3" />
                    </button>
                </span>
            )}
        </div>
    );
}
