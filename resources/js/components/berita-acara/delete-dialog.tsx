import { router } from '@inertiajs/react';
import { Trash2, AlertTriangle } from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinner';

interface BeritaAcara {
    id: number;
    nomor_surat: string;
    judul: string;
}

interface DeleteBeritaAcaraDialogProps {
    beritaAcara: BeritaAcara;
    trigger?: React.ReactNode;
}

export function DeleteBeritaAcaraDialog({ beritaAcara, trigger }: DeleteBeritaAcaraDialogProps) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(`/berita-acara/${beritaAcara.id}`, {
            onSuccess: () => setOpen(false),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-center">Hapus Berita Acara</DialogTitle>
                    <DialogDescription className="text-center">
                        Apakah Anda yakin ingin menghapus berita acara ini? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-1">
                    <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-24">Nomor Surat</span>
                        <span className="font-medium">{beritaAcara.nomor_surat}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-24">Judul</span>
                        <span className="font-medium line-clamp-2">{beritaAcara.judul}</span>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={processing} className="flex-1">
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing} className="flex-1">
                        {processing && <Spinner className="mr-2" />}
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
