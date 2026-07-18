import React, { useState } from 'react';
import { Clock, Play, ChevronRight, TrendingUp, LayoutGrid, Tag } from 'lucide-react';
import { CategoryBadge } from './category-badge';
import { GradientPlaceholder } from './gradient-placeholder';
import { AdBanner } from './ad-banner';

interface Article {
    id: number;
    category: string;
    title: string;
    excerpt?: string | null;
    published_at: string;
    views?: number;
    image?: string | null;
}

interface VideoStory {
    id: number;
    title: string;
    duration: string;
    time_ago: string;
}

interface NewsSectionsProps {
    beritaTerbaru: Article[];
    pilihanRedaksi: Article & { author?: string | null; excerpt?: string | null };
    videoStories: VideoStory[];
    beritaTerpopuler: { id: number; title: string; published_at: string }[];
}

export function NewsSections({
    beritaTerbaru,
    pilihanRedaksi,
    videoStories,
    beritaTerpopuler,
}: NewsSectionsProps) {
    const [activeTab, setActiveTab] = useState('Semua');

    return (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px_260px]">
            {/* Berita Terbaru */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-1 rounded bg-red-600" />
                        <h2 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100">Berita Terbaru</h2>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {['Semua', 'Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga', 'Lainnya'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-colors ${
                                    activeTab === tab 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {beritaTerbaru.map((art) => (
                        <a key={art.id} href={`/news/${art.id}`} className="group flex gap-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-28 shrink-0 sm:w-32">
                                {art.image ? (
                                    <img
                                        src={art.image}
                                        alt={art.title}
                                        className="w-full h-full min-h-[90px] object-cover"
                                    />
                                ) : (
                                    <GradientPlaceholder category={art.category} className="w-full h-full min-h-[90px]" />
                                )}
                            </div>
                            <div className="flex flex-col justify-center py-3 pr-3 gap-1.5">
                                <CategoryBadge category={art.category} size="xs" />
                                <h3 className="text-sm font-bold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 transition-colors">
                                    {art.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 hidden sm:block">{art.excerpt}</p>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="size-2.5" />
                                    {art.published_at}
                                </span>
                            </div>
                        </a>
                    ))}
                    <button className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-500 hover:border-red-400 hover:text-red-600 dark:border-gray-600 dark:text-gray-400 transition-colors flex items-center justify-center gap-2">
                        Lihat Semua Berita <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            {/* Pilihan Redaksi */}
            <div>
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-5 w-1 rounded bg-red-600" />
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100">Pilihan Redaksi</h2>
                </div>

                <a href={`/news/${pilihanRedaksi.id}`} className="group cursor-pointer rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow block">
                    <div className="relative aspect-video w-full">
                        {pilihanRedaksi.image ? (
                            <img
                                src={pilihanRedaksi.image}
                                alt={pilihanRedaksi.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <GradientPlaceholder category={pilihanRedaksi.category} className="w-full h-full" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/40 transition-transform group-hover:scale-110">
                                <Play className="size-6 text-white fill-white ml-0.5" />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-white">0:58</div>
                    </div>
                    <div className="p-4">
                        <CategoryBadge category={pilihanRedaksi.category} />
                        <h3 className="mt-2 text-base font-bold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
                            {pilihanRedaksi.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{pilihanRedaksi.excerpt}</p>
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock className="size-2.5" />
                            {pilihanRedaksi.published_at}
                        </div>
                    </div>
                </a>

                {/* Video Story mini */}
                <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-1 rounded bg-blue-600" />
                            <h3 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100">Video Story</h3>
                        </div>
                        <button className="text-[10px] font-semibold text-red-600 hover:underline flex items-center gap-0.5">
                            Lihat Semua <ChevronRight className="size-3" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {videoStories.map((v) => (
                            <div key={v.id} className="group cursor-pointer rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 relative aspect-video">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex size-7 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40">
                                        <Play className="size-3.5 text-white fill-white ml-0.5" />
                                    </div>
                                </div>
                                <div className="absolute bottom-1 left-1 right-1">
                                    <p className="text-[9px] font-semibold text-white line-clamp-2 leading-tight">{v.title}</p>
                                    <span className="text-[8px] text-gray-300">{v.time_ago}</span>
                                </div>
                                <div className="absolute top-1 right-1 rounded bg-black/60 px-1 py-px text-[8px] font-bold text-white">{v.duration}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Berita Terpopuler */}
            <div>
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-5 w-1 rounded bg-orange-500" />
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                        <TrendingUp className="size-4 text-orange-500" /> Berita Terpopuler
                    </h2>
                </div>

                <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                    {beritaTerpopuler.map((art, idx) => (
                        <a key={art.id} href={`/news/${art.id}`} className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
                            <span className={`shrink-0 text-3xl font-black leading-none ${idx === 0 ? 'text-red-600' : idx === 1 ? 'text-orange-400' : idx === 2 ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 transition-colors">
                                    {art.title}
                                </h3>
                                <span className="mt-1 text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="size-2.5" />
                                    {art.published_at}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Quick Stats Box */}
                <div className="mt-5 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-4 text-white shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                        <LayoutGrid className="size-4" />
                        <span className="text-xs font-black uppercase tracking-wide">Statistik Portal</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Total Berita', value: '12.8K' },
                            { label: 'Kategori', value: '10' },
                            { label: 'Pembaca/Hari', value: '48K' },
                            { label: 'Kontributor', value: '35' },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-lg bg-white/10 p-2.5 text-center">
                                <div className="text-lg font-black">{stat.value}</div>
                                <div className="text-[9px] text-red-200 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rectangle Ad */}
                <AdBanner
                    type="rectangle"
                    sponsorName="Baraya Fiber"
                    title="Baraya Fiber — Koneksi Cepat & Stabil Jabar"
                    description="Internet rumah super cepat 100% fiber optic tanpa FUP. Dapatkan promo hemat biaya langganan 50% di bulan pertama!"
                    ctaText="Pasang Sekarang"
                    ctaUrl="https://barayafiber.co.id"
                />

                {/* Tags */}
                <div className="mt-5">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="h-5 w-1 rounded bg-gray-400" />
                        <h3 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                            <Tag className="size-3.5" />
                            Topik Populer
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Ridwan Kamil', 'Pemilu 2024', 'Persib', 'Bandung', 'Ekonomi', 'KCIC Whoosh', 'Kawah Putih', 'Inflasi', 'Tol Getaci'].map((tag) => (
                            <button key={tag} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600 hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 transition-colors">
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
