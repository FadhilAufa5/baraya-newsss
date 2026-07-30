import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Images, Download, Image as ImageIcon, Film, Search, X, FileX,
    ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { imageUrl } from '@/lib/utils';

interface MediaItem {
    id: string;
    type: 'news_image' | 'short_video' | 'thumbnail';
    type_label: string;
    title: string;
    caption: string | null;
    file_path: string;
    file_name: string;
    related_id: number;
    related_url: string | null;
    created_at: string;
}

interface PaginatedData {
    data: MediaItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    media: PaginatedData;
    type: string;
}

const TYPE_CONFIG = {
    news_image: {
        icon: ImageIcon,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    },
    short_video: {
        icon: Film,
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    },
    thumbnail: {
        icon: Images,
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    },
};

function formatDate(s: string) {
    return new Date(s).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function GalleryIndex({ media, type }: Props) {
    const [activeTab, setActiveTab] = useState(type);
    const [search, setSearch] = useState('');

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.get('/gallery', { type: value === 'all' ? undefined : value }, {
            preserveState: true,
            replace: true,
        });
    };

    const filteredData = search
        ? media.data.filter((item) =>
              item.file_name.toLowerCase().includes(search.toLowerCase()) ||
              item.title.toLowerCase().includes(search.toLowerCase())
          )
        : media.data;

    return (
        <>
            <Head title="Galeri Media" />

            <div className="flex flex-col gap-6 p-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
                    <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-red-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 left-20 size-40 rounded-full bg-blue-500/10 blur-2xl" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <Images className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Galeri Media</h1>
                                <p className="text-sm text-slate-400">
                                    Kelola semua gambar dan video dari berita & short video.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm ring-1 ring-white/20">
                            <Images className="size-3.5" />
                            {media.total} media
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="all">Semua</TabsTrigger>
                        <TabsTrigger value="news_images">Gambar News</TabsTrigger>
                        <TabsTrigger value="thumbnails">Thumbnail</TabsTrigger>
                        <TabsTrigger value="short_videos">Short Videos</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama file atau judul..."
                        className="pl-10 h-10 rounded-xl border-border/60"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setSearch('')}
                        >
                            <X className="size-4" />
                        </Button>
                    )}
                </div>

                {filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-20 text-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                            <FileX className="size-8 text-muted-foreground/50" />
                        </div>
                        <div>
                            <p className="font-semibold">Tidak ada media</p>
                            <p className="text-sm text-muted-foreground">
                                {search
                                    ? 'Tidak ada hasil untuk pencarian ini.'
                                    : 'Belum ada media yang tersedia.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">Preview</TableHead>
                                    <TableHead>Nama File</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead className="max-w-xs">Sumber</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="w-16 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((item) => {
                                    const config = TYPE_CONFIG[item.type];
                                    const Icon = config.icon;
                                    const fileUrl = imageUrl(item.file_path);

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="size-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                                    {item.type === 'short_video' ? (
                                                        <Film className="size-5 text-muted-foreground" />
                                                    ) : fileUrl ? (
                                                        <img
                                                            src={fileUrl}
                                                            alt={item.file_name}
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Icon className="size-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-sm max-w-[200px] truncate">
                                                {item.file_name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${config.color} border-0 font-medium`}>
                                                    {item.type_label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                {item.related_url ? (
                                                    <Link
                                                        href={item.related_url}
                                                        className="text-sm text-muted-foreground hover:text-foreground hover:underline line-clamp-1"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground line-clamp-1">
                                                        {item.title}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                {formatDate(item.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {fileUrl && (
                                                    <a
                                                        href={fileUrl}
                                                        download
                                                        className="inline-flex items-center justify-center"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <Download className="size-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {media.last_page > 1 && (
                    <div className="flex items-center justify-between border-t pt-5">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-semibold text-foreground">{media.from}</span>
                            {' – '}
                            <span className="font-semibold text-foreground">{media.to}</span>
                            {' dari '}
                            <span className="font-semibold text-foreground">{media.total}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-8 p-0 rounded-lg"
                                disabled={media.current_page === 1}
                                onClick={() =>
                                    router.get('/gallery', {
                                        type: activeTab === 'all' ? undefined : activeTab,
                                        page: media.current_page - 1,
                                    })
                                }
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground px-3">
                                Hal. {media.current_page} / {media.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-8 p-0 rounded-lg"
                                disabled={media.current_page === media.last_page}
                                onClick={() =>
                                    router.get('/gallery', {
                                        type: activeTab === 'all' ? undefined : activeTab,
                                        page: media.current_page + 1,
                                    })
                                }
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

GalleryIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Galeri', href: '/gallery' },
    ],
};
