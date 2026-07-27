import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface TopArticleItem {
    title: string;
    views: number;
    trend: number;
}

interface TopArticlesCardProps {
    topArticles: TopArticleItem[];
}

function formatNumber(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
}

export function TopArticlesCard({ topArticles }: TopArticlesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Artikel Terpopuler</CardTitle>
                <CardDescription className="text-xs">Berdasarkan jumlah pageviews</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4 pt-0">
                {topArticles.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                            {i + 1}
                        </span>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium leading-snug">{a.title}</p>
                            <div className="mt-0.5 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{formatNumber(a.views)} views</span>
                                <span
                                    className={`flex items-center gap-0.5 text-xs font-semibold ${
                                        a.trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                                    }`}
                                >
                                    {a.trend >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                    {Math.abs(a.trend)}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
