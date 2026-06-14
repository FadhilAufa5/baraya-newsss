import { useState } from 'react';
import { Eye, Printer, Calendar, Clock, MapPin, Users, FileText, CheckSquare, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface DetailBeritaAcaraDialogProps {
    beritaAcara: BeritaAcara;
    trigger?: React.ReactNode;
}

const statusConfig: Record<string, { label: string; variant: 'secondary' | 'warning' | 'success' | 'danger' }> = {
    draft:     { label: 'Draft',     variant: 'secondary' },
    menunggu:  { label: 'Menunggu',  variant: 'warning' },
    disetujui: { label: 'Disetujui', variant: 'success' },
    ditolak:   { label: 'Ditolak',   variant: 'danger' },
};

function formatTanggal(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function DetailBeritaAcaraDialog({ beritaAcara, trigger }: DetailBeritaAcaraDialogProps) {
    const [open, setOpen] = useState(false);
    const statusInfo = statusConfig[beritaAcara.status] ?? { label: beritaAcara.status, variant: 'secondary' as const };

    const handlePrint = () => {
        const printContent = document.getElementById(`print-ba-${beritaAcara.id}`);
        if (!printContent) return;
        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${beritaAcara.nomor_surat} — ${beritaAcara.judul}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; background: #fff; padding: 2cm; }
                    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; }
                    h2 { font-size: 12pt; text-align: center; margin-bottom: 2px; }
                    .center { text-align: center; }
                    .divider { border-top: 2px solid #000; margin: 8px 0; }
                    .divider-thin { border-top: 1px solid #000; margin: 4px 0; }
                    table.info { width: 100%; margin: 12px 0; }
                    table.info td { padding: 2px 4px; vertical-align: top; }
                    table.info td:first-child { width: 160px; white-space: nowrap; }
                    .section { margin: 12px 0; }
                    .section-title { font-weight: bold; text-decoration: underline; margin-bottom: 4px; }
                    .content { white-space: pre-wrap; line-height: 1.6; }
                    .peserta-list { padding-left: 20px; }
                    .ttd-grid { display: flex; gap: 40px; margin-top: 40px; }
                    .ttd-item { flex: 1; text-align: center; }
                    .ttd-line { border-bottom: 1px solid #000; margin: 60px 0 4px; }
                    @media print { body { padding: 1cm; } }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `);
        win.document.close();
        setTimeout(() => { win.print(); win.close(); }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-4 border-b flex-row items-center justify-between space-y-0">
                    <div className="space-y-1 flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-2 flex-wrap">
                            <DialogTitle className="text-base font-semibold truncate">{beritaAcara.nomor_surat}</DialogTitle>
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{beritaAcara.judul}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handlePrint} className="shrink-0 gap-1.5">
                        <Printer className="h-4 w-4" />
                        Cetak
                    </Button>
                </DialogHeader>

                <ScrollArea className="max-h-[80vh]">
                    <div className="px-6 py-5 space-y-5">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">Tanggal</span>
                                </div>
                                <p className="text-sm font-semibold leading-tight">{formatTanggal(beritaAcara.tanggal_acara)}</p>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">Waktu</span>
                                </div>
                                <p className="text-sm font-semibold">
                                    {beritaAcara.waktu_mulai ?? '--:--'} – {beritaAcara.waktu_selesai ?? '--:--'}
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 space-y-1 col-span-2">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">Tempat</span>
                                </div>
                                <p className="text-sm font-semibold">{beritaAcara.tempat}</p>
                            </div>
                        </div>

                        {/* Pimpinan & Notulis */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border p-3 space-y-0.5">
                                <p className="text-xs text-muted-foreground font-medium">Pimpinan Rapat</p>
                                <p className="text-sm font-semibold">{beritaAcara.pimpinan_rapat}</p>
                            </div>
                            <div className="rounded-lg border p-3 space-y-0.5">
                                <p className="text-xs text-muted-foreground font-medium">Notulis</p>
                                <p className="text-sm font-semibold">{beritaAcara.notulis}</p>
                            </div>
                        </div>

                        {/* Peserta */}
                        {beritaAcara.peserta && beritaAcara.peserta.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold">Peserta ({beritaAcara.peserta.length} orang)</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg border p-3">
                                    {beritaAcara.peserta.map((p, i) => (
                                        <div key={i} className="text-sm text-muted-foreground flex gap-1.5">
                                            <span className="font-mono text-xs w-5 shrink-0 text-right">{i + 1}.</span>
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Agenda */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">Agenda</h3>
                            </div>
                            <div className="rounded-lg border bg-muted/20 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                                {beritaAcara.agenda}
                            </div>
                        </div>

                        {/* Isi Pembahasan */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Isi Pembahasan
                            </h3>
                            <div className="rounded-lg border bg-muted/20 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                                {beritaAcara.isi_pembahasan}
                            </div>
                        </div>

                        {/* Kesimpulan */}
                        {beritaAcara.kesimpulan && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    Kesimpulan
                                </h3>
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/20 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                                    {beritaAcara.kesimpulan}
                                </div>
                            </div>
                        )}

                        {/* Tindak Lanjut */}
                        {beritaAcara.tindak_lanjut && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    Tindak Lanjut
                                </h3>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                                    {beritaAcara.tindak_lanjut}
                                </div>
                            </div>
                        )}

                        {/* Penandatangan */}
                        {beritaAcara.penandatangan && beritaAcara.penandatangan.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <PenSquare className="h-4 w-4 text-muted-foreground" />
                                    Penandatangan
                                </h3>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {beritaAcara.penandatangan.map((p, i) => (
                                        <div key={i} className="rounded-lg border p-4 text-center space-y-1">
                                            <div className="h-12 border-b border-dashed border-muted-foreground/30 mb-2" />
                                            <p className="text-sm font-semibold">{p.nama}</p>
                                            {p.jabatan && <p className="text-xs text-muted-foreground">{p.jabatan}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Catatan Status */}
                        {beritaAcara.catatan_status && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20 p-4 text-sm">
                                <p className="font-medium text-amber-800 dark:text-amber-400 mb-1">Catatan Status</p>
                                <p className="text-amber-700 dark:text-amber-300">{beritaAcara.catatan_status}</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Hidden print content */}
                <div className="hidden">
                    <div id={`print-ba-${beritaAcara.id}`}>
                        <div className="center">
                            <h1>BERITA ACARA</h1>
                            <h2>{beritaAcara.judul}</h2>
                            <p>Nomor: {beritaAcara.nomor_surat}</p>
                        </div>
                        <div className="divider" />
                        <table className="info">
                            <tbody>
                                <tr><td>Tanggal</td><td>: {formatTanggal(beritaAcara.tanggal_acara)}</td></tr>
                                <tr><td>Waktu</td><td>: {beritaAcara.waktu_mulai ?? '--:--'} s.d. {beritaAcara.waktu_selesai ?? '--:--'} WIB</td></tr>
                                <tr><td>Tempat</td><td>: {beritaAcara.tempat}</td></tr>
                                <tr><td>Pimpinan Rapat</td><td>: {beritaAcara.pimpinan_rapat}</td></tr>
                                <tr><td>Notulis</td><td>: {beritaAcara.notulis}</td></tr>
                            </tbody>
                        </table>
                        {beritaAcara.peserta && beritaAcara.peserta.length > 0 && (
                            <>
                                <div className="section-title">Peserta Rapat:</div>
                                <ol className="peserta-list">
                                    {beritaAcara.peserta.map((p, i) => <li key={i}>{p}</li>)}
                                </ol>
                            </>
                        )}
                        <div className="divider-thin" style={{ margin: '12px 0' }} />
                        <div className="section">
                            <div className="section-title">I. Agenda</div>
                            <div className="content" style={{ paddingLeft: '16px' }}>{beritaAcara.agenda}</div>
                        </div>
                        <div className="section">
                            <div className="section-title">II. Isi Pembahasan</div>
                            <div className="content" style={{ paddingLeft: '16px' }}>{beritaAcara.isi_pembahasan}</div>
                        </div>
                        {beritaAcara.kesimpulan && (
                            <div className="section">
                                <div className="section-title">III. Kesimpulan</div>
                                <div className="content" style={{ paddingLeft: '16px' }}>{beritaAcara.kesimpulan}</div>
                            </div>
                        )}
                        {beritaAcara.tindak_lanjut && (
                            <div className="section">
                                <div className="section-title">IV. Tindak Lanjut</div>
                                <div className="content" style={{ paddingLeft: '16px' }}>{beritaAcara.tindak_lanjut}</div>
                            </div>
                        )}
                        {beritaAcara.penandatangan && beritaAcara.penandatangan.length > 0 && (
                            <div className="ttd-grid">
                                {beritaAcara.penandatangan.map((p, i) => (
                                    <div key={i} className="ttd-item">
                                        <p>{p.jabatan}</p>
                                        <div className="ttd-line" />
                                        <p><strong>{p.nama}</strong></p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
