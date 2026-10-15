import React from 'react';
import { RotateCcw, Search } from 'lucide-react';

interface NewsEmptyStateProps {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export function NewsEmptyState({
    hasActiveFilters,
    onClearFilters,
}: NewsEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 shadow-2xs space-y-4">
            <div className="size-16 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
                <Search className="size-8" />
            </div>
            <div className="space-y-1 max-w-md">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Tidak Ada Berita Ditemukan
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Tidak ada artikel berita yang cocok dengan kriteria pencarian atau filter yang Anda gunakan.
                </p>
            </div>
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <RotateCcw className="size-3.5" />
                    <span>Kembali ke Semua Berita</span>
                </button>
            )}
        </div>
    );
}
