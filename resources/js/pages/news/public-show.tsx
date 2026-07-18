import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Header } from '@/components/welcome/header';
import { Footer } from '@/components/welcome/footer';
import { GradientPlaceholder } from '@/components/welcome/gradient-placeholder';
import {
    Clock, Eye, User, Calendar, Tag, ChevronRight, ArrowLeft,
    Share2, Facebook, Twitter, Link2, CheckCheck, Flame,
    MessageSquare, Send, Trash2, LogIn, Lock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Comment {
    id: number;
    body: string;
    created_at: string;
    user_id: number;
    user?: {
        id: number;
        name: string;
    };
}

interface Article {
    id: number;
    title: string;
    slug: string;
    category: string;
    author: string | null;
    excerpt: string | null;
    content: string;
    image: string | null;
    image_caption: string | null;
    meta_description: string | null;
    tags: string[] | null;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    published_at: string | null;
    views: number;
    reading_time: number;
    user?: { name: string };
    comments: Comment[];
    created_at: string;
}

interface RelatedArticle {
    id: number;
    title: string;
    slug: string;
    category: string;
    image: string | null;
    published_at: string | null;
    excerpt: string | null;
    views: number;
}

interface Props {
    article: Article;
    related: RelatedArticle[];
    others?: RelatedArticle[];
    canManageComments: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(s: string | null): string {
    if (!s) return '';
    return new Date(s).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
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

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div className="fixed top-0 left-0 z-[60] h-[3px] w-full bg-transparent">
            <div
                className="h-full bg-red-600 transition-all duration-100"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

// ─── Share Buttons ────────────────────────────────────────────────────────────

function ShareButtons({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const copyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Share2 className="size-3.5" /> Bagikan:
            </span>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-[#1877f2] text-white hover:bg-[#166fe5] transition-colors"
                aria-label="Share to Facebook"
            >
                <Facebook className="size-4" />
            </a>
            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                aria-label="Share to X (Twitter)"
            >
                <Twitter className="size-4" />
            </a>
            <button
                onClick={copyLink}
                className="flex size-8 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-600 transition-colors"
                aria-label="Copy link"
            >
                {copied ? <CheckCheck className="size-4 text-green-500" /> : <Link2 className="size-4" />}
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PublicShowNews({ article, related, others = [] }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string; roles?: string[] } | null } }>().props;

    const [activeCategory, setActiveCategory] = useState('Home');
    const [searchQuery, setSearchQuery]       = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/news/${article.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset('body'),
        });
    };

    const deleteComment = (commentId: number) => {
        router.delete(`/comments/${commentId}`, {
            preserveScroll: true,
        });
    };

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        router.visit('/', { data: cat !== 'Home' ? { category: cat } : {} });
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            router.visit('/', { data: { search: searchQuery.trim() } });
        }
    };

    const imgUrl   = imageUrl(article.image);
    const catColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-500 text-white';
    const catText  = CATEGORY_TEXT[article.category] ?? 'text-gray-600';

    return (
        <>
            <Head title={`${article.title} – Baraya News`}>
                <meta name="description" content={article.meta_description ?? article.excerpt ?? article.title} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt ?? ''} />
                <meta property="og:image" content={imgUrl ?? ''} />
                <meta property="og:type" content="article" />
            </Head>

            {/* Reading progress */}
            <ReadingProgress />

            {/* HEADER */}
            <Header
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryChange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
            />

            {/* MAIN */}
            <div className="bg-white dark:bg-gray-950 min-h-screen">
                <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">

                    {/* Breadcrumb */}
                    <nav className="mb-5 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <a href="/" className="hover:text-red-600 transition-colors">Beranda</a>
                        <ChevronRight className="size-3 shrink-0" />
                        <button
                            onClick={() => handleCategoryChange(article.category)}
                            className={`font-semibold hover:underline transition-colors ${catText}`}
                        >
                            {article.category}
                        </button>
                        <ChevronRight className="size-3 shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium line-clamp-1 max-w-[200px] sm:max-w-xs">
                            {article.title}
                        </span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 xl:gap-14">

                        {/* ══════════════════════ ARTICLE ══════════════════════ */}
                        <article className="min-w-0">

                            {/* Category pill */}
                            <div className="mb-4 flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => handleCategoryChange(article.category)}
                                    className={`${catColor} text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-sm hover:opacity-90 transition-opacity`}
                                >
                                    {article.category}
                                </button>
                                {article.is_featured && (
                                    <span className="flex items-center gap-1 bg-amber-50 border border-amber-300 text-amber-700 dark:bg-amber-900/20 dark:border-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-sm">
                                        ⭐ Artikel Unggulan
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-[1.6rem] sm:text-[2rem] md:text-[2.2rem] font-extrabold leading-[1.2] tracking-tight text-gray-900 dark:text-white">
                                {article.title}
                            </h1>

                            {/* Excerpt */}
                            {article.excerpt && (
                                <p className="mt-4 text-[1.05rem] leading-relaxed text-gray-500 dark:text-gray-400 font-normal">
                                    {article.excerpt}
                                </p>
                            )}

                            {/* Divider */}
                            <div className="my-5 h-px bg-gray-100 dark:bg-gray-800" />

                            {/* Author + Meta row */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-black text-sm select-none">
                                        {(article.author ?? article.user?.name ?? 'R').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                            {article.author ?? article.user?.name ?? 'Redaksi Baraya News'}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            {article.published_at && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3" />
                                                    {formatDate(article.published_at)}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {article.reading_time} menit baca
                                            </span>
                                            {/* <span className="flex items-center gap-1">
                                                <Eye className="size-3" />
                                                {article.views.toLocaleString('id-ID')} dibaca
                                            </span> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Share inline */}
                                <div className="hidden sm:block">
                                    <ShareButtons title={article.title} />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="my-5 h-px bg-gray-100 dark:bg-gray-800" />

                            {/* Hero Image */}
                            {imgUrl ? (
                                <figure className="mb-8 -mx-4 sm:mx-0 overflow-hidden sm:rounded-2xl shadow-sm">
                                    <img
                                        src={imgUrl}
                                        alt={article.title}
                                        className="w-full max-h-[520px] object-cover"
                                    />
                                    {article.image_caption && (
                                        <figcaption className="mt-2 px-4 sm:px-0 text-center text-xs text-gray-400 italic">
                                            {article.image_caption}
                                        </figcaption>
                                    )}
                                </figure>
                            ) : (
                                <div className="mb-8 -mx-4 sm:mx-0 overflow-hidden sm:rounded-2xl">
                                    <GradientPlaceholder category={article.category} className="w-full h-64 sm:h-80" />
                                </div>
                            )}

                            {/* Article Body */}
                            <div
                                className="
                                    prose dark:prose-invert max-w-none
                                    prose-p:text-[1.05rem] prose-p:leading-[1.8] prose-p:text-gray-700 dark:prose-p:text-gray-300
                                    prose-headings:font-extrabold prose-headings:text-gray-900 dark:prose-headings:text-white
                                    prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                                    prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                                    prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:bg-red-50 dark:prose-blockquote:bg-red-950/20
                                    prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                                    prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                                    prose-a:text-red-600 hover:prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-xl prose-img:shadow-md
                                    prose-strong:text-gray-900 dark:prose-strong:text-white
                                    prose-li:text-gray-700 dark:prose-li:text-gray-300
                                    prose-ul:my-4 prose-ol:my-4
                                "
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* Divider */}
                            <div className="mt-10 h-px bg-gray-100 dark:bg-gray-800" />

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="mt-6 flex flex-wrap items-center gap-2">
                                    <Tag className="size-3.5 text-gray-400 shrink-0" />
                                    {article.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-600 cursor-pointer transition-colors"
                                        >
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Bottom Share */}
                            <div className="mt-6 flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Bagikan artikel ini</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Bantu sebarkan berita ini ke orang-orang di sekitarmu</p>
                                </div>
                                <ShareButtons title={article.title} />
                            </div>

                            {/* Back + more category */}
                            <div className="mt-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-8">
                                <a
                                    href="/"
                                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <ArrowLeft className="size-4" />
                                    Kembali ke Beranda
                                </a>
                                <button
                                    onClick={() => handleCategoryChange(article.category)}
                                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${catText}`}
                                >
                                    Berita {article.category} lainnya
                                    <ChevronRight className="size-3" />
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-12 space-y-6">
                                <div className="flex items-center gap-2 border-b border-gray-150 pb-3 dark:border-gray-800">
                                    <MessageSquare className="size-5 text-gray-500" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Komentar ({article.comments?.length || 0})
                                    </h3>
                                </div>

                                {auth.user ? (
                                    <form onSubmit={submitComment} className="space-y-3">
                                        <div className="flex gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-black text-xs">
                                                {auth.user.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    value={data.body}
                                                    onChange={(e) => setData('body', e.target.value)}
                                                    placeholder="Tulis komentar Anda di sini..."
                                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                                    rows={3}
                                                    maxLength={1000}
                                                />
                                                {errors.body && (
                                                    <p className="mt-1 text-xs text-red-500">{errors.body}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing || data.body.trim().length < 3}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                <Send className="size-3.5" />
                                                Kirim Komentar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            Silakan masuk terlebih dahulu untuk mengirim komentar.
                                        </p>
                                        <a
                                            href="/auth/google/redirect"
                                            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                            </svg>
                                            Masuk dengan Google
                                        </a>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {article.comments && article.comments.length > 0 ? (
                                        article.comments.map((comment) => {
                                            const canDelete = auth.user && (
                                                auth.user.id === comment.user_id ||
                                                auth.user.roles?.includes('Super Admin') ||
                                                auth.user.roles?.includes('Editor')
                                            );

                                            return (
                                                <div key={comment.id} className="flex gap-3">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-150 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs select-none">
                                                        {(comment.user?.name ?? 'U').slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 p-3.5">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                                                    {comment.user?.name ?? 'Pembaca'}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                                                    {formatDateShort(comment.created_at)} • {new Date(comment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                                </p>
                                                            </div>
                                                            {canDelete && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => deleteComment(comment.id)}
                                                                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-semibold"
                                                                >
                                                                    <Trash2 className="size-3" />
                                                                    Hapus
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                            {comment.body}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400 dark:border-gray-800 bg-gray-50/10">
                                            Belum ada komentar. Jadilah yang pertama memberikan tanggapan!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>

                        {/* ══════════════════════ SIDEBAR ══════════════════════ */}
                        <aside className="space-y-6">

                            {/* Related Articles */}
                            {related.length > 0 && (
                                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                        <div className="h-4 w-1 rounded-full bg-red-600" />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
                                            Berita Terkait
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {related.map((art, idx) => (
                                            <a
                                                key={art.id}
                                                href={`/news/${art.id}`}
                                                className="group flex gap-3 p-3.5 hover:bg-red-50/40 dark:hover:bg-gray-800/40 transition-colors"
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-[72px] h-[54px] shrink-0 rounded-lg overflow-hidden">
                                                    {imageUrl(art.image) ? (
                                                        <img
                                                            src={imageUrl(art.image)!}
                                                            alt={art.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <GradientPlaceholder category={art.category} className="w-full h-full" />
                                                    )}
                                                </div>
                                                {/* Text */}
                                                <div className="flex flex-col justify-center gap-1 min-w-0">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider ${catText}`}>
                                                        {art.category}
                                                    </span>
                                                    <h4 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 leading-snug transition-colors">
                                                        {art.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                        {formatDateShort(art.published_at)}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                                        <button
                                            onClick={() => handleCategoryChange(article.category)}
                                            className={`text-[11px] font-bold hover:underline flex items-center gap-1 ${catText}`}
                                        >
                                            Lihat semua berita {article.category}
                                            <ChevronRight className="size-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Other Articles */}
                            {others.length > 0 && (
                                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                        <div className="h-4 w-1 rounded-full bg-blue-600" />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
                                            Artikel Lainnya
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {others.map((art) => (
                                            <a
                                                key={art.id}
                                                href={`/news/${art.id}`}
                                                className="group flex gap-3 p-3.5 hover:bg-blue-50/40 dark:hover:bg-gray-800/40 transition-colors"
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-[72px] h-[54px] shrink-0 rounded-lg overflow-hidden">
                                                    {imageUrl(art.image) ? (
                                                        <img
                                                            src={imageUrl(art.image)!}
                                                            alt={art.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <GradientPlaceholder category={art.category} className="w-full h-full" />
                                                    )}
                                                </div>
                                                {/* Text */}
                                                <div className="flex flex-col justify-center gap-1 min-w-0">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400`}>
                                                        {art.category}
                                                    </span>
                                                    <h4 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 leading-snug transition-colors">
                                                        {art.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                        {formatDateShort(art.published_at)}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trending / Hot topics */}
                            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <Flame className="size-3.5 text-red-500" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
                                        Jelajahi Topik
                                    </h3>
                                </div>
                                <div className="p-4 flex flex-wrap gap-1.5">
                                    {['Nasional', 'Ekonomi', 'Olahraga', 'Teknologi', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Politik', 'Lingkungan'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`rounded-full border px-3 py-1 text-[10px] font-bold transition-all ${
                                                cat === article.category
                                                    ? `${catColor} border-transparent`
                                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <Footer user={auth.user} />
        </>
    );
}

PublicShowNews.layout = (page: React.ReactNode) => page;
