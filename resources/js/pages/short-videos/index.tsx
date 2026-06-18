import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, FileVideo, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

function mediaUrl(path: string) {
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

    return (
        <>
            <Head title="Short Video" />

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Short Video</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus short video <strong>"{deleteTarget?.title}"</strong>? File video akan ikut dihapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={deleteVideo} disabled={deleting}>
                            {deleting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Short Video</h1>
                        <p className="text-sm text-muted-foreground">Kelola video pendek secara terpisah dari berita.</p>
                    </div>
                    <Button asChild className="gap-2 bg-red-600 hover:bg-red-700">
                        <Link href="/short-videos/create">
                            <Plus className="size-4" />
                            Upload Video
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && applyFilter()}
                            placeholder="Cari judul atau deskripsi..."
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            applyFilter(search, value);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-44">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Tayang</SelectItem>
                            <SelectItem value="archived">Arsip</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => applyFilter()} className="bg-gray-700 hover:bg-gray-800">
                        Cari
                    </Button>
                    {hasFilter && (
                        <Button variant="ghost" onClick={clearFilters} className="gap-2">
                            <X className="size-4" />
                            Reset
                        </Button>
                    )}
                </div>

                {shortVideos.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
                        <FileVideo className="size-10 text-muted-foreground/50" />
                        <div>
                            <p className="font-medium">Belum ada short video</p>
                            <p className="text-sm text-muted-foreground">Upload video pendek pertama dari menu ini.</p>
                        </div>
                        <Button asChild className="gap-2 bg-red-600 hover:bg-red-700">
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
                                <Card key={item.id} className="overflow-hidden">
                                    <div className="bg-black">
                                        <video
                                            src={mediaUrl(item.video)}
                                            poster={item.thumbnail ? mediaUrl(item.thumbnail) : undefined}
                                            controls
                                            playsInline
                                            className="aspect-video max-h-[420px] w-full object-contain"
                                        />
                                    </div>
                                    <CardHeader className="gap-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <CardTitle className="line-clamp-2 text-base">{item.title}</CardTitle>
                                            <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                                        </div>
                                        {item.description && <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}
                                    </CardHeader>
                                    <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <CalendarDays className="size-3.5" />
                                        <span>{formatDate(item.published_at)}</span>
                                        <span className="ml-auto">{item.user?.name ?? 'Redaksi'}</span>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="ml-auto gap-2 text-destructive hover:text-destructive"
                                            onClick={() => setDeleteTarget(item)}
                                        >
                                            <Trash2 className="size-4" />
                                            Hapus
                                        </Button>
                                    </CardFooter>
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
