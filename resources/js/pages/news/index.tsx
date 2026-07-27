import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search, X, Filter, Plus, Clock, Eye, Star,
    ChevronLeft, ChevronRight, FileX, Tag, Edit2, Trash2,
    Newspaper, TrendingUp, CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { imageUrl } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
    id: number;
    title: string;
    slug: string;
    category: string;
    author: string | null;
    excerpt: string | null;
    image: string | null;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    published_at: string | null;
    views: number;
    reading_time: number;
    tags: string[] | null;
    user?: { name: string };
    created_at: string;
}

interface PaginatedData {
    data: Article[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    news: PaginatedData;
    filters: { search?: string; category?: string; status?: string };
    categories: string[];
}



const STATUS_CONFIG = {
    draft:     { label: 'Draft',  cls: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
    published: { label: 'Tayang', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
    archived:  { label: 'Arsip',  cls: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
};

const CATEGORY_COLORS: Record<string, string> = {
    Nasional: 'bg-red-500', Internasional: 'bg-blue-600', Politik: 'bg-violet-600',
    Ekonomi: 'bg-emerald-600', Olahraga: 'bg-orange-500', Teknologi: 'bg-cyan-600',
    Hiburan: 'bg-pink-500', Kesehatan: 'bg-teal-600', Pendidikan: 'bg-indigo-600',
    Budaya: 'bg-amber-600', Lingkungan: 'bg-lime-600', Hukum: 'bg-slate-600', Umum: 'bg-gray-500',
};

const CATEGORY_TEXT: Record<string, string> = {
    Nasional: 'text-red-500', Internasional: 'text-blue-600', Politik: 'text-violet-600',
    Ekonomi: 'text-emerald-600', Olahraga: 'text-orange-500', Teknologi: 'text-cyan-600',
    Hiburan: 'text-pink-500', Kesehatan: 'text-teal-600', Pendidikan: 'text-indigo-600',
    Budaya: 'text-amber-600', Lingkungan: 'text-lime-600', Hukum: 'text-slate-600', Umum: 'text-gray-500',
};

function formatDate(s: string | null) {
    if (!s) return '—';
    return new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Delete Confirm Dialog ─────────────────────────────────────────────────────

function DeleteDialog({ article, open, onClose }: { article: Article; open: boolean; onClose: () => void }) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(`/news/${article.slug}`, {
            onFinish: () => { setProcessing(false); onClose(); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Hapus Artikel</DialogTitle>
                    <DialogDescription className="leading-relaxed">
                        Yakin ingin menghapus artikel{' '}
                        <span className="font-semibold text-foreground">"{article.title}"</span>?{' '}
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        {processing ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Hero Card ─────────────────────────────────────────────────────────────────

function HeroCard({ article, onDelete }: { article: Article; onDelete: (a: Article) => void }) {
    const img = imageUrl(article.image);
    const catColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-500';
    const st = STATUS_CONFIG[article.status];

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
            {/* Image / Gradient background */}
            {img ? (
                <img
                    src={img}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.03]"
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${catColor.replace('bg-', 'from-')} to-slate-900 opacity-70`} />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

            {/* Content */}
            <div className="relative flex min-h-[460px] flex-col justify-end p-7 md:p-10">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`${catColor} rounded-md px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-widest`}>
                        {article.category}
                    </span>
                    {article.is_featured && (
                        <span className="flex items-center gap-1 rounded-md bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-amber-900 uppercase">
                            <Star className="size-3 fill-amber-900" /> Unggulan
                        </span>
                    )}
                    <span className={`ml-auto rounded-full px-3 py-1 text-[11px] font-semibold ${st.cls}`}>
                        {st.label}
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-extrabold leading-tight text-white md:text-[2.2rem] line-clamp-3">
                    <Link href={`/news/${article.slug}`} className="hover:text-white/90 transition-colors">
                        {article.title}
                    </Link>
                </h2>

                {/* Excerpt */}
                {article.excerpt && (
                    <p className="mt-3 text-sm text-white/65 line-clamp-2 leading-relaxed max-w-2xl">
                        {article.excerpt}
                    </p>
                )}

                {/* Meta row */}
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/50">
                    <span className="font-medium text-white/70">{article.author ?? article.user?.name ?? 'Redaksi'}</span>
                    {article.published_at && (
                        <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <CalendarDays className="size-3" /> {formatDate(article.published_at)}
                            </span>
                        </>
                    )}
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {article.reading_time} mnt</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Eye className="size-3" /> {article.views.toLocaleString('id-ID')} views</span>
                </div>

                {/* Action buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Button asChild size="sm" className="bg-white text-slate-900 hover:bg-white/90 font-semibold shadow">
                        <Link href={`/news/${article.slug}`}>Baca Selengkapnya</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-white/25 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm">
                        <Link href={`/news/${article.slug}/edit`}><Edit2 className="mr-1.5 size-3.5" />Edit</Link>
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-white/25 text-white bg-white/5 hover:bg-red-500/30 hover:border-red-400 backdrop-blur-sm"
                        onClick={() => onDelete(article)}
                    >
                        <Trash2 className="mr-1.5 size-3.5" />Hapus
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ article, onDelete }: { article: Article; onDelete: (a: Article) => void }) {
    const img = imageUrl(article.image);
    const catColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-500';
    const catText = CATEGORY_TEXT[article.category] ?? 'text-gray-500';
    const st = STATUS_CONFIG[article.status];

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
                <Link href={`/news/${article.slug}`} className="block h-full w-full">
                    {img ? (
                        <img
                            src={img}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${catColor.replace('bg-', 'from-').replace('500', '300').replace('600', '400')} to-slate-600`}>
                            <Newspaper className="size-10 text-white/30" />
                        </div>
                    )}
                </Link>

                {/* Overlays */}
                {article.is_featured && (
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-amber-400/95 px-2 py-0.5 text-[10px] font-bold text-amber-900 shadow-sm">
                        <Star className="size-2.5 fill-amber-900" /> Unggulan
                    </div>
                )}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2.5 left-3 z-10">
                    <span className={`${catColor} rounded px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider`}>
                        {article.category}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                {/* Status */}
                <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${st.cls}`}>
                        {st.label}
                    </span>
                    {article.tags && article.tags.length > 0 && (
                        <span className={`flex items-center gap-1 text-[10px] font-medium ${catText} truncate`}>
                            <Tag className="size-3 shrink-0" />
                            <span className="truncate">{article.tags[0]}</span>
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-bold leading-snug line-clamp-2 text-sm text-foreground group-hover:text-red-600 transition-colors duration-150">
                    <Link href={`/news/${article.slug}`}>
                        {article.title}
                    </Link>
                </h3>

                {/* Excerpt */}
                {article.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.excerpt}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-auto flex flex-col gap-2 pt-3 border-t">
                    {/* Meta */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="truncate font-medium text-foreground/60 max-w-[120px]">
                            {article.author ?? 'Redaksi'}
                        </span>
                        <span className="shrink-0">{formatDate(article.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="size-3" />{article.reading_time} mnt</span>
                        <span className="flex items-center gap-1"><Eye className="size-3" />{article.views.toLocaleString('id-ID')}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                        <Button asChild variant="outline" size="sm" className="h-7 flex-1 text-xs font-medium">
                            <Link href={`/news/${article.slug}`}>Lihat</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="h-7 w-8 p-0 text-muted-foreground hover:text-foreground">
                            <Link href={`/news/${article.slug}/edit`}><Edit2 className="size-3.5" /></Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-8 p-0 text-muted-foreground hover:text-destructive hover:border-destructive"
                            onClick={() => onDelete(article)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2.5 mb-4">
            <span className="h-5 w-1 rounded-full bg-red-500 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {children}
            </span>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewsIndex({ news, filters, categories }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? 'all');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

    const applyFilter = (s = search, c = category, st = status) => {
        router.get('/news', {
            ...(s ? { search: s } : {}),
            ...(c && c !== 'all' ? { category: c } : {}),
            ...(st && st !== 'all' ? { status: st } : {}),
        }, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('all');
        setStatus('all');
        router.get('/news', {}, { preserveState: false });
    };

    const hasFilter = !!(
        filters.search ||
        (filters.category && filters.category !== 'all') ||
        (filters.status && filters.status !== 'all')
    );

    const [featured, ...rest] = news.data;
    const isFirstPage = news.current_page === 1;
    const articlesInGrid = isFirstPage ? rest : news.data;
    
    return (
        <>
            <Head title="Portal Berita" />

            {deleteTarget && (
                <DeleteDialog
                    article={deleteTarget}
                    open={true}
                    onClose={() => setDeleteTarget(null)}
                />
            )}

            <div className="flex flex-col gap-6 p-4">

                {/* ── Masthead ─────────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 px-7 py-6 shadow-lg">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -top-8 -right-8 size-40 rounded-full bg-white/5 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-1/2 size-32 rounded-full bg-white/5 blur-2xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                                Portal Berita
                            </p>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Baraya News
                            </h1>
                            <p className="mt-1 text-sm text-white/80">
                                Berita terkini, terpercaya, dan terlengkap
                            </p>
                        </div>
                        <Button
                            asChild
                            className="shrink-0 gap-2 bg-white text-gray-700 hover:bg-red-50 font-bold shadow-md px-5 self-start"
                        >
                            <Link href="/news/create"><Plus className="size-4" />Tulis Artikel</Link>
                        </Button>
                    </div>

                    {/* Stats strip */}
                    <div className="relative mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-red-200/70 text-xs">Total Artikel</span>
                            <span className="font-bold text-white text-base">{news.total.toLocaleString('id-ID')}</span>
                        </div>
                        {hasFilter && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-red-200/70 text-xs">Hasil filter</span>
                                <span className="font-bold text-white text-base">{news.total.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        {news.last_page > 1 && (
                            <div className="flex items-center gap-2 text-sm ml-auto">
                                <TrendingUp className="size-3.5 text-red-300" />
                                <span className="text-red-200/70 text-xs">Hal. {news.current_page} / {news.last_page}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Filter Bar ───────────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="search-news"
                            placeholder="Cari judul, penulis, ringkasan..."
                            className="pl-10 h-10 rounded-xl border-border/60 bg-background focus-visible:ring-red-500/30"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                        />
                    </div>

                    {/* Category */}
                    <Select value={category} onValueChange={(v) => { setCategory(v); applyFilter(search, v, status); }}>
                        <SelectTrigger id="filter-category" className="h-10 w-full sm:w-44 rounded-xl border-border/60 gap-2">
                            <Tag className="size-3.5 text-muted-foreground shrink-0" />
                            <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Status */}
                    <Select value={status} onValueChange={(v) => { setStatus(v); applyFilter(search, category, v); }}>
                        <SelectTrigger id="filter-status" className="h-10 w-full sm:w-40 rounded-xl border-border/60 gap-2">
                            <Filter className="size-3.5 text-muted-foreground shrink-0" />
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Tayang</SelectItem>
                            <SelectItem value="archived">Arsip</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Button
                            id="btn-search"
                            onClick={() => applyFilter()}
                            className="h-10 shrink-0 rounded-xl bg-gray-600 hover:bg-gray-800 px-5"
                        >
                            Cari
                        </Button>
                        {hasFilter && (
                            <Button
                                id="btn-clear"
                                variant="ghost"
                                onClick={clearFilters}
                                className="h-10 shrink-0 gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── Active filter pills ───────────────────────────────── */}
                {hasFilter && (
                    <div className="flex flex-wrap items-center gap-2 -mt-4">
                        <span className="text-xs text-muted-foreground">Filter aktif:</span>
                        {filters.search && (
                            <Badge variant="secondary" className="gap-1 text-xs font-normal">
                                Cari: "{filters.search}"
                            </Badge>
                        )}
                        {filters.category && filters.category !== 'all' && (
                            <Badge variant="secondary" className="gap-1 text-xs font-normal">
                                Kategori: {filters.category}
                            </Badge>
                        )}
                        {filters.status && filters.status !== 'all' && (
                            <Badge variant="secondary" className="gap-1 text-xs font-normal capitalize">
                                Status: {filters.status === 'published' ? 'Tayang' : filters.status === 'draft' ? 'Draft' : 'Arsip'}
                            </Badge>
                        )}
                    </div>
                )}

                {/* konten */}
                {news.data.length === 0 ? (
                    
                    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/70 bg-muted/20 py-24 text-center">
                        <div className="flex size-18 items-center justify-center rounded-2xl bg-muted shadow-inner">
                            <FileX className="size-9 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Belum ada artikel</p>
                            <p className="text-sm text-muted-foreground">
                                {hasFilter
                                    ? 'Tidak ada hasil untuk filter ini. Coba ubah pencarian atau kategori.'
                                    : 'Mulai tulis artikel pertama Anda.'}
                            </p>
                        </div>
                        {!hasFilter && (
                            <Button asChild className="bg-red-600 hover:bg-red-700 gap-2">
                                <Link href="/news/create"><Plus className="size-4" />Tulis Artikel</Link>
                            </Button>
                        )}
                        {hasFilter && (
                            <Button variant="outline" onClick={clearFilters} className="gap-2">
                                <X className="size-4" />Hapus Filter
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">

                        {/* Hero article — first item, first page only */}
                        {featured && isFirstPage && (
                            <section>
                                <SectionLabel>Artikel Utama</SectionLabel>
                                <HeroCard article={featured} onDelete={setDeleteTarget} />
                            </section>
                        )}

                        {/* Article grid */}
                        {articlesInGrid.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <SectionLabel>
                                        {isFirstPage ? 'Artikel Lainnya' : 'Semua Artikel'}
                                    </SectionLabel>
                                    {news.from !== null && news.to !== null && (
                                        <span className="text-xs text-muted-foreground">
                                            {news.from}–{news.to} dari {news.total} artikel
                                        </span>
                                    )}
                                </div>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {articlesInGrid.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            article={article}
                                            onDelete={setDeleteTarget}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* ── Pagination ───────────────────────────────────────── */}
                {news.last_page > 1 && (
                    <div className="flex items-center justify-between border-t pt-5 mt-2">
                        <p className="text-sm text-muted-foreground">
                            Halaman <span className="font-semibold text-foreground">{news.current_page}</span>{' '}
                            dari{' '}
                            <span className="font-semibold text-foreground">{news.last_page}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                id="btn-prev"
                                variant="outline"
                                size="sm"
                                className="size-8 p-0 rounded-lg"
                                disabled={news.current_page === 1}
                                onClick={() => router.get('/news', { ...filters, page: news.current_page - 1 })}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            {news.links
                                .filter((l) => !l.label.includes('Previous') && !l.label.includes('Next'))
                                .map((link, i) => (
                                    <Button
                                        key={i}
                                        id={`btn-page-${link.label}`}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        className={`min-w-8 h-8 rounded-lg text-xs ${link.active ? 'bg-red-600 hover:bg-red-700 border-red-600' : ''}`}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            <Button
                                id="btn-next"
                                variant="outline"
                                size="sm"
                                className="size-8 p-0 rounded-lg"
                                disabled={news.current_page === news.last_page}
                                onClick={() => router.get('/news', { ...filters, page: news.current_page + 1 })}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

NewsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Berita', href: '/news' },
    ],
};
