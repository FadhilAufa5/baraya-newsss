import { Megaphone, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function AdsEmptyState() {
    return (
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
    );
}
