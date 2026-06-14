import { useForm } from '@inertiajs/react';
import { PlusCircle, X, UserPlus, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
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
    peserta: string[] | null;
    penandatangan: Penandatangan[] | null;
}

interface EditBeritaAcaraDialogProps {
    beritaAcara: BeritaAcara;
    trigger?: React.ReactNode;
}

export function EditBeritaAcaraDialog({ beritaAcara, trigger }: EditBeritaAcaraDialogProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [pesertaInput, setPesertaInput] = useState('');
    const [pesertaList, setPesertaList] = useState<string[]>([]);
    const [penandatanganList, setPenandatanganList] = useState<Penandatangan[]>([]);
    const [newPenandatangan, setNewPenandatangan] = useState<Penandatangan>({ nama: '', jabatan: '' });

    const { data, setData, put, processing, errors, reset } = useForm({
        nomor_surat: beritaAcara.nomor_surat,
        judul: beritaAcara.judul,
        tanggal_acara: beritaAcara.tanggal_acara,
        waktu_mulai: beritaAcara.waktu_mulai ?? '',
        waktu_selesai: beritaAcara.waktu_selesai ?? '',
        tempat: beritaAcara.tempat,
        pimpinan_rapat: beritaAcara.pimpinan_rapat,
        notulis: beritaAcara.notulis,
        agenda: beritaAcara.agenda,
        isi_pembahasan: beritaAcara.isi_pembahasan,
        kesimpulan: beritaAcara.kesimpulan ?? '',
        tindak_lanjut: beritaAcara.tindak_lanjut ?? '',
        peserta: beritaAcara.peserta ?? [],
        penandatangan: beritaAcara.penandatangan ?? [],
    });

    useEffect(() => {
        if (open) {
            setPesertaList(beritaAcara.peserta ?? []);
            setPenandatanganList(beritaAcara.penandatangan ?? []);
        }
    }, [open]);

    const addPeserta = () => {
        if (pesertaInput.trim()) {
            const updated = [...pesertaList, pesertaInput.trim()];
            setPesertaList(updated);
            setData('peserta', updated);
            setPesertaInput('');
        }
    };

    const removePeserta = (index: number) => {
        const updated = pesertaList.filter((_, i) => i !== index);
        setPesertaList(updated);
        setData('peserta', updated);
    };

    const addPenandatangan = () => {
        if (newPenandatangan.nama.trim()) {
            const updated = [...penandatanganList, { ...newPenandatangan }];
            setPenandatanganList(updated);
            setData('penandatangan', updated);
            setNewPenandatangan({ nama: '', jabatan: '' });
        }
    };

    const removePenandatangan = (index: number) => {
        const updated = penandatanganList.filter((_, i) => i !== index);
        setPenandatanganList(updated);
        setData('penandatangan', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/berita-acara/${beritaAcara.id}`, {
            onSuccess: () => {
                setOpen(false);
                setStep(1);
            },
        });
    };

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
        if (!val) setStep(1);
    };

    const totalSteps = 4;
    const stepTitles = ['Informasi Umum', 'Peserta & Pimpinan', 'Agenda & Pembahasan', 'Kesimpulan & TTD'];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
                    <DialogTitle className="text-lg font-semibold">Edit Berita Acara</DialogTitle>
                    <DialogDescription>Langkah {step} dari {totalSteps}: <strong>{stepTitles[step - 1]}</strong></DialogDescription>
                    <div className="flex items-center gap-2 mt-3">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(i + 1)}
                                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                                        i + 1 === step
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : i + 1 < step
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            : 'bg-muted text-muted-foreground border hover:bg-muted/80'
                                    }`}
                                >
                                    {i + 1 < step ? '✓' : i + 1}
                                </button>
                                {i < totalSteps - 1 && (
                                    <div className={`h-0.5 w-8 rounded-full transition-all ${i + 1 < step ? 'bg-emerald-500' : 'bg-muted'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <ScrollArea className="max-h-[65vh]">
                        <div className="px-6 py-5 space-y-4">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 grid gap-1.5">
                                            <Label htmlFor="edit-nomor_surat">Nomor Surat <span className="text-destructive">*</span></Label>
                                            <Input id="edit-nomor_surat" value={data.nomor_surat} onChange={e => setData('nomor_surat', e.target.value)} />
                                            <InputError message={errors.nomor_surat} />
                                        </div>
                                        <div className="col-span-2 grid gap-1.5">
                                            <Label htmlFor="edit-judul">Judul <span className="text-destructive">*</span></Label>
                                            <Input id="edit-judul" value={data.judul} onChange={e => setData('judul', e.target.value)} />
                                            <InputError message={errors.judul} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-tanggal">Tanggal Acara <span className="text-destructive">*</span></Label>
                                            <Input id="edit-tanggal" type="date" value={data.tanggal_acara} onChange={e => setData('tanggal_acara', e.target.value)} />
                                            <InputError message={errors.tanggal_acara} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-tempat">Tempat <span className="text-destructive">*</span></Label>
                                            <Input id="edit-tempat" value={data.tempat} onChange={e => setData('tempat', e.target.value)} />
                                            <InputError message={errors.tempat} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-waktu_mulai">Waktu Mulai</Label>
                                            <Input id="edit-waktu_mulai" type="time" value={data.waktu_mulai} onChange={e => setData('waktu_mulai', e.target.value)} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-waktu_selesai">Waktu Selesai</Label>
                                            <Input id="edit-waktu_selesai" type="time" value={data.waktu_selesai} onChange={e => setData('waktu_selesai', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-pimpinan">Pimpinan Rapat <span className="text-destructive">*</span></Label>
                                            <Input id="edit-pimpinan" value={data.pimpinan_rapat} onChange={e => setData('pimpinan_rapat', e.target.value)} />
                                            <InputError message={errors.pimpinan_rapat} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-notulis">Notulis <span className="text-destructive">*</span></Label>
                                            <Input id="edit-notulis" value={data.notulis} onChange={e => setData('notulis', e.target.value)} />
                                            <InputError message={errors.notulis} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Daftar Peserta</Label>
                                        <div className="flex gap-2">
                                            <Input placeholder="Nama peserta..." value={pesertaInput} onChange={e => setPesertaInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPeserta())} />
                                            <Button type="button" variant="outline" onClick={addPeserta}><UserPlus className="h-4 w-4" /></Button>
                                        </div>
                                        {pesertaList.length > 0 ? (
                                            <div className="rounded-md border divide-y">
                                                {pesertaList.map((p, i) => (
                                                    <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                                                        <span>{i + 1}. {p}</span>
                                                        <button type="button" onClick={() => removePeserta(i)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">Belum ada peserta</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-agenda">Agenda <span className="text-destructive">*</span></Label>
                                        <Textarea id="edit-agenda" rows={3} value={data.agenda} onChange={e => setData('agenda', e.target.value)} />
                                        <InputError message={errors.agenda} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-pembahasan">Isi Pembahasan <span className="text-destructive">*</span></Label>
                                        <Textarea id="edit-pembahasan" rows={8} value={data.isi_pembahasan} onChange={e => setData('isi_pembahasan', e.target.value)} />
                                        <InputError message={errors.isi_pembahasan} />
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-kesimpulan">Kesimpulan</Label>
                                        <Textarea id="edit-kesimpulan" rows={3} value={data.kesimpulan} onChange={e => setData('kesimpulan', e.target.value)} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-tindak-lanjut">Tindak Lanjut</Label>
                                        <Textarea id="edit-tindak-lanjut" rows={3} value={data.tindak_lanjut} onChange={e => setData('tindak_lanjut', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Penandatangan</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Nama penandatangan" value={newPenandatangan.nama} onChange={e => setNewPenandatangan(p => ({ ...p, nama: e.target.value }))} />
                                            <div className="flex gap-2">
                                                <Input placeholder="Jabatan" value={newPenandatangan.jabatan} onChange={e => setNewPenandatangan(p => ({ ...p, jabatan: e.target.value }))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPenandatangan())} />
                                                <Button type="button" variant="outline" onClick={addPenandatangan}><PlusCircle className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                        {penandatanganList.length > 0 && (
                                            <div className="rounded-md border divide-y">
                                                {penandatanganList.map((p, i) => (
                                                    <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                                                        <div><span className="font-medium">{p.nama}</span>{p.jabatan && <span className="text-muted-foreground ml-2">— {p.jabatan}</span>}</div>
                                                        <button type="button" onClick={() => removePenandatangan(i)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-2">
                        {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>Sebelumnya</Button>}
                        {step < totalSteps ? (
                            <Button type="button" onClick={() => setStep(s => s + 1)}>Selanjutnya</Button>
                        ) : (
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner className="mr-2" />}
                                Simpan Perubahan
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
