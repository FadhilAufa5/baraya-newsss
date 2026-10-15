import { Head, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dashboard Modular Components
import { StatsCards, type DashboardStatsProps } from '@/components/dashboard/stats-cards';
import { TrafficChartCard } from '@/components/dashboard/traffic-chart-card';
import { CategoryDistributionCard, type CategoryStat } from '@/components/dashboard/category-distribution-card';
import { RecentArticlesTable, type Article } from '@/components/dashboard/recent-articles-table';
import { TopArticlesCard, type TopArticleItem } from '@/components/dashboard/top-articles-card';
import { NotificationsPopover, type NotificationItem } from '@/components/dashboard/notifications-popover';
import { type TrafficPoint } from '@/components/dashboard/area-chart';

interface DashboardProps extends DashboardStatsProps {
    weeklyTraffic: TrafficPoint[];
    chartTitle?: string;
    chartSubtitle?: string;
    categoryDistribution: CategoryStat[];
    recentArticles: Article[];
    topArticles: TopArticleItem[];
    notifications: NotificationItem[];
    filters: { period: string };
}

export default function Dashboard({
    stats,
    weeklyTraffic,
    chartTitle,
    chartSubtitle,
    categoryDistribution = [],
    recentArticles,
    topArticles,
    notifications,
    filters,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4">

                {/* ── Page Header ───────────────────────────────────────── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard Baraya-News</h1>
                        <p className="text-sm text-muted-foreground">
                            Pantau performa dan traffic berita Anda secara real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select
                            value={filters.period || 'week'}
                            onValueChange={(value) => { 
                                router.get(dashboard(), { period: value }, { preserveState: true, preserveScroll: true });
                            }}
                        >
                            <SelectTrigger className="w-[160px] h-10 rounded-xl cursor-pointer">
                                <SelectValue placeholder="Pilih Waktu" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                                <SelectItem value="month">30 Hari Terakhir</SelectItem>
                                <SelectItem value="year">12 Bulan Terakhir</SelectItem>
                                <SelectItem value="all">Semua Waktu</SelectItem>
                            </SelectContent>
                        </Select>

                        <NotificationsPopover initialNotifications={notifications} />
                    </div>
                </div>

                {/* ── Statistics Metric Cards ────────────────────────────── */}
                <StatsCards stats={stats} />

                {/* ── Main Traffic Chart & Category Distribution ───────── */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <TrafficChartCard
                        weeklyTraffic={weeklyTraffic}
                        chartTitle={chartTitle}
                        chartSubtitle={chartSubtitle}
                    />
                    <CategoryDistributionCard categoryDistribution={categoryDistribution} />
                </div>

                {/* ── Recent Articles & Top Articles ───────────────────── */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <RecentArticlesTable recentArticles={recentArticles} />
                    <TopArticlesCard topArticles={topArticles} />
                </div>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
