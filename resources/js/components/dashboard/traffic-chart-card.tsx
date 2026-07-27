import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, type TrafficPoint } from './area-chart';

interface TrafficChartCardProps {
    weeklyTraffic: TrafficPoint[];
    chartTitle?: string;
    chartSubtitle?: string;
}

function formatNumber(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
}

export function TrafficChartCard({ weeklyTraffic, chartTitle, chartSubtitle }: TrafficChartCardProps) {
    const totalPageviews = weeklyTraffic.reduce((a, d) => a + d.pageviews, 0);
    const totalVisits = weeklyTraffic.reduce((a, d) => a + d.visits, 0);
    const avgPageviews = Math.round(totalPageviews / (weeklyTraffic.length || 1));

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">{chartTitle || 'Traffic Mingguan'}</CardTitle>
                        <CardDescription className="text-xs">{chartSubtitle || 'Pageviews vs Kunjungan'}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block size-2.5 rounded-full bg-violet-500" />
                            Pageviews
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block size-2.5 rounded-full bg-blue-500" />
                            Kunjungan
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <AreaChart data={weeklyTraffic} />
                <div className="mt-3 grid grid-cols-3 divide-x divide-border text-center">
                    {[
                        { label: 'Total Pageviews', value: formatNumber(totalPageviews) },
                        { label: 'Total Kunjungan', value: formatNumber(totalVisits) },
                        { label: 'Rerata Periode', value: formatNumber(avgPageviews) },
                    ].map((s) => (
                        <div key={s.label} className="px-4 py-2">
                            <p className="text-lg font-bold">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
