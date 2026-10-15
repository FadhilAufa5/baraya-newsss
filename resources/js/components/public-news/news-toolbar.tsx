import React from 'react';
import { ArrowUpDown, Calendar, LayoutGrid, List, RotateCcw } from 'lucide-react';
import { DATE_OPTIONS, FilterOption, SORT_OPTIONS } from './types';

interface NewsToolbarProps {
    total: number;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    selectedSort: string;
    onSortChange: (sort: string) => void;
    selectedDate: string;
    onDateChange: (date: string) => void;
    customDate: string;
    onCustomDateSubmit: (date: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    sortOptions?: FilterOption[];
    dateOptions?: FilterOption[];
}

export function NewsToolbar({
    total,
    hasActiveFilters,
    onClearFilters,
    selectedSort,
    onSortChange,
    selectedDate,
    onDateChange,
    customDate,
    onCustomDateSubmit,
    viewMode,
    onViewModeChange,
    sortOptions = SORT_OPTIONS,
    dateOptions = DATE_OPTIONS,
}: NewsToolbarProps) {
    const isCustomDate = selectedDate === 'custom' || /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800/80 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs">
            {/* Left: Total counter & Reset */}
            <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Ditemukan <strong className="text-gray-900 dark:text-white font-bold">{total}</strong> berita
                </span>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer ml-2"
                    >
                        <RotateCcw className="size-3" />
                        <span>Reset Filter</span>
                    </button>
                )}
            </div>

            {/* Right: Sort, Date, View Switcher */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-400 hidden md:inline flex items-center gap-1">
                        <ArrowUpDown className="size-3" /> Urutkan:
                    </span>
                    <select
                        value={selectedSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        aria-label="Urutkan berita"
                        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Filter Dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-400 hidden md:inline flex items-center gap-1">
                        <Calendar className="size-3" /> Waktu:
                    </span>
                    <select
                        value={selectedDate.startsWith('20') ? 'custom' : selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        aria-label="Filter rentang waktu"
                        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                    >
                        {dateOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                        <option value="custom">Pilih Tanggal...</option>
                    </select>
                </div>

                {/* Custom Date Input if selected */}
                {isCustomDate && (
                    <input
                        type="date"
                        value={customDate}
                        onChange={(e) => onCustomDateSubmit(e.target.value)}
                        className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30 px-2 py-1 text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                )}

                {/* View Mode Toggle */}
                <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-100 dark:bg-gray-900">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            viewMode === 'grid'
                                ? 'bg-white dark:bg-gray-800 text-red-600 shadow-2xs'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                        }`}
                        aria-label="Tampilan Kisi"
                        title="Tampilan Kisi"
                    >
                        <LayoutGrid className="size-3.5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            viewMode === 'list'
                                ? 'bg-white dark:bg-gray-800 text-red-600 shadow-2xs'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                        }`}
                        aria-label="Tampilan Daftar"
                        title="Tampilan Daftar"
                    >
                        <List className="size-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
