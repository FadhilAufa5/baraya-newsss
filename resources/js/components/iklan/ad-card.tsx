import { Link } from '@inertiajs/react';
import { CalendarDays, Megaphone, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Ad } from './types';

interface Props {
    ad: Ad;
    onToggle: (ad: Ad) => void;
    onDelete: (ad: Ad) => void;
}

const TYPE_CONFIG = {
    leaderboard: { label: 'Leaderboard', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    'in-feed': { label: 'In-Feed', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    rectangle: { label: 'Rectangle', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

const POSITION_LABEL: Record<string, string> = {
    top: 'Atas',
    middle: 'Tengah',
    sidebar: 'Sidebar',
};

function formatDate(value: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdCard({ ad, onToggle, onDelete }: Props) {
    const typeConfig = TYPE_CONFIG[ad.type];

    return (
        <Card className={`overflow-hidden transition-all ${!ad.is_active ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                            ad.is_active
                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                            <Megaphone className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold line-clamp-1">{ad.title}</h3>
                                <Badge className={`${typeConfig.className} text-[10px]`}>{typeConfig.label}</Badge>
                                {!ad.is_active && (
                                    <Badge variant="outline" className="text-[10px] text-muted-foreground">Nonaktif</Badge>
                                )}
                            </div>
                            {ad.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{ad.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                                <span>{ad.sponsor_name ?? '—'}</span>
                                <span>•</span>
                                <span>{POSITION_LABEL[ad.position]}</span>
                                <span>•</span>
                                <span>{ad.cta_text}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="size-3" />
                                    {formatDate(ad.starts_at)} — {formatDate(ad.ends_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl" onClick={() => onToggle(ad)}>
                            {ad.is_active ? (
                                <ToggleRight className="size-4 text-emerald-500" />
                            ) : (
                                <ToggleLeft className="size-4 text-muted-foreground" />
                            )}
                            {ad.is_active ? 'Aktif' : 'Nonaktif'}
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-xl">
                            <Link href={`/iklan/${ad.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                            variant="ghost" size="sm"
                            className="gap-1.5 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(ad)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
