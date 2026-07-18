import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarDays,
    MessageSquare,
    Newspaper,
    Search,
    Trash2,
    TrendingUp,
    User2,
    X,
    MessageCircle,
    Clock,
} from 'lucide-react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Comment {
    id: number;
    body: string;
    created_at: string;
    user: { id: number; name: string; email: string } | null;
    news: { id: number; title: string; slug: string } | null;
}

interface PaginatedData {
    data: Comment[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    comments: PaginatedData;
    filters: { search?: string };
    stats: { total: number; today: number; this_week: number };
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function timeAgo(value: string) {
    const diff = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (diff < 60) return `${diff}d lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`; 
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
}

function truncate(text: string, max = 140) {
    return text.length > max ? text.slice(0, max) + '…' : text;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

const AVATAR_COLORS = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function CommentsIndex({ comments, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [bulkSelected, setBulkSelected] = useState<number[]>([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);

    const applyFilter = (nextSearch = search) => {
        router.get(
            '/comments',
            { ...(nextSearch ? { search: nextSearch } : {}) },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/comments', {}, { preserveState: false });
    };

    const deleteComment = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/comments/${deleteTarget.id}`, {
            onFinish: () => setDeleting(false),
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const toggleSelect = (id: number) => {
        setBulkSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = () => {
        setBulkSelected(
            bulkSelected.length === comments.data.length
                ? []
                : comments.data.map((c) => c.id),
        );
    };

    const bulkDelete = () => {
        setBulkDeleting(true);
        router.post(
            '/comments/bulk-destroy',
            { ids: bulkSelected },
            {
                onFinish: () => {
                    setBulkDeleting(false);
                    setBulkSelected([]);
                    setShowBulkConfirm(false);
                },
            },
        );
    };

    const hasFilter = !!filters.search;
    const allSelected =
        comments.data.length > 0 && bulkSelected.length === comments.data.length;

    return (
        <>
            <Head title="Manajemen Komentar" />

           
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="size-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center">Hapus Komentar?</DialogTitle>
                        <DialogDescription className="text-center">
                            Komentar dari{' '}
                            <span className="font-semibold text-foreground">
                                {deleteTarget?.user?.name ?? 'pengguna'}
                            </span>{' '}
                            akan dihapus permanen.
                        </DialogDescription>
                    </DialogHeader>
                    {deleteTarget && (
                        <div className="rounded-xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground italic leading-relaxed">
                            "{truncate(deleteTarget.body, 160)}"
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={deleteComment}
                            disabled={deleting}
                        >
                            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Bulk delete dialog ─────────────────────────────────── */}
            <Dialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="size-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center">
                            Hapus {bulkSelected.length} Komentar?
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Semua komentar yang dipilih akan dihapus permanen dan tidak dapat
                            dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowBulkConfirm(false)}
                            disabled={bulkDeleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={bulkDelete}
                            disabled={bulkDeleting}
                        >
                            {bulkDeleting ? 'Menghapus...' : `Hapus ${bulkSelected.length} Komentar`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-6 p-4">

                {/* ── Page header ───────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    {/* decorative blobs */}
                    <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-violet-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 left-20 size-40 rounded-full bg-blue-500/10 blur-2xl" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <MessageSquare className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Manajemen Komentar</h1>
                                <p className="text-sm text-slate-400">
                                    Bacain Komentar dari orang yang berkomentar !!!
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm ring-1 ring-white/20">
                                <MessageCircle className="size-3.5" />
                                {comments.total} komentar
                            </div>
                        </div>
                    </div>
                </div>

               
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Total */}
                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-violet-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                    Total Komentar
                                </p>
                                <p className="mt-2 text-4xl font-bold tracking-tight">{stats.total}</p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                                <MessageSquare className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <TrendingUp className="size-3.5 text-emerald-500" />
                            Semua waktu
                        </div>
                    </div>

                    {/* Today */}
                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-emerald-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                    Hari Ini
                                </p>
                                <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {stats.today}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Clock className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5" />
                            {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* This week */}
                    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-blue-500/5 blur-2xl" />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                    Minggu Ini
                                </p>
                                <p className="mt-2 text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                                    {stats.this_week}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <TrendingUp className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5" />
                            7 hari terakhir
                        </div>
                    </div>
                </div>

                {/* ── Search & toolbar ──────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            placeholder="Cari komentar, nama, atau judul berita..."
                            className="rounded-xl pl-10 pr-4"
                        />
                    </div>
                    <Button
                        onClick={() => applyFilter()}
                        className="rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        Cari
                    </Button>
                    {hasFilter && (
                        <Button variant="ghost" onClick={clearFilters} className="gap-2 rounded-xl">
                            <X className="size-4" />
                            Reset
                        </Button>
                    )}
                    {bulkSelected.length > 0 && (
                        <Button
                            variant="destructive"
                            className="gap-2 rounded-xl"
                            onClick={() => setShowBulkConfirm(true)}
                        >
                            <Trash2 className="size-4" />
                            Hapus ({bulkSelected.length})
                        </Button>
                    )}
                </div>

                {/* ── Comment table ─────────────────────────────────────── */}
                <Card className="overflow-hidden rounded-2xl border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                <TableHead className="w-10 pl-5">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        className="size-4 cursor-pointer rounded border-input accent-primary"
                                    />
                                </TableHead>
                                <TableHead className="font-semibold">Komentar</TableHead>
                                <TableHead className="w-48 font-semibold">Pengguna</TableHead>
                                <TableHead className="w-56 font-semibold">Berita</TableHead>
                                <TableHead className="w-36 font-semibold">Waktu</TableHead>
                                <TableHead className="w-16 pr-5 text-right font-semibold">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {comments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                                            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                                                <MessageSquare className="size-8 text-muted-foreground/50" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Belum ada komentar</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasFilter
                                                        ? 'Tidak ada hasil untuk pencarian ini.'
                                                        : 'Komentar dari pembaca akan muncul di sini.'}
                                                </p>
                                            </div>
                                            {hasFilter && (
                                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                                    Hapus filter
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                comments.data.map((comment) => {
                                    const isSelected = bulkSelected.includes(comment.id);
                                    const name = comment.user?.name ?? '?';
                                    const colorClass = avatarColor(name);

                                    return (
                                        <TableRow
                                            key={comment.id}
                                            className={`transition-colors ${isSelected ? 'bg-primary/5 hover:bg-primary/8' : ''}`}
                                        >
                                            {/* checkbox */}
                                            <TableCell className="pl-5">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(comment.id)}
                                                    className="size-4 cursor-pointer rounded border-input accent-primary"
                                                />
                                            </TableCell>

                                            {/* Body */}
                                            <TableCell className="max-w-xs py-4">
                                                <div className="flex items-start gap-2">
                                                    <MessageCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                                                    <p className="text-sm leading-relaxed text-foreground">
                                                        {truncate(comment.body)}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            {/* User */}
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorClass} text-xs font-bold text-white shadow-sm`}
                                                    >
                                                        {comment.user
                                                            ? getInitials(comment.user.name)
                                                            : '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium leading-tight">
                                                            {comment.user?.name ?? '—'}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {comment.user?.email ?? ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* News */}
                                            <TableCell className="py-4">
                                                {comment.news ? (
                                                    <div className="flex items-start gap-2">
                                                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
                                                            <Newspaper className="size-3 text-slate-500" />
                                                        </div>
                                                        <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                                            {comment.news.title}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/50">—</span>
                                                )}
                                            </TableCell>

                                            {/* Time */}
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-medium text-foreground">
                                                        {timeAgo(comment.created_at)}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {formatDate(comment.created_at)}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Action */}
                                            <TableCell className="pr-5 text-right">
                                                <button
                                                    onClick={() => setDeleteTarget(comment)}
                                                    className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* ── Pagination ────────────────────────────────────────── */}
                {comments.last_page > 1 && (
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-medium text-foreground">
                                {(comments.current_page - 1) * comments.per_page + 1}–
                                {Math.min(comments.current_page * comments.per_page, comments.total)}
                            </span>{' '}
                            dari <span className="font-medium text-foreground">{comments.total}</span>{' '}
                            komentar
                        </p>
                        <div className="flex items-center gap-1">
                            {comments.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className="min-w-9 rounded-lg px-2 text-xs"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

CommentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Komentar', href: '/comments' },
    ],
};
