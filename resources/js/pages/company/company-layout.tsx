import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Header } from '@/components/welcome/header';
import { Footer } from '@/components/welcome/footer';
import { TrendingTicker } from '@/components/welcome/trending-ticker';
import { CategoryBadge } from '@/components/welcome/category-badge';
import { imageUrl } from '@/lib/utils';
import {
    ShieldCheck,
    Users,
    Scale,
    PhoneCall,
    PenTool,
    ChevronRight,
    Home,
    Building2,
    Calendar,
    Flame,
    Clock,
    Eye,
    TrendingUp,
    Sparkles,
} from 'lucide-react';

export interface ArticleSidebarItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    image?: string | null;
    published_at: string | null;
    views?: number;
}

interface CompanyLayoutProps {
    title: string;
    subtitle?: string;
    activeSlug: 'privacy' | 'editorial' | 'cyber-guidelines' | 'contact' | 'writing-terms';
    lastUpdated?: string;
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
    children: React.ReactNode;
}

const COMPANY_TABS = [
    {
        slug: 'privacy',
        title: 'Kebijakan Privasi',
        href: '/kebijakan-privasi',
        icon: ShieldCheck,
    },
    {
        slug: 'editorial',
        title: 'Susunan Redaksi',
        href: '/redaksi',
        icon: Users,
    },
    {
        slug: 'cyber-guidelines',
        title: 'Pedoman Media Siber',
        href: '/pedoman-media-siber',
        icon: Scale,
    },
    {
        slug: 'contact',
        title: 'Kontak',
        href: '/kontak',
        icon: PhoneCall,
    },
    {
        slug: 'writing-terms',
        title: 'Syarat Karya Tulis',
        href: '/syarat-karya-tulis',
        icon: PenTool,
    },
];

const CATEGORIES_LIST = [
    'Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga', 'Teknologi',
    'Hiburan', 'Lifestyle', 'Otomotif', 'Wisata',
];

function formatDateShort(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function CompanyLayout({
    title,
    subtitle,
    activeSlug,
    lastUpdated,
    beritaTerpopuler = [],
    beritaTerbaru = [],
    trendingItems = [],
    children,
}: CompanyLayoutProps) {
    const { props: { auth } } = usePage<{ auth: { user: unknown } }>();
    const [searchQuery, setSearchQuery] = useState('');
    const [trendingIndex, setTrendingIndex] = useState(0);

    const handleCategoryChange = (cat: string) => {
        router.get('/', { category: cat });
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            router.get('/', { search: searchQuery.trim() });
        }
    };

    const displayTrending = trendingItems.length > 0
        ? trendingItems
        : ['Baraya News portal berita terdepan Jawa Barat', 'Berita aktual terpercaya seputar Jawa Barat dan Nasional'];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <Head title={`${title} - Baraya News`} />

            {/* TOP HEADER */}
            <Header
                activeCategory=""
                setActiveCategory={handleCategoryChange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
            />

            {/* TRENDING TICKER */}
            <TrendingTicker
                trendingItems={displayTrending}
                trendingIndex={trendingIndex}
                setTrendingIndex={setTrendingIndex}
            />

            {/* HERO BANNER & HORIZONTAL TABS */}
            <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-[1280px] px-4 pt-6 pb-4 sm:px-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <Link href="/" className="flex items-center gap-1 hover:text-red-600 transition-colors">
                            <Home className="size-3.5" />
                            <span>Beranda</span>
                        </Link>
                        <ChevronRight className="size-3" />
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Building2 className="size-3.5" />
                            <span>Perusahaan</span>
                        </span>
                        <ChevronRight className="size-3" />
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            {title}
                        </span>
                    </nav>

                    {/* Title & Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                                PT. Kreasi Baraya Mandiri
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {lastUpdated && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 self-start sm:self-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg shrink-0">
                                <Calendar className="size-3.5" />
                                <span>Pembaruan: {lastUpdated}</span>
                            </div>
                        )}
                    </div>

                  
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-gray-100 dark:border-gray-800/80 pt-4">
                        {COMPANY_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = tab.slug === activeSlug;
                            return (
                                <Link
                                    key={tab.slug}
                                    href={tab.href}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                        isActive
                                            ? 'bg-red-600 text-white shadow-xs shadow-red-600/30'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750'
                                    }`}
                                >
                                    <Icon className="size-3.5" />
                                    <span>{tab.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

           
            <main className="flex-1 py-8">
                <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                        <div className="lg:col-span-8">
                            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 md:p-10 shadow-xs">
                                {children}
                            </div>
                        </div>

                      
                        <aside className="lg:col-span-4 space-y-6">
                            
                            {beritaTerpopuler.length > 0 && (
                                <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-800 shadow-xs">
                                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-1 rounded bg-red-600" />
                                            <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white flex items-center gap-1.5">
                                                <Flame className="size-4 text-red-600" />
                                                Berita Terpopuler
                                            </h3>
                                        </div>
                                        <Link href="/berita" className="text-[11px] font-bold text-red-600 hover:underline">
                                            Lihat Semua
                                        </Link>
                                    </div>

                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {beritaTerpopuler.map((art, idx) => {
                                            const popImg = imageUrl(art.image);
                                            return (
                                                <Link
                                                    key={art.id}
                                                    href={`/news/${art.slug}`}
                                                    className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer"
                                                >
                                                    <span
                                                        className={`shrink-0 text-xl font-black leading-none ${
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
                                                            {art.views !== undefined && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-0.5">
                                                                        <Eye className="size-2.5" />
                                                                        {art.views.toLocaleString('id-ID')}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {popImg && (
                                                        <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                            <img
                                                                src={popImg}
                                                                alt={art.title}
                                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* LATEST NEWS WIDGET */}
                            {beritaTerbaru.length > 0 && (
                                <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-800 shadow-xs">
                                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-1 rounded bg-blue-600" />
                                            <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white flex items-center gap-1.5">
                                                <TrendingUp className="size-4 text-blue-600" />
                                                Berita Terbaru
                                            </h3>
                                        </div>
                                        <Link href="/indeks" className="text-[11px] font-bold text-red-600 hover:underline">
                                            Indeks Berita
                                        </Link>
                                    </div>

                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {beritaTerbaru.map((art) => {
                                            const latestImg = imageUrl(art.image);
                                            return (
                                                <Link
                                                    key={art.id}
                                                    href={`/news/${art.slug}`}
                                                    className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer"
                                                >
                                                    {latestImg && (
                                                        <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                            <img
                                                                src={latestImg}
                                                                alt={art.title}
                                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    )}
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
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* TOPICS / CATEGORIES WIDGET */}
                            <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-800 shadow-xs">
                                <div className="mb-3 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                                    <div className="h-5 w-1 rounded bg-amber-500" />
                                    <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white flex items-center gap-1.5">
                                        <Sparkles className="size-3.5 text-amber-500" />
                                        Jelajahi Kategori
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {CATEGORIES_LIST.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryChange(cat)}
                                            className="rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <Footer user={auth.user} />
        </div>
    );
}
