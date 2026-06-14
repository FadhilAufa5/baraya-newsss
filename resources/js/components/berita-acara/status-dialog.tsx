import { useForm } from '@inertiajs/react';
import { ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';

interface BeritaAcara {
    id: number;
    nomor_surat: string;
    judul: string;
    status: string;
}

interface StatusBeritaAcaraDialogProps {
    beritaAcara: BeritaAcara;
    trigger?: React.ReactNode;
}

const statusOptions = [
    {
        value: 'draft',
        label: 'Draft',
        description: 'Masih dalam penyusunan',
        color: 'secondary' as const,
    },
    {
        value: 'menunggu',
        label: 'Menunggu Persetujuan',
        description: 'Menunggu review dan tanda tangan',
        color: 'warning' as const,
    },
    {
        value: 'disetujui',
        label: 'Disetujui',
        description: 'Telah disetujui dan disahkan',
        color: 'success' as const,
    },
    {
        value: 'ditolak',
        label: 'Ditolak',
        description: 'Ditolak dan perlu revisi',
        color: 'danger' as const,
    },
];

export function StatusBeritaAcaraDialog({ beritaAcara, trigger }: StatusBeritaAcaraDialogProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, patch, processing, reset } = useForm({
        status: beritaAcara.status,
        catatan_status: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/berita-acara/${beritaAcara.id}/status`, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
        if (!val) reset();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="outline" size="sm">
                        <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Ubah Status</DialogTitle>
                    <DialogDescription>
                        Pilih status baru untuk <strong>{beritaAcara.nomor_surat}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <RadioGroup
                        value={data.status}
                        onValueChange={val => setData('status', val)}
                        className="gap-2"
                    >
                        {statusOptions.map(opt => (
                            <label
                                key={opt.value}
                                htmlFor={`status-${opt.value}`}
                                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                                    data.status === opt.value
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'hover:bg-muted/50'
                                }`}
                            >
                                <RadioGroupItem value={opt.value} id={`status-${opt.value}`} className="mt-0.5" />
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{opt.label}</span>
                                        <Badge variant={opt.color} className="text-xs">{opt.label}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                                </div>
                            </label>
                        ))}
                    </RadioGroup>

                    <div className="space-y-1.5">
                        <Label htmlFor="catatan_status">Catatan (opsional)</Label>
                        <Textarea
                            id="catatan_status"
                            rows={2}
                            placeholder="Tambahkan catatan perubahan status..."
                            value={data.catatan_status}
                            onChange={e => setData('catatan_status', e.target.value)}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner className="mr-2" />}
                            Simpan Status
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
