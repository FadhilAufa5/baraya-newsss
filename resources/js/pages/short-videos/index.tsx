import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Eye, FileVideo, Plus, Search, Trash2, X, Clock, Film, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShortVideo {
    id: number;
    title: string;
    description: string | null;
    video: string;
    thumbnail: string | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    views: number;
    user?: { name: string };
    created_at: string;
}

interface PaginatedData {
    data: ShortVideo[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    shortVideos: PaginatedData;
    filters: { search?: string; status?: string };
}

const STATUS_CONFIG = {
    draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    published: { label: 'Tayang', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
    archived: { label: 'Arsip', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
};

function mediaUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) {
        return path;
    }
    return `/storage/${path}`;
}

function formatDate(value: string | null) {
    if (!value) return 'Belum tayang';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatViews(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}Rb`;
    return String(n);
}

export default function ShortVideoIndex({ shortVideos, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [deleteTarget, setDeleteTarget] = useState<ShortVideo | null>(null);
    const [deleting, setDeleting] = useState(false);

    const applyFilter = (nextSearch = search, nextStatus = status) => {
        router.get(
            '/short-videos',
            {
                ...(nextSearch ? { search: nextSearch } : {}),
                ...(nextStatus && nextStatus !== 'all' ? { status: nextStatus } : {}),
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get('/short-videos', {}, { preserveState: false });
    };

    const deleteVideo = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/short-videos/${deleteTarget.id}`, {
            onFinish: () => setDeleting(false),
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const hasFilter = !!filters.search || (!!filters.status && filters.status !== 'all');

    const totalViews = shortVideos.data.reduce((sum, v) => sum + v.views, 0);
    const publishedCount = shortVideos.data.filter((v) => v.status === 'published').length;

    return (
        <>
            <Head title="Short Video" />

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="size-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center">Hapus Short Video?</DialogTitle>
                        <DialogDescription className="text-center">
                            Video <strong>"{deleteTarget?.title}"</strong> akan dihapus permanen beserta file-nya.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={deleteVideo} disabled={deleting}>
                            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-6 p-4">
                {/* ── Header Banner ───────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-red-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 left-20 size-40 rounded-full bg-blue-500/10 blur-2xl" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <Film className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Short Video</h1>
                                <p className="text-sm text-slate-400">Kelola video pendek secara terpisah dari berita.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm ring-1 ring-white/20">
                                <Film className="size-3.5" />
                                {shortVideos.total} video
                            </div>
                            <Button asChild className="gap-2 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25">
                                <Link href="/short-videos/create">
                                    <Plus className="size-4" />
                                    Upload Video
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Stats Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-violet-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Video</p>
                                <p className="mt-2 text-4xl font-bold tracking-tight">{shortVideos.total}</p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                                <Film className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BarChart3 className="size-3.5 text-violet-500" />
                            {publishedCount} tayang
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-blue-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Views</p>
                                <p className="mt-2 text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{formatViews(totalViews)}</p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Eye className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="size-3.5 text-blue-500" />
                            Semua video
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-emerald-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Rata-rata Views</p>
                                <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {shortVideos.total > 0 ? formatViews(Math.round(totalViews / shortVideos.total)) : '0'}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <BarChart3 className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BarChart3 className="size-3.5 text-emerald-500" />
                            Per video
                        </div>
                    </div>
                </div>

                {/* ── Search & Filter ─────────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && applyFilter()}
                            placeholder="Cari judul atau deskripsi..."
                            className="rounded-xl pl-10 pr-4"
                        />
                    </div>
                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            applyFilter(search, value);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-44 rounded-xl">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Tayang</SelectItem>
                            <SelectItem value="archived">Arsip</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => applyFilter()} className="rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">
                        Cari
                    </Button>
                    {hasFilter && (
                        <Button variant="ghost" onClick={clearFilters} className="gap-2 rounded-xl">
                            <X className="size-4" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* ── Video Grid ──────────────────────────────────────────── */}
                {shortVideos.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-20 text-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                            <FileVideo className="size-8 text-muted-foreground/50" />
                        </div>
                        <div>
                            <p className="font-semibold">Belum ada short video</p>
                            <p className="text-sm text-muted-foreground">Upload video pendek pertama dari menu ini.</p>
                        </div>
                        <Button asChild className="gap-2 rounded-xl bg-red-600 hover:bg-red-700">
                            <Link href="/short-videos/create">
                                <Plus className="size-4" />
                                Upload Video
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {shortVideos.data.map((item) => {
                            const statusConfig = STATUS_CONFIG[item.status];

                            return (
                                <Card key={item.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="relative bg-black">
                                        <video
                                            src={mediaUrl(item.video) ?? undefined}
                                            poster={item.thumbnail ? (mediaUrl(item.thumbnail) ?? undefined) : undefined}
                                            controls
                                            playsInline
                                            className="aspect-video max-h-[420px] w-full object-contain"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge className={`${statusConfig.className} shadow-sm`}>{statusConfig.label}</Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="line-clamp-2 text-base font-bold leading-snug">{item.title}</h3>
                                            </div>
                                            {item.description && (
                                                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays className="size-3.5" />
                                                    {formatDate(item.published_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="size-3.5" />
                                                    {formatViews(item.views)}
                                                </span>
                                                <span className="ml-auto flex items-center gap-1">
                                                    <Clock className="size-3.5" />
                                                    {item.user?.name ?? 'Redaksi'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-end border-t border-border/50 pt-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeleteTarget(item)}
                                                >
                                                    <Trash2 className="size-4" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

ShortVideoIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Short Video', href: '/short-videos' },
    ],
};
