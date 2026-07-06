import React from 'react';
import { Flame } from 'lucide-react';

interface TrendingTickerProps {
    trendingItems: string[];
    trendingIndex: number;
    setTrendingIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function TrendingTicker({
    trendingItems,
    trendingIndex,
    setTrendingIndex,
}: TrendingTickerProps) {
    return (
        <div className="bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800">
            <div className="mx-auto max-w-[1280px] flex items-center gap-3 px-4 py-2 sm:px-6">
                <span className="shrink-0 rounded bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1">
                    <Flame className="size-3" /> Trending
                </span>
                <div className="overflow-hidden flex-1">
                    <button
                        onClick={() => setTrendingIndex((i) => (i + 1) % trendingItems.length)}
                        className="text-sm text-gray-700 hover:text-red-600 dark:text-gray-300 font-medium truncate text-left w-full transition-colors"
                    >
                        {trendingItems[trendingIndex]}
                    </button>
                </div>
                <div className="hidden sm:flex items-center gap-1 shrink-0">
                    {trendingItems.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setTrendingIndex(i)}
                            className={`size-1.5 rounded-full transition-colors ${i === trendingIndex ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
