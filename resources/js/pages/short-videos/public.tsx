import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { VideoHeader } from '@/components/short-videos/video-header';
import { VideoCard } from '@/components/short-videos/video-card';
import { VideoModal } from '@/components/short-videos/video-modal';
import { TrendingTicker } from '@/components/welcome/trending-ticker';
import { Footer } from '@/components/welcome/footer';
import { Video, Search, ChevronRight, X } from 'lucide-react';

interface ShortVideo {
    id: number;
    title: string;
    description: string | null;
    video: string;
    thumbnail: string | null;
    status: string;
    published_at: string | null;
    views: number;
    user?: { name: string };
    created_at: string;
}

interface PaginatedData {
    data: ShortVideo[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
// 
interface Props {
    videos: PaginatedData;
    filters: { search?: string };
}

const TRENDING_ITEMS = [
    'Video Short Terpopuler Minggu Ini di Baraya News',
    'Jelajahi Beragam Video Pendek dari Jawa Barat',
    'Update Video Terbaru Setiap Hari dari Redaksi',
];

export default function PublicShortVideos({ videos, filters }: Props) {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [activeVideo, setActiveVideo] = useState<ShortVideo | null>(null);
    const [trendingIndex, setTrendingIndex] = useState(0);

    const applySearch = () => {
        router.get('/videos', searchQuery ? { search: searchQuery } : {}, {
            preserveState: true,
            replace: true,
        });
    };

    const activeIndex = activeVideo ? videos.data.findIndex((v) => v.id === activeVideo.id) : -1;
    const handlePrev = () => {
        if (activeIndex > 0) setActiveVideo(videos.data[activeIndex - 1]);
    };
    const handleNext = () => {
        if (activeIndex < videos.data.length - 1) setActiveVideo(videos.data[activeIndex + 1]);
    };

    return (
        <>
            <Head title="Short Videos — Baraya News" />

            {/* Modal */}
            {activeVideo && (
                <VideoModal
                    video={activeVideo}
                    videos={videos.data}
                    onClose={() => setActiveVideo(null)}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}

            {/* HEADER */}
            <VideoHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={applySearch}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            {/* TRENDING TICKER */}
            <TrendingTicker
                trendingItems={TRENDING_ITEMS}
                trendingIndex={trendingIndex}
                setTrendingIndex={setTrendingIndex}
            />

            {/* MAIN CONTENT */}
            <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 space-y-6">

                    {/* Beautiful Hero Video Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-800 to-indigo-950 p-6 sm:p-8 text-white shadow-md">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 max-w-xl space-y-2">
                            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                Baraya Video-Shorts 🎬
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                                Video Berita Terbaru
                            </h2>
                            <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
                                Berita singkat. Informasi cepat. Tetap terhubung dengan peristiwa terkini.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Side Content Navigation (for desktop styling) */}
                        <div className="hidden lg:flex flex-col gap-6">
                            {/* Categories Widget */}
                            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Topik Video</h3>
                                <div className="flex flex-col gap-1">
                                    {['Semua Video', 'Jawa Barat', 'Nasional', 'Olahraga', 'Ekonomi', 'Teknologi', 'Lifestyle'].map((cat, idx) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat === 'Semua Video' ? 'Semua' : cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                                                activeCategory === cat || (cat === 'Semua Video' && activeCategory === 'Semua')
                                                    ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <span>{cat}</span>
                                            <span className="text-[10px] opacity-60">
                                                {idx === 0 ? videos.total : Math.floor((videos.total / (idx + 1)) + 1)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags Widget */}
                            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Tag Populer</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {['#KulinerBandung', '#ExploreJabar', '#PersibDay', '#WisataCiwidey', '#GedungSate', '#ShortsHariIni', '#KabarJabar'].map((tag) => (
                                        <button key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Statistics Widget */}
                            {/* <div className="rounded-xl bg-gradient-to-br from-gray-900 to-slate-950 p-4 text-white shadow-sm border border-gray-850">
                                <h3 className="text-xs font-black uppercase tracking-wider text-red-400 mb-3">Statistik Shorts</h3>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="bg-white/5 rounded-lg p-2.5">
                                        <div className="text-lg font-black text-white">{videos.total}</div>
                                        <div className="text-[8px] text-gray-400 uppercase font-bold tracking-wide">Total Video</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2.5">
                                        <div className="text-lg font-black text-white">48.2K</div>
                                        <div className="text-[8px] text-gray-400 uppercase font-bold tracking-wide">Short Views</div>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        {/* Right Side Main Content Grid */}
                        <div className="lg:col-span-3 space-y-4">
                            {/* Inner Header strip */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 rounded bg-red-600" />
                                    <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-white">
                                        {filters.search ? `Hasil Pencarian "${filters.search}"` : `Semua Video Shorts (${activeCategory})`}
                                    </span>
                                    <span className="rounded-full bg-red-600/10 border border-red-600/20 px-2 py-0.5 text-[9px] font-black text-red-600 ml-1">
                                        {videos.total}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-gray-400 hidden sm:inline">
                                    Menampilkan {videos.data.length} dari {videos.total} video
                                </span>

                                {/* Mobile search wrapper */}
                                <div className="flex gap-2 md:hidden w-full sm:w-auto">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                                            placeholder="Cari video..."
                                            className="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-4 pr-9 text-xs text-gray-700 focus:border-red-400 focus:outline-none dark:border-gray-600 dark:bg-gray-850 dark:text-gray-100"
                                        />
                                        <Search className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <button onClick={applySearch} className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors">
                                        Cari
                                    </button>
                                </div>
                            </div>

                            {/* Active filter badge */}
                            {filters.search && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        Hasil filter: <strong className="text-gray-800 dark:text-gray-100">"{filters.search}"</strong>
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            router.get('/videos', {});
                                        }}
                                        className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[9px] font-semibold text-gray-500 hover:border-red-400 hover:text-red-600 transition-colors flex items-center gap-1 dark:border-gray-600 dark:bg-gray-850"
                                    >
                                        <X className="size-2.5" /> Hapus
                                    </button>
                                </div>
                            )}

                            {/* Cards Area */}
                            {videos.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 py-24 text-center shadow-sm">
                                    <div className="flex size-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                                        <Video className="size-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">Belum ada video</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {filters.search ? 'Tidak ada video yang sesuai dengan pencarian Anda.' : 'Video short akan segera hadir!'}
                                        </p>
                                    </div>
                                    {filters.search && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                router.get('/videos', {});
                                            }}
                                            className="rounded-full border border-dashed border-red-300 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            Lihat Semua Video <ChevronRight className="size-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Video Grid — 9:16 cards */}
                                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                                        {videos.data.map((video) => (
                                            <VideoCard key={video.id} video={video} onSelect={setActiveVideo} />
                                        ))}
                                    </div>

                                    {/* Load more / Pagination */}
                                    {videos.last_page > 1 && (
                                        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                                            {videos.links.map((link, i) => {
                                                if (!link.url) return null;
                                                const label = link.label.replace('&laquo;', '‹').replace('&raquo;', '›');
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => link.url && router.get(link.url)}
                                                        className={`min-w-[36px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                                                            link.active
                                                                ? 'border-red-600 bg-red-600 text-white'
                                                                : 'border-gray-300 bg-white text-gray-600 hover:border-red-400 hover:text-red-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                                        }`}
                                                        aria-label={`Halaman ${label}`}
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <Footer user={auth.user} />
        </>
    );
}

PublicShortVideos.layout = (page: React.ReactNode) => page;