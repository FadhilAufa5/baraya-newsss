import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Radio, Search, User, Video, Sun, Moon } from 'lucide-react';
import { login, register, dashboard } from '@/routes';
import { useAppearance } from '@/hooks/use-appearance';

import AppLogoIcon from '@/components/app-logo-icon';

export const CATEGORIES = [
    'Home', 'Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga',
    'Teknologi', 'Lifestyle', 'Otomotif', 'Indeks'
];

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
    const { props: { auth } } = usePage<{ auth?: { user?: any } }>();
    const { appearance, updateAppearance } = useAppearance();
    const resolvedAppearance = appearance;
    const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

    const toggleAppearance = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-xs dark:border-gray-700 dark:bg-gray-950">
            {/* Top bar */}
            <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
                {/* Logo */}
                <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
                    <AppLogoIcon className="h-9 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
                    <div>
                        <div className="flex items-baseline gap-0.5 leading-none">
                            <span className="font-black text-2xl text-red-600 tracking-tight">baraya</span>
                            <span className="font-black text-2xl text-gray-800 tracking-tight dark:text-white">news</span>
                        </div>
                        <div className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">Portal Berita Terkini Jawa Barat</div>
                    </div>
                </Link>

                {/* Search */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.()}
                        placeholder="Cari berita, topik atau lokasi..."
                        className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <button
                        onClick={() => onSearchSubmit?.()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    >
                        <Search className="size-4" />
                    </button>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* <button className="hidden sm:flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        <Radio className="size-3.5 text-red-500 animate-pulse" /> Live TV
                    </button> */}
                    <Link href="/videos" className="hidden sm:flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 transition-colors">
                        <Video className="size-3.5" /> Video
                    </Link>

                    {/* Search button on mobile */}
                    <button
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className="flex md:hidden size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200"
                        aria-label="Cari berita"
                    >
                        <Search className="size-4" />
                    </button>

                    {/* <button className="relative size-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200">
                        <Bell className="size-4" />
                        <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">3</span>
                    </button> */}

                    <button
                        onClick={toggleAppearance}
                        className="relative size-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 transition-colors duration-200"
                        title={resolvedAppearance === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="size-4 text-amber-500 hover:rotate-45 transition-transform duration-300" />
                        ) : (
                            <Moon className="size-4 hover:-rotate-12 transition-transform duration-300" />
                        )}
                    </button>

                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="flex items-center gap-2 rounded-full border border-gray-200 pl-2 pr-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 transition-colors"
                        >
                            <span className="flex size-7 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">A</span>
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* <Link
                                href={login()}
                                className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                            >
                               Masuk
                            </Link> */}
                            <Link
                                href={login()}
                                className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
                            >
                                <User className="size-3.5 mr-1" />Masuk
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search input */}
            {mobileSearchOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-2.5 bg-gray-55 dark:bg-gray-900 transition-all duration-300">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berita, topik atau lokasi..."
                            className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm text-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                            autoFocus
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                            <Search className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Category Navbar */}
            <nav className="border-t border-gray-100 bg-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-[1280px] overflow-x-auto px-4 sm:px-6">
                    <ul className="flex items-center whitespace-nowrap">
                        {CATEGORIES.map((cat) => (
                            <li key={cat}>
                                <button
                                    onClick={() => setActiveCategory(cat)}
                                    className={`relative px-3 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeCategory === cat
                                            ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
