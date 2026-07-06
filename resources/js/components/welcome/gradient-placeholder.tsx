import React from 'react';
import { Newspaper } from 'lucide-react';

export function GradientPlaceholder({ category, className = '' }: { category: string; className?: string }) {
    const gradients: Record<string, string> = {
        'Nasional':   'from-red-600 to-red-900',
        'Ekonomi':    'from-emerald-600 to-emerald-900',
        'Olahraga':   'from-blue-600 to-blue-900',
        'Teknologi':  'from-violet-600 to-violet-900',
        'Jawa Barat': 'from-amber-500 to-amber-800',
        'Wisata':     'from-teal-500 to-teal-800',
        'default':    'from-slate-600 to-slate-900',
    };
    const g = gradients[category] ?? gradients['default'];
    return (
        <div className={`bg-gradient-to-br ${g} flex items-center justify-center ${className}`}>
            <Newspaper className="size-8 text-white/30" />
        </div>
    );
}
