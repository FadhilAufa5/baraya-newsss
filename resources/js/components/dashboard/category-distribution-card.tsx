import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen } from 'lucide-react';

export interface CategoryStat {
    name: string;
    count: number;
    views: number;
    percent: number;
    color: string;
}

interface CategoryDistributionCardProps {
    categoryDistribution: CategoryStat[];
}

function formatNumber(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
}

export function CategoryDistributionCard({ categoryDistribution = [] }: CategoryDistributionCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Distribusi Kategori</CardTitle>
                        <CardDescription className="text-xs">Topik & kategori berita terpopuler</CardDescription>
                    </div>
                    <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                        <FolderOpen className="size-4 text-red-600 dark:text-red-400" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {categoryDistribution.length > 0 ? (
                    <>
                        {/* Stacked progress bar */}
                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                            {categoryDistribution.map((s) => (
                                <div
                                    key={s.name}
                                    className={`${s.color} transition-all`}
                                    style={{ width: `${Math.max(s.percent, 5)}%` }}
                                    title={`${s.name}: ${s.count} artikel (${s.percent}%)`}
                                />
                            ))}
                        </div>

                        {/* Legend / Category List */}
                        <div className="flex flex-col gap-3.5 mt-1">
                            {categoryDistribution.map((s) => (
                                <div key={s.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className={`inline-block size-3 shrink-0 rounded-full ${s.color}`} />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold leading-tight truncate">{s.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{s.count} artikel · {formatNumber(s.views)} views</span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-[11px] font-bold shrink-0">
                                        {s.percent}%
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
                        <FolderOpen className="size-6 text-muted-foreground opacity-50" />
                        <p className="text-xs text-muted-foreground">Belum ada data kategori terbit</p>
                    </div>
                )}

                <div className="rounded-lg border border-dashed bg-muted/40 p-2.5 text-center mt-1">
                    <p className="text-[11px] text-muted-foreground">
                        Data persentase artikel terpublikasi di portal
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
