import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AdBanner({
    type,
    title,
    description,
    ctaText,
    ctaUrl,
    sponsorName = 'Sponsor',
}: {
    type: 'leaderboard' | 'rectangle' | 'in-feed';
    title: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    sponsorName?: string;
}) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    if (type === 'leaderboard') {
        return (
            <div className="relative mx-auto w-full max-w-[1280px] my-3 transition-all duration-300">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 shadow-sm border border-indigo-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Background decor */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-start gap-3 relative z-10">
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/60 mt-1">
                            Iklan
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{sponsorName}</span>
                            <h4 className="text-sm md:text-base font-extrabold text-white leading-tight">
                                {title}
                            </h4>
                            <p className="text-xs text-gray-300 line-clamp-1 max-w-2xl">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 relative z-10">
                        <a
                            href={ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 shadow transition-all duration-300 hover:scale-105"
                        >
                            {ctaText}
                        </a>
                        <button
                            onClick={() => setVisible(false)}
                            className="rounded-full hover:bg-white/10 p-1.5 text-white/50 hover:text-white transition-colors cursor-pointer"
                            title="Tutup iklan"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'rectangle') {
        return (
            <div className="relative transition-all duration-300 my-4">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-sm border border-slate-800 flex flex-col gap-3">
                    <span className="absolute top-2 left-2 rounded bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/60">
                        Iklan
                    </span>
                    <button
                        onClick={() => setVisible(false)}
                        className="absolute top-2 right-2 rounded-full hover:bg-white/10 p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                        title="Tutup iklan"
                    >
                        <X className="size-3.5" />
                    </button>
                    
                    <div className="mt-3 flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{sponsorName}</span>
                        <h4 className="text-sm font-extrabold text-white leading-snug">
                            {title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    
                    <a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 shadow transition-all duration-300 hover:scale-[1.02]"
                    >
                        {ctaText}
                    </a>
                </div>
            </div>
        );
    }

    // in-feed
    return (
        <div className="relative transition-all duration-300 my-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 p-5 shadow-sm border border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="absolute top-2 left-2 rounded bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/60">
                    Iklan
                </span>
                
                <div className="mt-2 sm:mt-0 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">{sponsorName}</span>
                    <h4 className="text-sm font-extrabold text-white leading-tight">
                        {title}
                    </h4>
                    <p className="text-xs text-stone-200">
                        {description}
                    </p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                    <a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 shadow transition-all duration-300 hover:scale-105"
                    >
                        {ctaText}
                    </a>
                    <button
                        onClick={() => setVisible(false)}
                        className="rounded-full hover:bg-white/10 p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                        title="Tutup iklan"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
