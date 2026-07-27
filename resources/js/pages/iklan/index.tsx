import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Eye, EyeOff, Megaphone, Plus, Search, Trash2, X, ToggleLeft, ToggleRight, ExternalLink, BarChart3 } from 'lucide-react';
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

interface Ad {
    id: number;
    title: string;
    sponsor_name: string | null;
    description: string | null;
    cta_text: string;
    cta_url: string;
    type: 'leaderboard' | 'in-feed' | 'rectangle';
    position: 'top' | 'middle' | 'sidebar';
    is_active: boolean;
    sort_order: number;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
}

interface PaginatedData {
    data: Ad[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    ads: PaginatedData;
    filters: { status?: string; type?: string };
}

const TYPE_CONFIG = {
    leaderboard: { label: 'Leaderboard', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    'in-feed': { label: 'In-Feed', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    rectangle: { label: 'Rectangle', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

const POSITION_LABEL: Record<string, string> = {
    top: 'Atas',
    middle: 'Tengah',
    sidebar: 'Sidebar',
};

function formatDate(value: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function AdsIndex({ ads, filters }: Props) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [type, setType] = useState(filters.type ?? 'all');
    const [deleteTarget, setDeleteTarget] = useState<Ad | null>(null);
    const [deleting, setDeleting] = useState(false);

    const applyFilter = (nextStatus = status, nextType = type) => {
        router.get(
            '/iklan',
            {
                ...(nextStatus && nextStatus !== 'all' ? { status: nextStatus } : {}),
                ...(nextType && nextType !== 'all' ? { type: nextType } : {}),
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setStatus('all');
        setType('all');
        router.get('/iklan', {}, { preserveState: false });
    };

    const deleteAd = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/iklan/${deleteTarget.id}`, {
            onFinish: () => setDeleting(false),
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const toggleAd = (ad: Ad) => {
        router.post(`/iklan/${ad.id}/toggle`, {}, { preserveScroll: true });
    };

    const hasFilter = (!!filters.status && filters.status !== 'all') || (!!filters.type && filters.type !== 'all');
    const activeCount = ads.data.filter((a) => a.is_active).length;

    return (
        <>
            <Head title="Manajemen Iklan" />

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="size-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center">Hapus Iklan?</DialogTitle>
                        <DialogDescription className="text-center">
                            Iklan <strong>"{deleteTarget?.title}"</strong> akan dihapus permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={deleteAd} disabled={deleting}>
                            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-6 p-4">
                {/* ── Header Banner ───────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-amber-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 left-20 size-40 rounded-full bg-orange-500/10 blur-2xl" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <Megaphone className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Manajemen Iklan</h1>
                                <p className="text-sm text-slate-400">Kelola iklan yang tampil di halaman beranda.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm ring-1 ring-white/20">
                                <Megaphone className="size-3.5" />
                                {ads.total} iklan
                            </div>
                            <Button asChild className="gap-2 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/25">
                                <Link href="/iklan/create">
                                    <Plus className="size-4" />
                                    Tambah Iklan
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Stats ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-amber-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Iklan</p>
                                <p className="mt-2 text-4xl font-bold tracking-tight">{ads.total}</p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <Megaphone className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BarChart3 className="size-3.5 text-amber-500" />
                            Semua iklan
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-emerald-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Aktif</p>
                                <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{activeCount}</p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Eye className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="size-3.5 text-emerald-500" />
                            Ditampilkan di beranda
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-slate-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Nonaktif</p>
                                <p className="mt-2 text-4xl font-bold tracking-tight text-slate-500">{ads.total - activeCount}</p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400">
                                <EyeOff className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <EyeOff className="size-3.5 text-slate-500" />
                            Tidak ditampilkan
                        </div>
                    </div>
                </div>

                {/* ── Filter ──────────────────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Select value={status} onValueChange={(v) => { setStatus(v); applyFilter(v, type); }}>
                        <SelectTrigger className="w-full sm:w-44 rounded-xl">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={type} onValueChange={(v) => { setType(v); applyFilter(status, v); }}>
                        <SelectTrigger className="w-full sm:w-44 rounded-xl">
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            <SelectItem value="leaderboard">Leaderboard</SelectItem>
                            <SelectItem value="in-feed">In-Feed</SelectItem>
                            <SelectItem value="rectangle">Rectangle</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilter && (
                        <Button variant="ghost" onClick={clearFilters} className="gap-2 rounded-xl">
                            <X className="size-4" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* ── Ad List ─────────────────────────────────────────────── */}
                {ads.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-20 text-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                            <Megaphone className="size-8 text-muted-foreground/50" />
                        </div>
                        <div>
                            <p className="font-semibold">Belum ada iklan</p>
                            <p className="text-sm text-muted-foreground">Tambahkan iklan pertama untuk ditampilkan di beranda.</p>
                        </div>
                        <Button asChild className="gap-2 rounded-xl bg-amber-600 hover:bg-amber-700">
                            <Link href="/iklan/create">
                                <Plus className="size-4" />
                                Tambah Iklan
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {ads.data.map((ad) => {
                            const typeConfig = TYPE_CONFIG[ad.type];
                            return (
                                <Card key={ad.id} className={`overflow-hidden transition-all ${!ad.is_active ? 'opacity-60' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                                    ad.is_active
                                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    <Megaphone className="size-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-sm font-bold line-clamp-1">{ad.title}</h3>
                                                        <Badge className={`${typeConfig.className} text-[10px]`}>{typeConfig.label}</Badge>
                                                        {!ad.is_active && (
                                                            <Badge variant="outline" className="text-[10px] text-muted-foreground">Nonaktif</Badge>
                                                        )}
                                                    </div>
                                                    {ad.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{ad.description}</p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                                                        <span>{ad.sponsor_name ?? '—'}</span>
                                                        <span>•</span>
                                                        <span>{POSITION_LABEL[ad.position]}</span>
                                                        <span>•</span>
                                                        <span>{ad.cta_text}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <CalendarDays className="size-3" />
                                                            {formatDate(ad.starts_at)} — {formatDate(ad.ends_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1.5 rounded-xl"
                                                    onClick={() => toggleAd(ad)}
                                                >
                                                    {ad.is_active ? (
                                                        <ToggleRight className="size-4 text-emerald-500" />
                                                    ) : (
                                                        <ToggleLeft className="size-4 text-muted-foreground" />
                                                    )}
                                                    {ad.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-xl">
                                                    <Link href={`/iklan/${ad.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1.5 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeleteTarget(ad)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {ads.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {ads.links.map((link, i) => {
                            if (!link.url) return null;
                            const label = link.label.replace('&laquo;', '‹').replace('&raquo;', '›');
                            return (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    className="min-w-9 rounded-lg px-2 text-xs"
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

AdsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Iklan', href: '/iklan' },
    ],
};
