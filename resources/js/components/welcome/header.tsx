import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Menu,
    X,
    Search,
    User,
    Video,
    Sun,
    Moon,
    Home,
    Globe,
    MapPin,
    TrendingUp,
    Trophy,
    Cpu,
    Sparkles,
    Car,
    Layers,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Flame,
} from 'lucide-react';
import { login, dashboard } from '@/routes';
import { useAppearance } from '@/hooks/use-appearance';

export const CATEGORIES = [
    'Home', 'Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga',
    'Teknologi', 'Lifestyle', 'Otomotif', 'Indeks'
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'Home': Home,
    'Jawa Barat': MapPin,
    'Nasional': Globe,
    'Ekonomi': TrendingUp,
    'Olahraga': Trophy,
    'Teknologi': Cpu,
    'Lifestyle': Sparkles,
    'Otomotif': Car,
    'Indeks': Layers,
};

interface HeaderProps {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearchSubmit?: () => void;
}

export function Header({
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
}: HeaderProps) {
    const { props: { auth } } = usePage<{ auth: { user: any, roles?: string[], permissions?: string[] } }>();
    const { appearance, updateAppearance } = useAppearance();
    const resolvedAppearance = appearance;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const toggleAppearance = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const handleCategoryClick = (categoryName: string) => {
        if (categoryName === 'Indeks') {
            router.get('/berita');
            setMobileMenuOpen(false);
            return;
        }
        setActiveCategory(categoryName);
        setMobileMenuOpen(false);
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (onSearchSubmit) {
            onSearchSubmit();
        }
        setMobileSearchOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-xs transition-colors dark:border-gray-800 dark:bg-gray-950/95">
                {/* ── Top Bar ────────────────────────────────────────────── */}
                <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
                    {/* Brand Logo */}
                    <Link href="/" className="shrink-0 flex items-center group">
                        <img
                            src="/logobaraya.png"
                            alt="Baraya News"
                            className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berita, topik, atau lokasi..."
                                className="w-full rounded-full border border-gray-250 bg-gray-50/80 py-2 pl-4 pr-10 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-red-500 dark:focus:bg-gray-900"
                            />
                            <button
                                type="submit"
                                aria-label="Cari"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Search className="size-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {/* Video Story Button (Tablet & Desktop) */}
                        <Link
                            href="/videos"
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/60 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                        >
                            <Video className="size-3.5" />
                            <span>Video</span>
                        </Link>

                        {/* Mobile Search Toggle Button */}
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className={`flex md:hidden size-9 items-center justify-center rounded-full border transition-colors ${
                                mobileSearchOpen
                                    ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800'
                            }`}
                            aria-label="Toggle Pencarian"
                        >
                            <Search className="size-4" />
                        </button>

                        {/* Dark/Light Mode Switcher */}
                        <button
                            onClick={toggleAppearance}
                            className="size-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                            title={resolvedAppearance === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                            aria-label="Toggle Tema"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="size-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                            ) : (
                                <Moon className="size-4 text-gray-700 transition-transform duration-300 hover:-rotate-12" />
                            )}
                        </button>

                        {/* Desktop Auth Button */}
                        <div className="hidden sm:flex items-center">
                            {auth.user ? (
                                auth.permissions?.includes('access dashboard') ? (
                                    <Link
                                        href={dashboard()}
                                        className="flex items-center gap-2 rounded-full border border-gray-200 pl-1.5 pr-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span className="flex size-6 items-center justify-center rounded-full bg-red-600 text-white text-[11px] font-bold">
                                            {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                    >
                                        <LogOut className="size-3.5" />
                                        <span>Keluar</span>
                                    </Link>
                                )
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-xs"
                                >
                                    <User className="size-3.5" />
                                    <span>Masuk</span>
                                </Link>
                            )}
                        </div>

                        {/* ── Hamburger Menu Button (Mobile & Tablet) ── */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`flex md:hidden size-9 items-center justify-center rounded-full border transition-all duration-200 ${
                                mobileMenuOpen
                                    ? 'border-red-500 bg-red-600 text-white shadow-sm'
                                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                            }`}
                            aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <X className="size-5 transition-transform duration-200 rotate-90 scale-100" />
                            ) : (
                                <Menu className="size-5 transition-transform duration-200" />
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Expandable Mobile Search Bar ──────────────────────── */}
                {mobileSearchOpen && (
                    <div className="md:hidden border-t border-gray-100 dark:border-gray-800/80 px-4 py-2.5 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berita, topik, atau lokasi..."
                                className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                aria-label="Cari"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600 rounded-full"
                            >
                                <Search className="size-4" />
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Desktop Category Navigation Bar ───────────────────── */}
                <nav className="border-t border-gray-100 bg-gray-900 text-white dark:border-gray-800 dark:bg-gray-900/95 shadow-inner">
                    <div className="mx-auto max-w-[1280px] overflow-x-auto no-scrollbar px-4 sm:px-6">
                        <ul className="flex items-center gap-1 sm:gap-2 whitespace-nowrap py-1">
                            {CATEGORIES.map((cat) => {
                                const Icon = CATEGORY_ICONS[cat] ?? Layers;
                                const isActive = activeCategory === cat;
                                return (
                                    <li key={cat}>
                                        <button
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`group relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${
                                                isActive
                                                    ? 'text-white bg-red-600/90 shadow-xs'
                                                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            }`}
                                        >
                                            <Icon className={`size-3.5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-red-400'}`} />
                                            <span>{cat}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </header>

            {/* ── Mobile Navigation Drawer & Backdrop ─────────────────────── */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer Panel */}
                    <div className="relative z-50 flex h-full w-[85%] max-w-sm flex-col justify-between bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                                <img
                                    src="/logobaraya.png"
                                    alt="Baraya News"
                                    className="h-8 w-auto object-contain"
                                />
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="size-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Tutup Menu"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Drawer Body (Scrollable) */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                            {/* Drawer Search */}
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari berita..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600"
                                    aria-label="Cari"
                                >
                                    <Search className="size-4" />
                                </button>
                            </form>

                            {/* Quick Video Link */}
                            <Link
                                href="/videos"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between rounded-xl bg-gradient-to-r from-red-600 to-rose-600 p-3 text-white shadow-md hover:from-red-700 hover:to-rose-700 transition-all"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-white/20">
                                        <Video className="size-4 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black uppercase tracking-wider">Video Story</div>
                                        <div className="text-[10px] text-red-100">Tonton berita video terkini</div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                                    <Flame className="size-3 text-amber-300" /> Hot
                                </span>
                            </Link>

                            {/* Categories List */}
                            <div className="space-y-1">
                                <div className="px-2 pb-1.5 text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Kategori Berita
                                </div>
                                <div className="space-y-0.5">
                                    {CATEGORIES.map((cat) => {
                                        const Icon = CATEGORY_ICONS[cat] ?? Layers;
                                        const isActive = activeCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => handleCategoryClick(cat)}
                                                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-bold transition-all ${
                                                    isActive
                                                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-extrabold'
                                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={`size-4 transition-colors ${isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500'}`} />
                                                    <span>{cat}</span>
                                                </div>
                                                <ChevronRight className={`size-3.5 transition-transform ${isActive ? 'text-red-600 dark:text-red-400 translate-x-0.5' : 'text-gray-300 dark:text-gray-600 group-hover:translate-x-0.5'}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer (Auth & Theme) */}
                        <div className="border-t border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50 space-y-3">
                            {/* User Section */}
                            {auth.user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 px-1">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-red-600 text-white text-xs font-black">
                                            {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                                {auth.user.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                {auth.user.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        {auth.permissions?.includes('access dashboard') && (
                                            <Link
                                                href={dashboard()}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 py-2 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <LayoutDashboard className="size-3.5" />
                                                <span>Dashboard</span>
                                            </Link>
                                        )}
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                                !auth.permissions?.includes('access dashboard') ? 'col-span-2' : ''
                                            }`}
                                        >
                                            <LogOut className="size-3.5" />
                                            <span>Keluar</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={login()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-red-700 transition-colors"
                                >
                                    <User className="size-4" />
                                    <span>Masuk ke Akun</span>
                                </Link>
                            )}

                            {/* Theme Toggle & Copyright */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-800/80 text-[11px] text-gray-500">
                                <span>Tema Tampilan</span>
                                <button
                                    onClick={toggleAppearance}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300"
                                >
                                    {resolvedAppearance === 'dark' ? (
                                        <>
                                            <Sun className="size-3 text-amber-400" />
                                            <span>Gelap</span>
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="size-3 text-gray-600" />
                                            <span>Terang</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

