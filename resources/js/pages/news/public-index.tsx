import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Header } from '@/components/welcome/header';
import { Footer } from '@/components/welcome/footer';
import { TrendingTicker } from '@/components/welcome/trending-ticker';
import { AdBanner } from '@/components/welcome/ad-banner';
import {
    NewsHero,
    CategoryTabs,
    NewsToolbar,
    ActiveFilterBadges,
    NewsCard,
    NewsPagination,
    NewsEmptyState,
    NewsSidebar,
    DATE_OPTIONS,
    SORT_OPTIONS,
    type PublicNewsIndexProps,
} from '@/components/public-news';

export default function PublicNewsIndex({
    news: rawNews,
    filters: rawFilters,
    categories: rawCategories,
    categoryCounts: rawCategoryCounts,
    popularTags: rawPopularTags,
    beritaTerpopuler: rawBeritaTerpopuler,
    trendingItems: rawTrendingItems,
    ads: rawAds,
}: PublicNewsIndexProps) {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;

    // Safe fallbacks (Inertia may pass null or [] instead of an object/array)
    const news = rawNews ?? {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: null,
        to: null,
        links: [],
    };
    const filters = (!rawFilters || Array.isArray(rawFilters)) ? {} : rawFilters;
    const categories = rawCategories ?? [];
    const categoryCounts = rawCategoryCounts ?? {};
    const popularTags = rawPopularTags ?? [];
    const beritaTerpopuler = rawBeritaTerpopuler ?? [];
    const trendingItems = rawTrendingItems ?? [];
    const ads = rawAds ?? [];

    // Filter states
    const [search, setSearch] = useState(typeof filters.search === 'string' ? filters.search : '');
    const [activeCategory, setActiveCategory] = useState(
        typeof filters.category === 'string' && filters.category ? filters.category : 'Semua'
    );
    const [selectedSort, setSelectedSort] = useState(
        typeof filters.sort === 'string' && filters.sort ? filters.sort : 'terbaru'
    );
    const [selectedDate, setSelectedDate] = useState(typeof filters.date === 'string' ? filters.date : '');
    const [customDate, setCustomDate] = useState(
        typeof filters.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(filters.date) ? filters.date : ''
    );
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [trendingIndex, setTrendingIndex] = useState(0);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Apply URL navigation
    const applyFilters = (newParams: Partial<typeof filters>) => {
        const query: Record<string, string> = {};

        const s = newParams.search !== undefined ? newParams.search : search;
        if (s && s.trim()) query.search = s.trim();

        const c = newParams.category !== undefined ? newParams.category : activeCategory;
        if (c && c !== 'Semua' && c !== 'all' && c !== 'Indeks') query.category = c;

        const so = newParams.sort !== undefined ? newParams.sort : selectedSort;
        if (so && so !== 'terbaru') query.sort = so;

        const d = newParams.date !== undefined ? newParams.date : selectedDate;
        if (d) query.date = d;

        const t = newParams.tag !== undefined ? newParams.tag : filters.tag;
        if (t) query.tag = t;

        router.get('/berita', query, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        applyFilters({ search });
    };

    const handleCategoryClick = (cat: string) => {
        const nextCat = cat === activeCategory ? 'Semua' : cat;
        setActiveCategory(nextCat);
        applyFilters({ category: nextCat });
    };

    const handleSortChange = (newSort: string) => {
        setSelectedSort(newSort);
        applyFilters({ sort: newSort });
    };

    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);
        if (newDate !== 'custom') {
            setCustomDate('');
            applyFilters({ date: newDate });
        }
    };

    const handleCustomDateSubmit = (dateStr: string) => {
        setCustomDate(dateStr);
        setSelectedDate(dateStr);
        applyFilters({ date: dateStr });
    };

    const handleTagClick = (tag: string) => {
        const nextTag = filters.tag === tag ? undefined : tag;
        applyFilters({ tag: nextTag });
    };

    const handleClearFilters = () => {
        setSearch('');
        setActiveCategory('Semua');
        setSelectedSort('terbaru');
        setSelectedDate('');
        setCustomDate('');
        router.get('/berita', {}, { preserveState: false });
    };

    const handleShare = (slug: string, id: number) => {
        const url = `${window.location.origin}/news/${slug}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    // Calculate total count across categories
    const totalPublishedCount = Object.values(categoryCounts).reduce((a: number, b: number) => a + b, 0);

    // Active filters list
    const hasActiveFilters = Boolean(
        (filters.search && filters.search.trim()) ||
            (filters.category && filters.category !== 'Semua' && filters.category !== 'all') ||
            (filters.sort && filters.sort !== 'terbaru') ||
            filters.date ||
            filters.tag
    );

    // Ads by position
    const topAds = ads.filter((a) => a.position === 'top');
    const middleAds = ads.filter((a) => a.position === 'middle');
    const sidebarAds = ads.filter((a) => a.position === 'sidebar');

    const trendingFinal =
        trendingItems.length > 0
            ? trendingItems
            : ['Baraya News — Portal Berita Terkini & Terpercaya Jawa Barat'];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-100 flex flex-col">
            <Head>
                <title>
                    {filters.category && filters.category !== 'Semua'
                        ? `Berita ${filters.category} Terkini - Baraya News`
                        : filters.search
                        ? `Pencarian: "${filters.search}" - Baraya News`
                        : 'Semua Berita Terkini & Arsip - Baraya News'}
                </title>
                <meta
                    name="description"
                    content="Kumpulan berita terkini, terpopuler, dan liputan terlengkap dari Jawa Barat dan nasional di portal Baraya News."
                />
            </Head>

            {/* HEADER */}
            <Header
                activeCategory={activeCategory}
                setActiveCategory={(cat) => {
                    if (cat === 'Home') {
                        router.get('/');
                    } else if (cat === 'Indeks') {
                        handleCategoryClick('Semua');
                    } else {
                        handleCategoryClick(cat);
                    }
                }}
                searchQuery={search}
                setSearchQuery={setSearch}
                onSearchSubmit={handleSearchSubmit}
            />

            {/* TRENDING TICKER */}
            <TrendingTicker
                trendingItems={trendingFinal}
                trendingIndex={trendingIndex}
                setTrendingIndex={setTrendingIndex}
            />

            {/* MAIN CONTAINER */}
            <main className="flex-1 py-6 sm:py-8">
                <div className="mx-auto max-w-[1280px] px-4 sm:px-6 space-y-6">
                    {/* TOP LEADERBOARD ADS */}
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

                 

                    {/* MAIN TWO-COLUMN LAYOUT */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                        {/* LEFT: NEWS LIST / GRID */}
                        <div className="space-y-6">
                            {news.data.length > 0 ? (
                                <>
                                    {/* GRID VIEW */}
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {news.data.map((art) => (
                                                <NewsCard
                                                    key={art.id}
                                                    article={art}
                                                    viewMode="grid"
                                                    copiedId={copiedId}
                                                    onShare={handleShare}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        /* LIST VIEW */
                                        <div className="space-y-4">
                                            {news.data.map((art) => (
                                                <NewsCard
                                                    key={art.id}
                                                    article={art}
                                                    viewMode="list"
                                                    copiedId={copiedId}
                                                    onShare={handleShare}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* MIDDLE IN-FEED ADS */}
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

                                    {/* PAGINATION */}
                                    <NewsPagination
                                        currentPage={news.current_page}
                                        lastPage={news.last_page}
                                        links={news.links}
                                    />
                                </>
                            ) : (
                                /* EMPTY STATE */
                                <NewsEmptyState
                                    hasActiveFilters={hasActiveFilters}
                                    onClearFilters={handleClearFilters}
                                />
                            )}
                        </div>

                        {/* RIGHT: SIDEBAR */}
                        <NewsSidebar
                            beritaTerpopuler={beritaTerpopuler}
                            popularTags={popularTags}
                            activeTag={filters.tag}
                            onTagClick={handleTagClick}
                            customDate={customDate}
                            onCustomDateSubmit={handleCustomDateSubmit}
                            onClearCustomDate={() => {
                                setCustomDate('');
                                handleDateChange('');
                            }}
                            sidebarAds={sidebarAds}
                        />
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <Footer user={auth.user} />
        </div>
    );
}
