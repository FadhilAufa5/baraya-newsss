import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Radio, Search, User, Video } from 'lucide-react';
import { login, dashboard } from '@/routes';

export const VIDEO_CATEGORIES = ['Semua', 'Jawa Barat', 'Nasional', 'Olahraga', 'Ekonomi', 'Teknologi', 'Lifestyle'];

interface VideoHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearch: () => void;
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
}

export function VideoHeader({
    searchQuery,
    setSearchQuery,
    onSearch,
    activeCategory,
    setActiveCategory,
}: VideoHeaderProps) {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-950">
            <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
                {/* Logo */}
                <Link href="/" className="shrink-0">
                    <div className="flex items-baseline gap-0.5 leading-none">
                        <span className="font-black text-2xl text-red-600 tracking-tight">baraya</span>
                        <span className="font-black text-2xl text-gray-800 tracking-tight dark:text-white">news</span>
                    </div>
                    <div className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">Portal Berita Terkini Jawa Barat</div>
                </Link>

                {/* Search */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <input
                        id="video-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        placeholder="Cari video pendek..."
                        className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <button onClick={onSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                        <Search className="size-4" />
                    </button>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button className="hidden sm:flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        <Radio className="size-3.5 text-red-500 animate-pulse" /> Live TV
                    </button>
                    <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                        <Video className="size-3.5 text-red-600" /> Video
                    </span>
                    <button className="relative size-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200">
                        <Bell className="size-4" />
                        <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">3</span>
                    </button>

                    {auth.user ? (
                        <Link href={dashboard()} className="flex items-center gap-2 rounded-full border border-gray-200 pl-2 pr-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 transition-colors">
                            <span className="flex size-7 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">A</span>
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={login()} className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm">
                                <User className="size-3.5" /> Masuk
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Navbar */}
            <nav className="border-t border-gray-100 bg-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-[1280px] overflow-x-auto px-4 sm:px-6">
                    <ul className="flex items-center whitespace-nowrap">
                        <li>
                            <Link href="/" className="relative px-3 py-3 text-xs font-bold uppercase tracking-wide transition-colors text-gray-400 hover:text-white inline-block">
                                Berita
                            </Link>
                        </li>
                        {VIDEO_CATEGORIES.map((cat) => (
                            <li key={cat}>
                                <button
                                    onClick={() => setActiveCategory(cat)}
                                    className={`relative px-3 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                                        activeCategory === cat
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
