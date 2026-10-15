import React from 'react';

interface CategoryTabsProps {
    categories: string[];
    categoryCounts: Record<string, number>;
    totalCount: number;
    activeCategory: string;
    onCategoryClick: (category: string) => void;
}

export function CategoryTabs({
    categories,
    categoryCounts,
    totalCount,
    activeCategory,
    onCategoryClick,
}: CategoryTabsProps) {
    const isAllActive = activeCategory === 'Semua' || !activeCategory;

    return (
        <div className="relative border-b border-gray-200 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {/* Tab: Semua Kategori */}
                <button
                    onClick={() => onCategoryClick('Semua')}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isAllActive
                            ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-600/30'
                            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                    <span>Semua Kategori</span>
                    <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isAllActive
                                ? 'bg-red-700 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                        {totalCount}
                    </span>
                </button>

                {/* Categories Tabs */}
                {categories.map((cat) => {
                    const count = categoryCounts[cat] ?? 0;
                    const isSelected = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => onCategoryClick(cat)}
                            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                    ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-600/30'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <span>{cat}</span>
                            {count > 0 && (
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                                        isSelected
                                            ? 'bg-red-700 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
