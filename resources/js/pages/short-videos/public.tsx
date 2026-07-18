import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Header } from '@/components/welcome/header';
import { VideoCard } from '@/components/short-videos/video-card';
import { VideoModal } from '@/components/short-videos/video-modal';
import { TrendingTicker } from '@/components/welcome/trending-ticker';
import { Footer } from '@/components/welcome/footer';
import {
    Video, Search, ChevronRight, X, TrendingUp,
    Flame, LayoutGrid,
} from 'lucide-react';

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

interface Props {
    videos: PaginatedData;
    filters: { search?: string };
}

const TRENDING_ITEMS = [
    'Video Short Terpopuler Minggu Ini di Baraya News',
    'Jelajahi Beragam Video Pendek dari Jawa Barat',
    'Update Video Terbaru Setiap Hari dari Redaksi',
];

const CATEGORIES = [
    { label: 'Semua Video', value: 'Semua', icon: '🎬' },
    { label: 'Jawa Barat',  value: 'Jawa Barat',  icon: '🏔️' },
    { label: 'Nasional',    value: 'Nasional',    icon: '🇮🇩' },
    { label: 'Olahraga',    value: 'Olahraga',    icon: '⚽' },
    { label: 'Ekonomi',     value: 'Ekonomi',     icon: '📈' },
    { label: 'Teknologi',   value: 'Teknologi',   icon: '💻' },
    { label: 'Lifestyle',   value: 'Lifestyle',   icon: '✨' },
];

const POPULAR_TAGS = [
    '#KulinerBandung', '#ExploreJabar', '#PersibDay',
    '#WisataCiwidey', '#GedungSate', '#ShortsHariIni', '#KabarJabar',
];

export default function PublicShortVideos({ videos, filters }: Props) {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;
    const [searchQuery, setSearchQuery]   = useState(filters.search ?? '');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [activeVideo, setActiveVideo]   = useState<ShortVideo | null>(null);
    const [trendingIndex, setTrendingIndex] = useState(0);

    const applySearch = () => {
        router.get('/videos', searchQuery ? { search: searchQuery } : {}, {
            preserveState: true,
            replace: true,
        });
    };

    const activeIndex = activeVideo ? videos.data.findIndex((v) => v.id === activeVideo.id) : -1;
    const handlePrev = () => { if (activeIndex > 0) setActiveVideo(videos.data[activeIndex - 1]); };
    const handleNext = () => { if (activeIndex < videos.data.length - 1) setActiveVideo(videos.data[activeIndex + 1]); };

    return (
        <>
            <Head title="Short Videos — Baraya News">
                <meta name="description" content="Tonton video pendek berita terkini dari seluruh Indonesia, terutama Jawa Barat." />
            </Head>

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
            <Header
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* TRENDING TICKER */}
            <TrendingTicker
                trendingItems={TRENDING_ITEMS}
                trendingIndex={trendingIndex}
                setTrendingIndex={setTrendingIndex}
            />

            {/* ─── MAIN ────────────────────────────────────────────────── */}
            <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">

                {/* ─── HERO BANNER ─────────────────────────────────────── */}
                <div className="relative overflow-hidden bg-white dark:bg-[#0a0a0f]">
                    {/* Ambient glow — only visible in dark mode */}
                    <div className="absolute -top-20 -left-20 size-[400px] rounded-full bg-red-700/0 dark:bg-red-700/20 blur-[100px] pointer-events-none transition-all duration-500" />
                    <div className="absolute -bottom-20 right-0 size-[350px] rounded-full bg-indigo-700/0 dark:bg-indigo-700/15 blur-[120px] pointer-events-none transition-all duration-500" />

                    {/* Light mode subtle gradient stripe */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-white to-gray-50 dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none" />

                    <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 pt-8 pb-10">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">

                            {/* Left: heading */}
                            <div className="space-y-3 max-w-xl">
                                <div className="inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-600/15 border border-red-200 dark:border-red-600/25 px-3 py-1">
                                    <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-red-600 dark:text-red-400">
                                        Baraya Video-Shorts
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
                                    Video Berita
                                    <span className="block bg-gradient-to-r from-red-500 via-red-500 to-orange-400 bg-clip-text text-transparent">
                                        Terkini
                                    </span>
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                                    Berita singkat. Informasi cepat. Tetap terhubung dengan peristiwa penting di sekitar Anda.
                                </p>
                            </div>

                            {/* Right: Stats & Desktop Search */}
                            <div className="flex flex-col gap-3 sm:items-end">
                                <div className="flex items-center gap-3">
                                    {/* Total videos */}
                                    <div className="rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 px-4 py-2.5 text-center">
                                        <div className="text-xl font-black text-gray-800 dark:text-white">{videos.total}</div>
                                        <div className="text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-400 font-bold">Total Video</div>
                                    </div>
                                    {/* Current page */}
                                    <div className="rounded-2xl bg-red-50 dark:bg-red-600/15 border border-red-200 dark:border-red-600/25 px-4 py-2.5 text-center">
                                        <div className="text-xl font-black text-red-600 dark:text-red-400">{videos.current_page}</div>
                                        <div className="text-[9px] uppercase tracking-widest text-red-500/70 dark:text-red-400/70 font-bold">Halaman</div>
                                    </div>
                                </div>

                                {/* Desktop search */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                                            placeholder="Cari video shorts..."
                                            className="w-60 rounded-full border border-gray-200 dark:border-white/12 bg-white dark:bg-white/6 backdrop-blur-sm py-2 pl-4 pr-10 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-red-400 dark:focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20 shadow-sm dark:shadow-none transition-colors"
                                        />
                                        <Search className="absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <button
                                        onClick={applySearch}
                                        className="rounded-full bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white transition-all shadow-md shadow-red-600/25"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── BODY ────────────────────────────────────────────── */}
                <div className="mx-auto max-w-[1280px] px-4 sm:px-6 pb-16 space-y-5">

                    {/* Mobile Search */}
                    <div className="flex gap-2 sm:hidden pt-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                                placeholder="Cari video..."
                                className="w-full rounded-full border border-gray-200 dark:border-white/12 bg-white dark:bg-white/6 py-2 pl-4 pr-9 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-red-400 focus:outline-none shadow-sm transition-colors"
                            />
                            <Search className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            onClick={applySearch}
                            className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm"
                        >
                            Cari
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

                        {/* ─── SIDEBAR ─────────────────────────── */}
                        <aside className="hidden lg:flex flex-col gap-4">

                            {/* Categories */}
                            <div className="rounded-2xl bg-white dark:bg-white/4 border border-gray-200 dark:border-white/8 p-4 shadow-sm dark:shadow-none">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3 flex items-center gap-1.5">
                                    <LayoutGrid className="size-3" /> Topik Video
                                </h3>
                                <div className="flex flex-col gap-0.5">
                                    {CATEGORIES.map((cat) => {
                                        const isActive = activeCategory === cat.value;
                                        return (
                                            <button
                                                key={cat.value}
                                                onClick={() => setActiveCategory(cat.value)}
                                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                                    isActive
                                                        ? 'bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-600/30'
                                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/6 hover:text-gray-800 dark:hover:text-gray-200 border border-transparent'
                                                }`}
                                            >
                                                <span>{cat.icon}</span>
                                                <span>{cat.label}</span>
                                                {isActive && <span className="ml-auto size-1.5 rounded-full bg-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div className="rounded-2xl bg-white dark:bg-white/4 border border-gray-200 dark:border-white/8 p-4 shadow-sm dark:shadow-none">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3 flex items-center gap-1.5">
                                    <Flame className="size-3 text-orange-400" /> Tag Populer
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {POPULAR_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/6 hover:bg-red-50 dark:hover:bg-white/12 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-gray-200 border border-gray-200 dark:border-white/6 hover:border-red-200 dark:hover:border-white/15 transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tips card */}
                            <div className="rounded-2xl bg-red-50 dark:bg-gradient-to-br dark:from-red-900/30 dark:to-red-950/20 border border-red-200 dark:border-red-800/25 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="size-3.5 text-red-500 dark:text-red-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-red-500 dark:text-red-400">Tips</span>
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Klik video untuk menontonnya secara penuh. Gunakan tombol panah keyboard untuk navigasi antar video.
                                </p>
                            </div>
                        </aside>

                        {/* ─── MAIN CONTENT ────────────────────── */}
                        <div className="space-y-4">

                            {/* Toolbar */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white dark:bg-white/4 border border-gray-200 dark:border-white/8 px-4 py-3 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-4 w-0.5 rounded-full bg-red-500" />
                                    <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-white">
                                        {filters.search ? `Hasil: "${filters.search}"` : `Semua Video Shorts`}
                                    </span>
                                    <span className="rounded-full bg-red-100 dark:bg-red-600/20 border border-red-200 dark:border-red-600/30 px-2 py-0.5 text-[9px] font-black text-red-600 dark:text-red-400">
                                        {videos.total}
                                    </span>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-400">
                                    Menampilkan {videos.data.length} dari {videos.total} video
                                </span>
                            </div>

                            {/* Active filter badge */}
                            {filters.search && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Filter: <strong className="text-gray-800 dark:text-gray-200">"{filters.search}"</strong>
                                    </span>
                                    <button
                                        onClick={() => { setSearchQuery(''); router.get('/videos', {}); }}
                                        className="rounded-full border border-gray-300 dark:border-white/15 bg-white dark:bg-white/6 px-2.5 py-0.5 text-[9px] font-semibold text-gray-500 dark:text-gray-400 hover:border-red-400 dark:hover:border-red-500/50 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 shadow-sm dark:shadow-none"
                                    >
                                        <X className="size-2.5" /> Hapus
                                    </button>
                                </div>
                            )}

                            {/* Cards / Empty State */}
                            {videos.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 bg-white dark:bg-white/3 py-28 text-center shadow-sm dark:shadow-none">
                                    <div className="flex size-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/6 border border-gray-200 dark:border-white/8">
                                        <Video className="size-9 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">Belum ada video</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {filters.search
                                                ? 'Tidak ada video yang sesuai dengan pencarian.'
                                                : 'Video short akan segera hadir!'}
                                        </p>
                                    </div>
                                    {filters.search && (
                                        <button
                                            onClick={() => { setSearchQuery(''); router.get('/videos', {}); }}
                                            className="rounded-full border border-red-300 dark:border-red-800/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-600/15 px-5 py-2 text-xs font-bold transition-all flex items-center gap-2"
                                        >
                                            Lihat Semua Video <ChevronRight className="size-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Video Grid — 9:16 aspect ratio */}
                                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                                        {videos.data.map((video) => (
                                            <VideoCard key={video.id} video={video} onSelect={setActiveVideo} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {videos.last_page > 1 && (
                                        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                                            {videos.links.map((link, i) => {
                                                if (!link.url) return null;
                                                const label = link.label.replace('&laquo;', '‹').replace('&raquo;', '›');
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => link.url && router.get(link.url)}
                                                        className={`min-w-[36px] rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                                                            link.active
                                                                ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-600/25'
                                                                : 'border-gray-200 dark:border-white/12 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:border-red-400 dark:hover:border-red-600/50 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-600/10'
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