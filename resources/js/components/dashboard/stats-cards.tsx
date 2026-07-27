import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Newspaper, Eye, Users, MessageSquare } from 'lucide-react';

export interface DashboardStatsProps {
    stats: {
        totalNews: { value: string; change: number };
        pageviews: { value: string; change: number };
        uniqueVisitors: { value: string; change: number };
        totalComments: { value: string; change: number };
    };
}

export function StatsCards({ stats }: DashboardStatsProps) {
    const trafficStats = [
        {
            label: 'Total Berita',
            value: stats.totalNews.value,
            change: stats.totalNews.change,
            icon: Newspaper,
            color: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-100 dark:bg-violet-900/30',
        },
        {
            label: 'Pageviews',
            value: stats.pageviews.value,
            change: stats.pageviews.change,
            icon: Eye,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            label: 'Pengunjung Unik',
            value: stats.uniqueVisitors.value,
            change: stats.uniqueVisitors.change,
            icon: Users,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        },
        {
            label: 'Total Komentar',
            value: stats.totalComments.value,
            change: stats.totalComments.change,
            icon: MessageSquare,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {trafficStats.map((stat) => {
                const Icon = stat.icon;
                const isUp = stat.change >= 0;
                return (
                    <Card key={stat.label} className="relative overflow-hidden transition-shadow hover:shadow-md">
                        <CardContent className="pt-1">
                            <div className="flex items-center justify-between">
                                <div className={`rounded-lg p-2 ${stat.bg}`}>
                                    <Icon className={`size-5 ${stat.color}`} />
                                </div>
                                <span
                                    className={`flex items-center gap-0.5 text-xs font-semibold ${
                                        isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                                    }`}
                                >
                                    {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                    {Math.abs(stat.change)}%
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                            {/* Decorative background blob */}
                            <div className={`pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full opacity-10 blur-2xl ${stat.bg}`} />
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
