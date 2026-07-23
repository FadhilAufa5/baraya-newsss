import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Header } from '@/components/welcome/header';
import { Footer } from '@/components/welcome/footer';
import { GradientPlaceholder } from '@/components/welcome/gradient-placeholder';
import {
    Calendar, Clock, Eye, Globe, ChevronRight,
    ArrowLeft, UserPlus, UserCheck,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileUser {
    id: number;
    name: string;
    bio: string | null;
    avatar: string | null;
    cover_image: string | null;
    website: string | null;
    social_links: Record<string, string>;
    followers_count: number;
    following_count: number;
    is_following: boolean;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    image: string | null;
    published_at: string | null;
    views: number;
}

interface PaginatedData {
    data: Article[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    profileUser: ProfileUser;
    articles: PaginatedData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(s: string | null): string {
    if (!s) return '';
    return new Date(s).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

function formatDateShort(s: string | null): string {
    if (!s) return '';
    const d = new Date(s);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function imageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
}

const CATEGORY_COLORS: Record<string, string> = {
    Nasional: 'bg-red-600 text-white',
    Internasional: 'bg-blue-600 text-white',
    Politik: 'bg-violet-600 text-white',
    Ekonomi: 'bg-emerald-600 text-white',
    Olahraga: 'bg-orange-500 text-white',
    Teknologi: 'bg-cyan-600 text-white',
    Hiburan: 'bg-pink-500 text-white',
    Kesehatan: 'bg-teal-600 text-white',
    Pendidikan: 'bg-indigo-600 text-white',
    Budaya: 'bg-amber-600 text-white',
    Lingkungan: 'bg-lime-600 text-white',
    Hukum: 'bg-slate-600 text-white',
    Umum: 'bg-gray-500 text-white',
};

const CATEGORY_TEXT: Record<string, string> = {
    Nasional: 'text-red-600',
    Internasional: 'text-blue-600',
    Politik: 'text-violet-600',
    Ekonomi: 'text-emerald-600',
    Olahraga: 'text-orange-500',
    Teknologi: 'text-cyan-600',
    Hiburan: 'text-pink-500',
    Kesehatan: 'text-teal-600',
    Pendidikan: 'text-indigo-600',
    Budaya: 'text-amber-600',
    Lingkungan: 'text-lime-600',
    Hukum: 'text-slate-600',
    Umum: 'text-gray-500',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PublicProfile({ profileUser, articles }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;

    const [activeCategory, setActiveCategory] = useState('Home');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        router.visit('/', { data: cat !== 'Home' ? { category: cat } : {} });
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            router.visit('/', { data: { search: searchQuery.trim() } });
        }
    };

    const coverUrl = imageUrl(profileUser.cover_image);
    const avatarUrl = imageUrl(profileUser.avatar);

    return (
        <>
            <Head title={`${profileUser.name} – Baraya News`} />

            <Header
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryChange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
            />

            <div className="bg-white dark:bg-gray-950 min-h-screen">
                {/* Cover Image */}
                <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-gradient-to-br from-red-500 to-red-700">
                    {coverUrl && (
                        <img
                            src={coverUrl}
                            alt={`${profileUser.name} cover`}
                            className="h-full w-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="mx-auto max-w-[900px] px-4 sm:px-6">
                    {/* Profile Header */}
                    <div className="relative -mt-16 sm:-mt-20 mb-8 flex flex-col sm:flex-row items-start sm:items-end gap-5">
                        {/* Avatar */}
                        <div className="shrink-0">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={profileUser.name}
                                    className="size-28 sm:size-32 rounded-full border-4 border-white dark:border-gray-950 object-cover shadow-lg"
                                />
                            ) : (
                                <div className="size-28 sm:size-32 rounded-full border-4 border-white dark:border-gray-950 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg">
                                    <span className="text-4xl font-black text-white select-none">
                                        {profileUser.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Name + Stats */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white truncate">
                                    {profileUser.name}
                                </h1>
                                {auth.user && auth.user.id !== profileUser.id && (
                                    <button
                                        onClick={() => router.post(`/api/follow/${profileUser.id}`, {}, { preserveScroll: true })}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors shadow-sm ${
                                            profileUser.is_following
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                    >
                                        {profileUser.is_following ? (
                                            <>
                                                <UserCheck className="size-3.5" />
                                                Mengikuti
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="size-3.5" />
                                                Ikuti
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    {profileUser.followers_count.toLocaleString('id-ID')} pengikut
                                </span>
                                <span className="font-semibold">
                                    {profileUser.following_count.toLocaleString('id-ID')} mengikuti
                                </span>
                                <span>
                                    {articles.total} artikel
                                </span>
                            </div>

                            {profileUser.bio && (
                                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                                    {profileUser.bio}
                                </p>
                            )}

                            {profileUser.website && (
                                <a
                                    href={profileUser.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                                >
                                    <Globe className="size-3.5" />
                                    {profileUser.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 dark:bg-gray-800 mb-8" />

                    {/* Articles */}
                    <div className="mb-12">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                            Artikel oleh {profileUser.name}
                        </h2>

                        {articles.data.length > 0 ? (
                            <div className="space-y-5">
                                {articles.data.map((article) => {
                                    const catColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-500 text-white';
                                    const catText = CATEGORY_TEXT[article.category] ?? 'text-gray-600';
                                    const imgUrl = imageUrl(article.image);

                                    return (
                                        <a
                                            key={article.id}
                                            href={`/news/${article.id}`}
                                            className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/20 dark:hover:bg-red-950/10 transition-colors"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-full sm:w-[200px] h-[130px] sm:h-[120px] shrink-0 rounded-lg overflow-hidden">
                                                {imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <GradientPlaceholder category={article.category} className="w-full h-full" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col justify-center min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`${catColor} text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm`}>
                                                        {article.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 leading-snug transition-colors">
                                                    {article.title}
                                                </h3>
                                                {article.excerpt && (
                                                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                                                    {article.published_at && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="size-3" />
                                                            {formatDate(article.published_at)}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="size-3" />
                                                        {article.views.toLocaleString('id-ID')} dibaca
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-10 text-center">
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Belum ada artikel yang dipublikasikan.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {articles.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {articles.links.map((link, idx) => {
                                    const label = link.label.replace('&laquo;', '‹').replace('&raquo;', '›');
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                link.active
                                                    ? 'bg-red-600 text-white'
                                                    : link.url
                                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer user={auth.user} />
        </>
    );
}

PublicProfile.layout = (page: React.ReactNode) => page;
