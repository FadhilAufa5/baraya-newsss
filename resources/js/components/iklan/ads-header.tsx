import { Megaphone, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    total: number;
}

export default function AdsHeader({ total }: Props) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 left-20 size-40 rounded-full bg-orange-500/10 blur-2xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                        <Megaphone className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Manajemen Iklan</h1>
                        <p className="text-sm text-slate-400">Kelola iklan yang tampil di halaman beranda.</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm ring-1 ring-white/20">
                        <Megaphone className="size-3.5" />
                        {total} iklan
                    </div>
                    <Button asChild className="gap-2 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/25">
                        <Link href="/iklan/create">
                            <Plus className="size-4" />
                            Tambah Iklan
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
