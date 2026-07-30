import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import type { Ad } from './types';

interface Props {
    target: Ad | null;
    deleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function AdsDeleteDialog({ target, deleting, onClose, onConfirm }: Props) {
    return (
        <Dialog open={!!target} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                        <Trash2 className="size-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-center">Hapus Iklan?</DialogTitle>
                    <DialogDescription className="text-center">
                        Iklan <strong>"{target?.title}"</strong> akan dihapus permanen.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={deleting}>Batal</Button>
                    <Button variant="destructive" className="flex-1" onClick={onConfirm} disabled={deleting}>
                        {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
