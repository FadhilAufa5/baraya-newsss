import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    TrendingUp,
    TrendingDown,
    Eye,
    Newspaper,
    Users,
    MousePointerClick,
    ArrowUpRight,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
} from 'lucide-react';



interface TrafficStat {
    label: string;
    value: string;
    change: number;
    icon: React.ElementType;
    color: string;
    bg: string;
}

interface Article {
    id: number;
    title: string;
    category: string;
    views: number;
    status: 'published' | 'draft' | 'archived';
    date: string;
}

interface TrafficPoint {
    day: string;
    visits: number;
    pageviews: number;
}

interface Source {
    name: string;
    percent: number;
    icon: React.ElementType;
    color: string;
}


const trafficStats: TrafficStat[] = [
    { label: 'Total Berita', value: '1,284', change: 12.5, icon: Newspaper, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
    { label: 'Pageviews', value: '482,391', change: 8.1, icon: Eye, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Pengunjung Unik', value: '97,204', change: -3.2, icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Klik Artikel', value: '34,820', change: 21.4, icon: MousePointerClick, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
];

const weeklyTraffic: TrafficPoint[] = [
    { day: 'Sen', visits: 4200, pageviews: 9100 },
    { day: 'Sel', visits: 5800, pageviews: 13400 },
    { day: 'Rab', visits: 4900, pageviews: 10200 },
    { day: 'Kam', visits: 7100, pageviews: 16800 },
    { day: 'Jum', visits: 8400, pageviews: 19300 },
    { day: 'Sab', visits: 6200, pageviews: 14100 },
    { day: 'Min', visits: 5300, pageviews: 11900 },
];

const recentArticles: Article[] = [
    { id: 1, title: 'Pemerintah Umumkan Kebijakan Energi Terbarukan', category: 'Politik', views: 12840, status: 'published', date: '15 Jun 2026' },
    { id: 2, title: 'Timnas Indonesia Menang di Kualifikasi Piala Dunia', category: 'Olahraga', views: 29100, status: 'published', date: '14 Jun 2026' },
    { id: 3, title: 'Teknologi AI Transformasi Industri Kesehatan', category: 'Teknologi', views: 8760, status: 'published', date: '14 Jun 2026' },
    { id: 4, title: 'IHSG Menguat di Tengah Ketidakpastian Global', category: 'Ekonomi', views: 5430, status: 'published', date: '13 Jun 2026' },
    { id: 5, title: 'Festival Budaya Nusantara 2026 Resmi Dibuka', category: 'Budaya', views: 3210, status: 'draft', date: '13 Jun 2026' },
    { id: 6, title: 'Gempa Bumi 5,2 SR Guncang Sulawesi Tengah', category: 'Nasional', views: 41200, status: 'published', date: '12 Jun 2026' },
];

const topArticles: { title: string; views: number; trend: number }[] = [
    { title: 'Gempa Bumi 5,2 SR Guncang Sulawesi Tengah', views: 41200, trend: 18 },
    { title: 'Timnas Indonesia Menang di Kualifikasi Piala Dunia', views: 29100, trend: 34 },
    { title: 'Pemerintah Umumkan Kebijakan Energi Terbarukan', views: 12840, trend: -5 },
    { title: 'Teknologi AI Transformasi Industri Kesehatan', views: 8760, trend: 12 },
    { title: 'IHSG Menguat di Tengah Ketidakpastian Global', views: 5430, trend: 7 },
];

const trafficSources: Source[] = [
    { name: 'Desktop', percent: 54, icon: Monitor, color: 'bg-violet-500' },
    { name: 'Mobile', percent: 38, icon: Smartphone, color: 'bg-blue-500' },
    { name: 'Tablet', percent: 8, icon: Tablet, color: 'bg-emerald-500' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
}

function statusVariant(s: Article['status']): 'success' | 'warning' | 'outline' {
    if (s === 'published') return 'success';
    if (s === 'draft') return 'warning';
    return 'outline';
}

// ─── SVG Area Chart ───────────────────────────────────────────────────────────

function AreaChart({ data }: { data: TrafficPoint[] }) {
    const W = 700;
    const H = 180;
    const PL = 0;
    const PR = 0;
    const PT = 10;
    const PB = 30;

    const visits = data.map((d) => d.visits);
    const pageviews = data.map((d) => d.pageviews);
    const maxVal = Math.max(...pageviews) * 1.1;

    const xPos = (i: number) => PL + (i / (data.length - 1)) * (W - PL - PR);
    const yPos = (v: number) => PT + (1 - v / maxVal) * (H - PT - PB);

    const toPath = (vals: number[]) =>
        vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(' ');

    const toArea = (vals: number[]) => {
        const line = toPath(vals);
        const lastX = xPos(vals.length - 1).toFixed(1);
        const baseY = (H - PB).toFixed(1);
        return `${line} L${lastX},${baseY} L${PL},${baseY} Z`;
    };

    const pvPath = toPath(pageviews);
    const visPath = toPath(visits);
    const pvArea = toArea(pageviews);
    const visArea = toArea(visits);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Traffic chart">
            <defs>
                <linearGradient id="grad-pv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grad-vis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((f) => (
                <line
                    key={f}
                    x1={PL} y1={yPos(maxVal * f).toFixed(1)}
                    x2={W - PR} y2={yPos(maxVal * f).toFixed(1)}
                    stroke="currentColor"
                    strokeOpacity="0.06"
                    strokeWidth="1"
                />
            ))}

            {/* Area fills */}
            <path d={pvArea} fill="url(#grad-pv)" />
            <path d={visArea} fill="url(#grad-vis)" />

            {/* Lines */}
            <path d={pvPath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={visPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots + labels */}
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={xPos(i).toFixed(1)} cy={yPos(d.pageviews).toFixed(1)} r="3.5" fill="#8b5cf6" />
                    <circle cx={xPos(i).toFixed(1)} cy={yPos(d.visits).toFixed(1)} r="3.5" fill="#3b82f6" />
                    <text
                        x={xPos(i).toFixed(1)}
                        y={H - 6}
                        textAnchor="middle"
                        fontSize="11"
                        fill="currentColor"
                        opacity="0.5"
                    >
                        {d.day}
                    </text>
                </g>
            ))}
        </svg>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4">

                {/* ── Header ────────────────────────────────────────── */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Baraya-News</h1>
                    <p className="text-sm text-muted-foreground">
                        Pantau performa dan traffic berita Anda secara real-time.
                    </p>
                </div>

                {/* ── Stat Cards ────────────────────────────────────── */}
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
                                    {/* decorative gradient blob */}
                                    <div className={`pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full opacity-10 blur-2xl ${stat.bg}`} />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* ── Chart + Sources ───────────────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-3">

                    {/* Traffic Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold">Traffic Mingguan</CardTitle>
                                    <CardDescription className="text-xs">7 hari terakhir — Pageviews vs Kunjungan</CardDescription>
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
                                    { label: 'Total Pageviews', value: formatNumber(weeklyTraffic.reduce((a, d) => a + d.pageviews, 0)) },
                                    { label: 'Total Kunjungan', value: formatNumber(weeklyTraffic.reduce((a, d) => a + d.visits, 0)) },
                                    { label: 'Rerata Harian', value: formatNumber(Math.round(weeklyTraffic.reduce((a, d) => a + d.pageviews, 0) / 7)) },
                                ].map((s) => (
                                    <div key={s.label} className="px-4 py-2">
                                        <p className="text-lg font-bold">{s.value}</p>
                                        <p className="text-xs text-muted-foreground">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Sumber Traffic</CardTitle>
                            <CardDescription className="text-xs">Distribusi berdasarkan perangkat</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">
                            {/* Stacked bar */}
                            <div className="flex h-3 w-full overflow-hidden rounded-full">
                                {trafficSources.map((s) => (
                                    <div
                                        key={s.name}
                                        className={`${s.color} transition-all`}
                                        style={{ width: `${s.percent}%` }}
                                        title={`${s.name}: ${s.percent}%`}
                                    />
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-col gap-3">
                                {trafficSources.map((s) => {
                                    const SrcIcon = s.icon;
                                    return (
                                        <div key={s.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className={`inline-flex size-7 items-center justify-center rounded-md ${s.color} bg-opacity-15`}>
                                                    <SrcIcon className="size-4 text-foreground/70" />
                                                </span>
                                                <span className="text-sm font-medium">{s.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold">{s.percent}%</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-center">
                                <Globe className="mx-auto mb-1 size-5 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">97.2K</span> pengunjung unik bulan ini
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Recent Articles + Top Articles ────────────────── */}
                <div className="grid gap-4 lg:grid-cols-3">

                    {/* Recent Articles Table */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold">Artikel Terbaru</CardTitle>
                                    <CardDescription className="text-xs">Daftar artikel yang baru dipublikasikan</CardDescription>
                                </div>
                                <a
                                    href="/news"
                                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    Lihat semua <ArrowUpRight className="size-3" />
                                </a>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Judul</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentArticles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell className="pl-6">
                                                <div>
                                                    <p className="max-w-[260px] truncate text-sm font-medium">{article.title}</p>
                                                    <p className="text-xs text-muted-foreground">{article.date}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">
                                                    {article.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-semibold">
                                                {formatNumber(article.views)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={statusVariant(article.status)} className="capitalize">
                                                    {article.status === 'published' ? 'Tayang' : article.status === 'draft' ? 'Draft' : 'Arsip'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Top Articles */}
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
