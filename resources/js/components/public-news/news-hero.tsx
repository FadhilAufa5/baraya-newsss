import React from 'react';
import { Newspaper, Search, Sparkles, X } from 'lucide-react';

interface NewsHeroProps {
    search: string;
    onSearchChange: (val: string) => void;
    onSearchSubmit: (e?: React.FormEvent) => void;
    onClearSearch: () => void;
}

export function NewsHero({
    search,
    onSearchChange,
    onSearchSubmit,
    onClearSearch,
}: NewsHeroProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-rose-900 p-6 sm:p-8 text-white shadow-lg">
            <div className="absolute -right-10 -bottom-10 size-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute right-12 top-6 hidden lg:block opacity-15 pointer-events-none">
                <Newspaper className="size-44 text-white" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                    <Sparkles className="size-3.5 text-yellow-300" />
                    <span>Indeks & Direktori Berita</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    Semua Berita Baraya News
                </h1>
                <p className="text-xs sm:text-sm text-red-100 leading-relaxed max-w-xl">
                    Akses seluruh arsip liputan jurnalistik, kabar terkini Jawa Barat, nasional, ekonomi, teknologi, hingga olahraga secara komprehensif.
                </p>

                {/* Integrated Hero Search */}
                <form
                    onSubmit={onSearchSubmit}
                    className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg"
                >
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Ketik kata kunci berita..."
                            className="w-full rounded-xl bg-white/95 px-4 py-2.5 pl-10 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/40 shadow-xs"
                        />
                        <Search className="size-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        {search && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                aria-label="Hapus kata kunci pencarian"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl bg-gray-900 hover:bg-black px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <Search className="size-3.5" />
                        <span>Cari Berita</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
