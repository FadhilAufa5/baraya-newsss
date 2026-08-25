import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Header } from '@/components/welcome/header';
import { TrendingTicker } from '@/components/welcome/trending-ticker';
import { AdBanner } from '@/components/welcome/ad-banner';
import { HeroSection } from '@/components/welcome/hero-section';
import { NewsSections } from '@/components/welcome/news-sections';
import { Footer } from '@/components/welcome/footer';
import { GradientPlaceholder } from '@/components/welcome/gradient-placeholder';
import { imageUrl } from '@/lib/utils';
import { VideoCard } from '@/components/short-videos/video-card';
import { VideoModal } from '@/components/short-videos/video-modal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
    id: number;
    category: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    author?: string | null;
    published_at: string | null;
    views?: number;
    reading_time?: number;
    image?: string | null;
    is_featured?: boolean;
}

interface ShortVideoItem {
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

interface Ad {
    id: number;
    title: string;
    sponsor_name: string | null;
    description: string | null;
    cta_text: string;
    cta_url: string;
    type: 'leaderboard' | 'in-feed' | 'rectangle';
    position: 'top' | 'middle' | 'sidebar';
}

interface Props {
    heroArticle: Article | null;
    sideArticles: Article[];
    beritaTerbaru: Article[];
    pilihanRedaksi: Article | null;
    beritaTerpopuler: { id: number; title: string; slug: string; published_at: string | null; views: number }[];
    trendingItems: string[];
    shortVideos: ShortVideoItem[];
    filteredArticles: Article[];
    filters: { search?: string; category?: string };
    ads: Ad[];
}



function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
    }) + ' • ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
}



export default function Welcome({
    heroArticle,
    sideArticles,
    beritaTerbaru,
    pilihanRedaksi,
    beritaTerpopuler,
    trendingItems,
    shortVideos,
    filteredArticles,
    filters,
    ads,
}: Props) {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;

    const [activeCategory, setActiveCategory] = useState(filters.category ?? 'Home');
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [trendingIndex, setTrendingIndex] = useState(0);
    const [activeVideo, setActiveVideo] = useState<ShortVideoItem | null>(null);

    const activeVideoIndex = activeVideo ? shortVideos.findIndex((v) => v.id === activeVideo.id) : -1;
    const handlePrevVideo = () => { if (activeVideoIndex > 0) setActiveVideo(shortVideos[activeVideoIndex - 1]); };
    const handleNextVideo = () => { if (activeVideoIndex < shortVideos.length - 1) setActiveVideo(shortVideos[activeVideoIndex + 1]); };

    // ── Navigation helpers ──────────────────────────────────────────────────
    const navigate = (cat: string, search: string) => {
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (cat && cat !== 'Home' && cat !== 'Indeks') params.category = cat;
        router.get('/', params, { preserveState: true, replace: true });
    };

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        navigate(cat, searchQuery);
    };

    const handleSearchChange = (q: string) => {
        setSearchQuery(q);
    };


    const handleSearchSubmit = () => {
        navigate(activeCategory, searchQuery);
    };

    // ── Derived state ───────────────────────────────────────────────────────
    const isDefaultView = (!filters.search && (!filters.category || filters.category === 'Home'));
    const isVideoStoryView = filters.category === 'Video Story';

    // Normalise article shapes for child components ─────────────────────────
    const normalise = (art: Article) => ({
        ...art,
        published_at: formatDate(art.published_at),
        image: imageUrl(art.image),
    });

    const heroNorm = heroArticle ? normalise(heroArticle) : null;
    const sideNorm = sideArticles.map(normalise);
    const terbaru = beritaTerbaru.map(normalise);
    const pilihanNorm = pilihanRedaksi ? normalise(pilihanRedaksi) : null;
    const terpopuler = beritaTerpopuler.map((a) => ({
        ...a,
        published_at: formatDate(a.published_at),
    })); 
    const filteredNorm = filteredArticles.map(normalise);

    // Fallback trending items if no real data yet ───────────────────────────
    const trendingFinal = trendingItems.length > 0
        ? trendingItems
        : ['Baraya News — Portal Berita Terkini Jawa Barat'];

    // Filter ads by position ─────────────────────────────────────────────
    const topAds = ads.filter((a) => a.position === 'top');
    const middleAds = ads.filter((a) => a.position === 'middle');
    const sidebarAds = ads.filter((a) => a.position === 'sidebar');

    return (
        <>
            <Head title="Baraya News - Portal Berita Terkini Jawa Barat" />

            {/* Modal */}
            {activeVideo && (
                <VideoModal
                    video={activeVideo as any}
                    videos={shortVideos as any}
                    onClose={() => setActiveVideo(null)}
                    onPrev={handlePrevVideo}
                    onNext={handleNextVideo}
                    auth={auth as any}
                />
            )}

            {/* TOP HEADER */}
            <Header
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryChange}
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
            />

            {/* TRENDING TICKER */}
            <TrendingTicker
                trendingItems={trendingFinal}
                trendingIndex={trendingIndex}
                setTrendingIndex={setTrendingIndex}
            />

            {/* MAIN CONTENT */}
            <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 space-y-8">

                    {/* Leaderboard Ad */}
                    {topAds.map((ad) => (
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

                    {isDefaultView && heroNorm ? (
                        <>
                            {/* HERO SECTION */}
                            <HeroSection
                                heroArticle={heroNorm}
                                sideArticles={sideNorm}
                            />

                            {/* In-feed Ad */}
                            {middleAds.map((ad) => (
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

                            {/* ROW 2: Berita Terbaru | Pilihan Redaksi | Populer */}
                            <NewsSections
                                beritaTerbaru={terbaru}
                                pilihanRedaksi={pilihanNorm ?? (terbaru[0] ?? heroNorm)}
                                shortVideos={shortVideos}
                                onSelectVideo={setActiveVideo}
                                beritaTerpopuler={terpopuler}
                            />
                        </>
                    ) : isDefaultView && !heroNorm ? (
                        /* Empty state — no published articles yet */
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full">
                                <span className="text-4xl">📰</span>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    Belum ada berita yang dipublikasikan
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Berita akan tampil di sini setelah dipublikasikan dari dashboard.
                                </p>
                            </div>
                        </div>
                    ) : isVideoStoryView ? (
                        /* VIDEO STORY GRID VIEW */
                        <div className="space-y-6">
                            <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-red-600 text-white text-xs">▶</span>
                                    Video Story
                                </h2>
                                <span className="text-xs text-gray-500 font-medium">
                                    {shortVideos.length} Video tersedia
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {shortVideos.map((vid) => (
                                    <VideoCard key={vid.id} video={vid as any} onSelect={setActiveVideo as any} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* FILTERED ARTICLES LISTING */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main list */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                        {filters.search?.trim()
                                            ? `Hasil Pencarian: "${filters.search}"`
                                            : `Kategori: ${activeCategory}`}
                                    </h2>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {filteredNorm.length} Berita ditemukan
                                    </span>
                                </div>

                                {filteredNorm.length > 0 ? (
                                    <div className="space-y-6">
                                        {filteredNorm.map((article) => (
                                            <article
                                                key={article.id}
                                                className="group flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-850 shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="relative w-full sm:w-48 h-40 sm:h-32 shrink-0 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                                                    {article.image ? (
                                                        <img
                                                            src={article.image}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <GradientPlaceholder
                                                            category={article.category}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    )}
                                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm z-10">
                                                        {article.category}
                                                    </div>
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-2">
                                                    <div className="space-y-1.5">
                                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-200 leading-snug line-clamp-2">
                                                            <a href={`/news/${article.slug}`}>{article.title}</a>
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                            {article.excerpt}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-gray-400 dark:text-gray-500 font-semibold pt-1 border-t border-gray-50 dark:border-gray-900 sm:border-0">
                                                        <span>{article.author}</span>
                                                        <span>•</span>
                                                        <span>{article.published_at}</span>
                                                        {article.views !== undefined && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{article.views.toLocaleString('id-ID')} views</span>
                                                            </>
                                                        )}
                                                        {article.reading_time !== undefined && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{article.reading_time} mnt baca</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-850 p-8 shadow-sm">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                                            <span className="text-3xl">📁</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-md font-bold text-gray-800 dark:text-gray-200">Belum ada berita</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                                                Maaf, belum ada artikel yang dipublikasikan di kategori ini saat ini.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Sidebar Ads */}
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

                                <div className="bg-white dark:bg-gray-950 p-5 rounded-xl border border-gray-200 dark:border-gray-850 shadow-sm space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                                        Terpopuler
                                    </h3>
                                    <ul className="divide-y divide-gray-100 dark:divide-gray-800 space-y-3">
                                        {terpopuler.map((item, idx) => (
                                            <li key={item.id} className="group flex gap-3 pt-3 first:pt-0">
                                                <span className="text-2xl font-black text-gray-200 dark:text-gray-800 group-hover:text-red-500/50 transition-colors shrink-0 leading-none">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                                                        <a href={`/news/${item.slug}`}>{item.title}</a>
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.published_at}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* FOOTER */}
            <Footer user={auth.user} />
        </>
    );
}
