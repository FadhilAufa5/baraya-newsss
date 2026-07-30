import { Megaphone, Eye, EyeOff, BarChart3 } from 'lucide-react';

interface Props {
    total: number;
    activeCount: number;
}

export default function AdsStatsCards({ total, activeCount }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-amber-500/5 blur-2xl" />
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Iklan</p>
                        <p className="mt-2 text-4xl font-bold tracking-tight">{total}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <Megaphone className="size-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BarChart3 className="size-3.5 text-amber-500" />
                    Semua iklan
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-emerald-500/5 blur-2xl" />
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Aktif</p>
                        <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{activeCount}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Eye className="size-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Eye className="size-3.5 text-emerald-500" />
                    Ditampilkan di beranda
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-slate-500/5 blur-2xl" />
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Nonaktif</p>
                        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-500">{total - activeCount}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400">
                        <EyeOff className="size-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <EyeOff className="size-3.5 text-slate-500" />
                    Tidak ditampilkan
                </div>
            </div>
        </div>
    );
}
