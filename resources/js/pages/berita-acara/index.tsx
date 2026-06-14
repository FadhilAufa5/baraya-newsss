import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ClipboardList,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    FileX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CreateBeritaAcaraDialog } from '@/components/berita-acara/create-dialog';
import { EditBeritaAcaraDialog } from '@/components/berita-acara/edit-dialog';
import { DeleteBeritaAcaraDialog } from '@/components/berita-acara/delete-dialog';
import { StatusBeritaAcaraDialog } from '@/components/berita-acara/status-dialog';
import { DetailBeritaAcaraDialog } from '@/components/berita-acara/detail-dialog';

interface Penandatangan {
    nama: string;
    jabatan: string;
}

interface BeritaAcara {
    id: number;
    nomor_surat: string;
    judul: string;
    tanggal_acara: string;
    waktu_mulai: string | null;
    waktu_selesai: string | null;
    tempat: string;
    pimpinan_rapat: string;
    notulis: string;
    agenda: string;
    isi_pembahasan: string;
    kesimpulan: string | null;
    tindak_lanjut: string | null;
    status: string;
    catatan_status: string | null;
    peserta: string[] | null;
    penandatangan: Penandatangan[] | null;
    user?: { name: string };
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: BeritaAcara[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    beritaAcara: PaginatedData;
    filters: {
        search?: string;
        status?: string;
    };
}

const statusConfig: Record<string, { label: string; variant: 'secondary' | 'warning' | 'success' | 'danger' }> = {
    draft:     { label: 'Draft',     variant: 'secondary' },
    menunggu:  { label: 'Menunggu',  variant: 'warning' },
    disetujui: { label: 'Disetujui', variant: 'success' },
    ditolak:   { label: 'Ditolak',   variant: 'danger' },
};

function formatTanggal(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function BeritaAcaraIndex({ beritaAcara, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');

    const applyFilter = (newSearch: string, newStatus: string) => {
        router.get(
            '/berita-acara',
            {
                ...(newSearch ? { search: newSearch } : {}),
                ...(newStatus && newStatus !== 'all' ? { status: newStatus } : {}),
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') applyFilter(search, status);
    };

    const handleStatusChange = (val: string) => {
        setStatus(val);
        applyFilter(search, val);
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get('/berita-acara', {}, { preserveState: false });
    };

    const hasFilter = (filters.search || (filters.status && filters.status !== 'all'));

    const stats = [
        { label: 'Total', value: beritaAcara.total, color: 'text-foreground' },
        { label: 'Draft', value: beritaAcara.data.filter(b => b.status === 'draft').length + (beritaAcara.current_page > 1 ? '…' : ''), color: 'text-muted-foreground' },
        { label: 'Menunggu', value: beritaAcara.data.filter(b => b.status === 'menunggu').length + (beritaAcara.current_page > 1 ? '…' : ''), color: 'text-amber-600' },
        { label: 'Disetujui', value: beritaAcara.data.filter(b => b.status === 'disetujui').length + (beritaAcara.current_page > 1 ? '…' : ''), color: 'text-emerald-600' },
    ];

    return (
        <>
            <Head title="Berita Acara" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <ClipboardList className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Berita Acara</h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola dokumen berita acara rapat dan kegiatan
                            </p>
                        </div>
                    </div>
                    <CreateBeritaAcaraDialog />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="search-berita-acara"
                            placeholder="Cari nomor surat, judul, pimpinan rapat..."
                            className="pl-9"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger id="filter-status" className="w-full sm:w-44">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="menunggu">Menunggu</SelectItem>
                            <SelectItem value="disetujui">Disetujui</SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        id="btn-search"
                        onClick={() => applyFilter(search, status)}
                        className="shrink-0"
                    >
                        Cari
                    </Button>
                    {hasFilter && (
                        <Button
                            id="btn-clear-filter"
                            variant="ghost"
                            onClick={clearFilters}
                            className="shrink-0 gap-1.5 text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead>Nomor Surat</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Pimpinan Rapat</TableHead>
                                <TableHead>Tempat</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center w-36">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {beritaAcara.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <FileX className="h-10 w-10 opacity-40" />
                                            <div>
                                                <p className="font-medium">Belum ada berita acara</p>
                                                <p className="text-sm mt-0.5">
                                                    {hasFilter
                                                        ? 'Tidak ditemukan hasil yang cocok. Coba ubah filter.'
                                                        : 'Klik "Buat Berita Acara" untuk membuat yang pertama.'}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                beritaAcara.data.map((item, index) => {
                                    const st = statusConfig[item.status] ?? { label: item.status, variant: 'secondary' as const };
                                    const rowNum = (beritaAcara.current_page - 1) * beritaAcara.per_page + index + 1;
                                    return (
                                        <TableRow key={item.id} className="group">
                                            <TableCell className="text-center text-muted-foreground text-xs">{rowNum}</TableCell>
                                            <TableCell>
                                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                                    {item.nomor_surat}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium max-w-[200px] truncate">{item.judul}</p>
                                                {item.peserta && item.peserta.length > 0 && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {item.peserta.length} peserta
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                {formatTanggal(item.tanggal_acara)}
                                                {item.waktu_mulai && (
                                                    <div className="text-xs mt-0.5">{item.waktu_mulai} – {item.waktu_selesai ?? '...'}</div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">{item.pimpinan_rapat}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">{item.tempat}</TableCell>
                                            <TableCell>
                                                <Badge variant={st.variant}>{st.label}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1">
                                                    <DetailBeritaAcaraDialog
                                                        beritaAcara={item}
                                                        trigger={
                                                            <Button
                                                                id={`btn-detail-${item.id}`}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                                                                title="Lihat Detail"
                                                            >
                                                                <span className="sr-only">Detail</span>
                                                                👁
                                                            </Button>
                                                        }
                                                    />
                                                    <EditBeritaAcaraDialog
                                                        beritaAcara={item}
                                                        trigger={
                                                            <Button
                                                                id={`btn-edit-${item.id}`}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                                                                title="Edit"
                                                            >
                                                                <span className="sr-only">Edit</span>
                                                                ✏️
                                                            </Button>
                                                        }
                                                    />
                                                    <StatusBeritaAcaraDialog
                                                        beritaAcara={item}
                                                        trigger={
                                                            <Button
                                                                id={`btn-status-${item.id}`}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                                                                title="Ubah Status"
                                                            >
                                                                <span className="sr-only">Status</span>
                                                                🔄
                                                            </Button>
                                                        }
                                                    />
                                                    <DeleteBeritaAcaraDialog
                                                        beritaAcara={item}
                                                        trigger={
                                                            <Button
                                                                id={`btn-delete-${item.id}`}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 hover:text-destructive"
                                                                title="Hapus"
                                                            >
                                                                <span className="sr-only">Hapus</span>
                                                                🗑️
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {beritaAcara.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {beritaAcara.from ?? 0}–{beritaAcara.to ?? 0} dari {beritaAcara.total} data
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                id="btn-prev-page"
                                variant="outline"
                                size="sm"
                                disabled={beritaAcara.current_page === 1}
                                onClick={() =>
                                    router.get('/berita-acara', {
                                        ...filters,
                                        page: beritaAcara.current_page - 1,
                                    })
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {beritaAcara.links
                                .filter(l => !l.label.includes('Previous') && !l.label.includes('Next'))
                                .map((link, i) => (
                                    <Button
                                        key={i}
                                        id={`btn-page-${link.label}`}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        className="min-w-8"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            <Button
                                id="btn-next-page"
                                variant="outline"
                                size="sm"
                                disabled={beritaAcara.current_page === beritaAcara.last_page}
                                onClick={() =>
                                    router.get('/berita-acara', {
                                        ...filters,
                                        page: beritaAcara.current_page + 1,
                                    })
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

BeritaAcaraIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Berita Acara', href: '/berita-acara' },
    ],
};
