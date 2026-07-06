import React from 'react';

const CAT_COLORS: Record<string, string> = {
    'Nasional':   'bg-red-600',
    'Ekonomi':    'bg-emerald-600',
    'Olahraga':   'bg-blue-600',
    'Teknologi':  'bg-violet-600',
    'Jawa Barat': 'bg-amber-600',
    'Wisata':     'bg-teal-600',
    'Lifestyle':  'bg-pink-600',
    'Otomotif':   'bg-orange-600',
};

export function CategoryBadge({ category, size = 'sm' }: { category: string; size?: 'sm' | 'xs' }) {
    const color = CAT_COLORS[category] ?? 'bg-slate-600';
    return (
        <span className={`inline-block ${color} text-white font-bold uppercase tracking-wide rounded px-2 py-0.5 ${size === 'xs' ? 'text-[9px]' : 'text-[10px]'}`}>
            {category}
        </span>
    );
}
