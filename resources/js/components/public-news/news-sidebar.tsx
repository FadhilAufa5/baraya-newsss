import React from 'react';
import { Calendar, Clock, Eye, Flame, Tag, X } from 'lucide-react';
import { AdBanner } from '@/components/welcome/ad-banner';
import { CategoryBadge } from '@/components/welcome/category-badge';
import { imageUrl } from '@/lib/utils';
import { Ad, formatDateShort, PopularArticle } from './types';

interface NewsSidebarProps {
    beritaTerpopuler: PopularArticle[];
    popularTags: string[];
    activeTag?: string;
    onTagClick: (tag: string) => void;
    customDate: string;
    onCustomDateSubmit: (date: string) => void;
    onClearCustomDate: () => void;
    sidebarAds: Ad[];
}

export function NewsSidebar({
    beritaTerpopuler,
    popularTags,
    activeTag,
    onTagClick,
    customDate,
    onCustomDateSubmit,
    onClearCustomDate,
    sidebarAds,
}: NewsSidebarProps) {
    return (
        <aside className="space-y-6">
            {/* POPULAR NEWS WIDGET */}
            {beritaTerpopuler.length > 0 && (
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                        <div className="h-5 w-1 rounded bg-orange-500" />
                        <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Flame className="size-4 text-orange-500" />
                            Berita Terpopuler
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {beritaTerpopuler.map((art, idx) => {
                            const popImg = imageUrl(art.image);
                            return (
                                <a
                                    key={art.id}
                                    href={`/news/${art.slug}`}
                                    className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer"
                                >
                                    <span
                                        className={`shrink-0 text-2xl font-black leading-none ${
                                            idx === 0
                                                ? 'text-red-600'
                                                : idx === 1
                                                ? 'text-orange-500'
                                                : idx === 2
                                                ? 'text-amber-500'
                                                : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <CategoryBadge category={art.category} size="xs" />
                                        </div>
                                        <h4 className="text-xs font-bold leading-snug text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 transition-colors">
                                            {art.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            <span className="flex items-center gap-0.5">
                                                <Clock className="size-2.5" />
                                                {formatDateShort(art.published_at)}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                                <Eye className="size-2.5" />
                                                {art.views.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    {popImg && (
                                        <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            <img
                                                src={popImg}
                                                alt={art.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* POPULAR TAGS WIDGET */}
            {popularTags.length > 0 && (
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs">
                    <div className="mb-3 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2.5">
                        <div className="h-5 w-1 rounded bg-red-600" />
                        <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Tag className="size-3.5 text-red-600" />
                            Topik & Tag Populer
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {popularTags.map((tag) => {
                            const isTagActive = activeTag === tag;
                            return (
                                <button
                                    key={tag}
                                    onClick={() => onTagClick(tag)}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                                        isTagActive
                                            ? 'bg-red-600 text-white shadow-xs'
                                            : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-950/40 dark:hover:text-red-400'
                                    }`}
                                >
                                    #{tag}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* QUICK ARCHIVE BY DATE */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2.5">
                    <div className="h-5 w-1 rounded bg-blue-600" />
                    <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-blue-600" />
                        Kalender Arsip
                    </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cari artikel berita yang dirilis pada tanggal spesifik:
                </p>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={customDate}
                        onChange={(e) => onCustomDateSubmit(e.target.value)}
                        aria-label="Pilih tanggal rilis berita"
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    />
                    {customDate && (
                        <button
                            onClick={onClearCustomDate}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 text-xs font-bold text-gray-500 hover:text-red-600 cursor-pointer"
                            title="Hapus Tanggal"
                            aria-label="Hapus tanggal arsip"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* SIDEBAR ADS */}
            {sidebarAds.map((ad) => (
                <AdBanner
                    key={ad.id}
                    type={ad.type}
                    sponsorName={ad.sponsor_name ?? 'Sponsor'}
                    title={ad.title}
                    description={ad.description ?? ''}
                    ctaText={ad.cta_text}
                    ctaUrl={ad.cta_url}
                />
            ))}
        </aside>
    );
}
