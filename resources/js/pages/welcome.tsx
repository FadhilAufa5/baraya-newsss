import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronRight,
    Clock,
    Eye,
    Flame,
    LayoutGrid,
    Newspaper,
    Play,
    Radio,
    Search,
    Tag,
    TrendingUp,
    User,
    Video,
} from 'lucide-react';
import { useState } from 'react';
import { login } from '@/routes';
import { register } from '@/routes';
import { dashboard } from '@/routes';

// ─── Static demo data ──────────────────────────────────────────────────────────

const CATEGORIES = ['Home', 'Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga', 'Teknologi', 'Lifestyle', 'Otomotif', 'Video Story', 'Indeks'];

const HERO_ARTICLE = {
    id: 1,
    category: 'Jawa Barat',
    title: 'Ridwan Kamil Resmikan Gedung Inovasi Digital Jawa Barat',
    excerpt: 'Gubernur Jawa Barat meresmikan gedung pusat inovasi digital terbesar di Asia Tenggara yang akan menjadi motor penggerak transformasi digital di wilayah Jawa Barat.',
    author: 'Redaksi Baraya News',
    published_at: '28 Mei 2024 • 12:45 WIB',
    views: 24800,
    reading_time: 4,
    image: null,
    slug: 'ridwan-kamil-resmikan-gedung-inovasi-digital',
};

const SIDE_ARTICLES = [
    { id: 2, category: 'Nasional', title: 'Jokowi Resmikan Jalan Tol Getaci Diketuk, Target Selesai 2025', published_at: '28 Mei 2024', image: null },
    { id: 3, category: 'Ekonomi', title: 'Inflasi Mei 2024 Terkendali di Angka 2.8 Persen', published_at: '28 Mei 2024', image: null },
    { id: 4, category: 'Olahraga', title: 'Persib Bandung Menang Tipis Atas Arena FC di Stadion GBLA', published_at: '28 Mei 2024', image: null },
    { id: 5, category: 'Teknologi', title: 'Teknologi AI Terbaru yang Wajib Diketahui 2024', published_at: '28 Mei 2024', image: null },
];

const VIDEO_STORIES = [
    { id: 1, title: 'Ridwan Kamil Tinjau Lokasi Masjid Al Jabbar', duration: '0:45', time_ago: '1 jam yang lalu' },
    { id: 2, title: 'Suasana Car Free Day Dago Bandung', duration: '1:02', time_ago: '3 jam yang lalu' },
    { id: 3, title: 'Progres Tol Padaleunyi - Cisuny', duration: '0:56', time_ago: '5 jam yang lalu' },
    { id: 4, title: 'Persib Latihan Jelang Lawan Bali United', duration: '0:38', time_ago: '7 jam yang lalu' },
];

const BERITA_TERBARU = [
    { id: 1, category: 'Nasional', title: 'KCIC Catat 18 Ribu Penumpang Whoosh pada Libur Panjang Waisak 2024', excerpt: 'PT KCIC mencatatkan peningkatan jumlah penumpang sebesar 30% selama masa libur panjang Waisak 2024.', published_at: '28 Mei 2024 • 11:20 WIB', image: null },
    { id: 2, category: 'Ekonomi', title: 'Rupiah Menguat terhadap Dolar AS, Sentuh Rp15.900', excerpt: 'Nilai tukar rupiah menguat terhadap dolar AS seiring sentimen pasar modal dalam negeri yang membaik.', published_at: '28 Mei 2024 • 10:45 WIB', image: null },
    { id: 3, category: 'Jawa Barat', title: 'Pemkot Bandung Luncurkan Program Beasiswa 1000 Mahasiswa', excerpt: 'Pemerintah Kota Bandung akan memberikan beasiswa penuh kepada 1000 mahasiswa berprestasi dari keluarga kurang mampu.', published_at: '28 Mei 2024 • 09:15 WIB', image: null },
];

const PILIHAN_REDAKSI = {
    id: 10,
    category: 'Wisata',
    title: 'Pesona Kawah Putih Ciwidey yang Selalu Memikat Wisatawan',
    excerpt: 'Kawah Putih di Ciwidey Bandung terus menjadi destinasi wisata favorit dengan pemandangan danau berwarna putih kehijauan yang memukau.',
    author: 'Tim Redaksi',
    published_at: '28 Mei 2024 • 08:15 WIB',
    image: null,
    slug: 'pesona-kawah-putih-ciwidey',
};

const BERITA_TERPOPULER = [
    { id: 1, title: 'Ridwan Kamil Resmikan Gedung Inovasi Digital Jawa Barat', published_at: '28 Mei 2024' },
    { id: 2, title: 'Jalan Tol Getaci Diketuk, Target Selesai 2025', published_at: '28 Mei 2024' },
    { id: 3, title: 'Persib Bandung Menang Tipis Atas Arena FC di Stadion GBLA', published_at: '28 Mei 2024' },
    { id: 4, title: 'Harga Cabai di Jawa Barat Kembali Naik', published_at: '28 Mei 2024' },
    { id: 5, title: 'Kota Bogor Raih Penghargaan Kota Terbersih', published_at: '28 Mei 2024' },
];

const CAT_COLORS: Record<string, string> = {
    'Nasional':   'bg-red-600',
    'Ekonomi':    'bg-emerald-600',
    'Olahraga':   'bg-blue-600',
    'Teknologi':  'bg-violet-600',
    'Jawa Barat': 'bg-amber-600',
    'Wisata':     'bg-teal-600',
    'Lifestyle':  'bg-pink-600',
    'Otomotif':   'bg-orange-600',
};

function CategoryBadge({ category, size = 'sm' }: { category: string; size?: 'sm' | 'xs' }) {
    const color = CAT_COLORS[category] ?? 'bg-slate-600';
    return (
        <span className={`inline-block ${color} text-white font-bold uppercase tracking-wide rounded px-2 py-0.5 ${size === 'xs' ? 'text-[9px]' : 'text-[10px]'}`}>
            {category}
        </span>
    );
}

function GradientPlaceholder({ category, className = '' }: { category: string; className?: string }) {
    const gradients: Record<string, string> = {
        'Nasional':   'from-red-600 to-red-900',
        'Ekonomi':    'from-emerald-600 to-emerald-900',
        'Olahraga':   'from-blue-600 to-blue-900',
        'Teknologi':  'from-violet-600 to-violet-900',
        'Jawa Barat': 'from-amber-500 to-amber-800',
        'Wisata':     'from-teal-500 to-teal-800',
        'default':    'from-slate-600 to-slate-900',
    };
    const g = gradients[category] ?? gradients['default'];
    return (
        <div className={`bg-gradient-to-br ${g} flex items-center justify-center ${className}`}>
            <Newspaper className="size-8 text-white/30" />
        </div>
    );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;
    const [activeCategory, setActiveCategory] = useState('Home');
    const [searchQuery, setSearchQuery] = useState('');
    const [trendingIndex, setTrendingIndex] = useState(0);

    const trendingItems = [
        'Ridwan Kamil Resmikan Gedung Inovasi Digital Jawa Barat',
        'Persib Bandung Menang Tipis Atas Arena FC di Stadion GBLA',
        'Inflasi Mei 2024 Terkendali di Angka 2.8 Persen',
    ];

    return (
        <>
            <Head title="Baraya News - Portal Berita Terkini Jawa Barat" />

            {/* ──────────────────────────────────────────────────────────── */}
            {/* TOP HEADER                                                  */}
            {/* ──────────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-950">
                {/* Top bar */}
                <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <div className="flex items-baseline gap-0.5 leading-none">
                            <span className="font-black text-2xl text-red-600 tracking-tight">baraya</span>
                            <span className="font-black text-2xl text-gray-800 tracking-tight dark:text-white">news</span>
                        </div>
                        <div className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">Portal Berita Terkini Jawa Barat</div>
                    </Link>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-md relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berita, topik atau lokasi..."
                            className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                            <Search className="size-4" />
                        </button>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="hidden sm:flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                            <Radio className="size-3.5 text-red-500 animate-pulse" /> Live TV
                        </button>
                        <button className="hidden sm:flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 transition-colors">
                            <Video className="size-3.5" /> Video
                        </button>
                        <button className="relative size-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200">
                            <Bell className="size-4" />
                            <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">3</span>
                        </button>

                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="flex items-center gap-2 rounded-full border border-gray-200 pl-2 pr-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 transition-colors"
                            >
                                <span className="flex size-7 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">A</span>
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={login()}
                                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <User className="size-3.5" /> Masuk
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Navbar */}
                <nav className="border-t border-gray-100 bg-gray-800 dark:bg-gray-900">
                    <div className="mx-auto max-w-[1280px] overflow-x-auto px-4 sm:px-6">
                        <ul className="flex items-center whitespace-nowrap">
                            {CATEGORIES.map((cat) => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setActiveCategory(cat)}
                                        className={`relative px-3 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                                            activeCategory === cat
                                                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* TRENDING TICKER                                             */}
            {/* ──────────────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800">
                <div className="mx-auto max-w-[1280px] flex items-center gap-3 px-4 py-2 sm:px-6">
                    <span className="shrink-0 rounded bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1">
                        <Flame className="size-3" /> Trending
                    </span>
                    <div className="overflow-hidden flex-1">
                        <button
                            onClick={() => setTrendingIndex((i) => (i + 1) % trendingItems.length)}
                            className="text-sm text-gray-700 hover:text-red-600 dark:text-gray-300 font-medium truncate text-left w-full transition-colors"
                        >
                            {trendingItems[trendingIndex]}
                        </button>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                        {trendingItems.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setTrendingIndex(i)}
                                className={`size-1.5 rounded-full transition-colors ${i === trendingIndex ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* MAIN CONTENT                                                */}
            {/* ──────────────────────────────────────────────────────────── */}
            <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 space-y-8">

                    {/* ── HERO SECTION ─────────────────────────────────────── */}
                    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* Hero Article */}
                        <div className="lg:col-span-2 group relative overflow-hidden rounded-xl shadow-md cursor-pointer">
                            <div className="aspect-video w-full">
                                <GradientPlaceholder category={HERO_ARTICLE.category} className="w-full h-full" />
                            </div>
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                <CategoryBadge category={HERO_ARTICLE.category} />
                                <h2 className="mt-2 text-2xl font-extrabold leading-tight text-white group-hover:text-red-200 transition-colors sm:text-3xl line-clamp-3">
                                    {HERO_ARTICLE.title}
                                </h2>
                                <p className="mt-2 text-sm text-gray-300 line-clamp-2 hidden sm:block">
                                    {HERO_ARTICLE.excerpt}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Clock className="size-3" />{HERO_ARTICLE.published_at}</span>
                                    <span className="flex items-center gap-1"><Eye className="size-3" />{HERO_ARTICLE.views.toLocaleString('id-ID')} views</span>
                                    <span className="flex items-center gap-1"><Clock className="size-3" />{HERO_ARTICLE.reading_time} mnt baca</span>
                                </div>
                            </div>
                        </div>

                        {/* Side Articles */}
                        <div className="flex flex-col gap-3">
                            {SIDE_ARTICLES.map((art) => (
                                <div key={art.id} className="group flex gap-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="w-24 shrink-0 sm:w-28">
                                        <GradientPlaceholder category={art.category} className="w-full h-full min-h-[80px]" />
                                    </div>
                                    <div className="flex flex-col justify-center py-3 pr-3 gap-1.5">
                                        <CategoryBadge category={art.category} size="xs" />
                                        <h3 className="text-sm font-bold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 transition-colors">
                                            {art.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="size-2.5" />{art.published_at}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── ROW 2: Berita Terbaru | Pilihan Redaksi | Populer ─── */}
                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px_260px]">

                        {/* Berita Terbaru */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-1 rounded bg-red-600" />
                                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100">Berita Terbaru</h2>
                                </div>
                                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                    {['Semua', 'Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga', 'Lainnya'].map((tab) => (
                                        <button
                                            key={tab}
                                            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-colors ${tab === 'Semua' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {BERITA_TERBARU.map((art) => (
                                    <div key={art.id} className="group flex gap-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="w-28 shrink-0 sm:w-32">
                                            <GradientPlaceholder category={art.category} className="w-full h-full min-h-[90px]" />
                                        </div>
                                        <div className="flex flex-col justify-center py-3 pr-3 gap-1.5">
                                            <CategoryBadge category={art.category} size="xs" />
                                            <h3 className="text-sm font-bold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 transition-colors">
                                                {art.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 hidden sm:block">{art.excerpt}</p>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="size-2.5" />{art.published_at}</span>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-500 hover:border-red-400 hover:text-red-600 dark:border-gray-600 dark:text-gray-400 transition-colors flex items-center justify-center gap-2">
                                    Lihat Semua Berita <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Pilihan Redaksi */}
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="h-5 w-1 rounded bg-red-600" />
                                <h2 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100">Pilihan Redaksi</h2>
                            </div>

                            <div className="group cursor-pointer rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative aspect-video w-full">
                                    <GradientPlaceholder category={PILIHAN_REDAKSI.category} className="w-full h-full" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/40 transition-transform group-hover:scale-110">
                                            <Play className="size-6 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-white">0:58</div>
                                </div>
                                <div className="p-4">
                                    <CategoryBadge category={PILIHAN_REDAKSI.category} />
                                    <h3 className="mt-2 text-base font-bold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
                                        {PILIHAN_REDAKSI.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{PILIHAN_REDAKSI.excerpt}</p>
                                    <div className="mt-3 flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock className="size-2.5" />{PILIHAN_REDAKSI.published_at}
                                    </div>
                                </div>
                            </div>

                            {/* Video Story mini */}
                            <div className="mt-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-1 rounded bg-blue-600" />
                                        <h3 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100">Video Story</h3>
                                    </div>
                                    <button className="text-[10px] font-semibold text-red-600 hover:underline flex items-center gap-0.5">Lihat Semua <ChevronRight className="size-3" /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {VIDEO_STORIES.map((v) => (
                                        <div key={v.id} className="group cursor-pointer rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 relative aspect-video">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="flex size-7 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40">
                                                    <Play className="size-3.5 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-1 left-1 right-1">
                                                <p className="text-[9px] font-semibold text-white line-clamp-2 leading-tight">{v.title}</p>
                                                <span className="text-[8px] text-gray-300">{v.time_ago}</span>
                                            </div>
                                            <div className="absolute top-1 right-1 rounded bg-black/60 px-1 py-px text-[8px] font-bold text-white">{v.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Berita Terpopuler */}
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="h-5 w-1 rounded bg-orange-500" />
                                <h2 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                                    <TrendingUp className="size-4 text-orange-500" /> Berita Terpopuler
                                </h2>
                            </div>

                            <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                                {BERITA_TERPOPULER.map((art, idx) => (
                                    <div key={art.id} className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
                                        <span className={`shrink-0 text-3xl font-black leading-none ${idx === 0 ? 'text-red-600' : idx === 1 ? 'text-orange-400' : idx === 2 ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 transition-colors">
                                                {art.title}
                                            </h3>
                                            <span className="mt-1 text-[10px] text-gray-400 flex items-center gap-1"><Clock className="size-2.5" />{art.published_at}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Stats Box */}
                            <div className="mt-5 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-4 text-white shadow-md">
                                <div className="flex items-center gap-2 mb-3">
                                    <LayoutGrid className="size-4" />
                                    <span className="text-xs font-black uppercase tracking-wide">Statistik Portal</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Total Berita', value: '12.8K' },
                                        { label: 'Kategori', value: '10' },
                                        { label: 'Pembaca/Hari', value: '48K' },
                                        { label: 'Kontributor', value: '35' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="rounded-lg bg-white/10 p-2.5 text-center">
                                            <div className="text-lg font-black">{stat.value}</div>
                                            <div className="text-[9px] text-red-200 uppercase tracking-wide">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-5">
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="h-5 w-1 rounded bg-gray-400" />
                                    <h3 className="text-sm font-black uppercase tracking-wide text-gray-800 dark:text-gray-100 flex items-center gap-1.5"><Tag className="size-3.5" />Topik Populer</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Ridwan Kamil', 'Pemilu 2024', 'Persib', 'Bandung', 'Ekonomi', 'KCIC Whoosh', 'Kawah Putih', 'Inflasi', 'Tol Getaci'].map((tag) => (
                                        <button key={tag} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600 hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 transition-colors">
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* FOOTER                                                      */}
            {/* ──────────────────────────────────────────────────────────── */}
            <footer className="border-t border-gray-200 bg-gray-800 dark:bg-gray-950 dark:border-gray-800">
                <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Brand */}
                        <div>
                            <div className="flex items-baseline gap-0.5 mb-1">
                                <span className="font-black text-2xl text-red-500 tracking-tight">baraya</span>
                                <span className="font-black text-2xl text-white tracking-tight">news</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">Portal berita terkini, terpercaya, dan terlengkap dari Jawa Barat untuk Indonesia.</p>
                        </div>
                        {/* Kategori */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">Kategori</h4>
                            <ul className="space-y-1.5">
                                {['Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga', 'Teknologi'].map((c) => (
                                    <li key={c}><button className="text-xs text-gray-400 hover:text-red-400 transition-colors">{c}</button></li>
                                ))}
                            </ul>
                        </div>
                        {/* Tentang */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">Perusahaan</h4>
                            <ul className="space-y-1.5">
                                {['Tentang Kami', 'Redaksi', 'Pedoman Media Siber', 'Karir', 'Hubungi Kami'].map((c) => (
                                    <li key={c}><button className="text-xs text-gray-400 hover:text-red-400 transition-colors">{c}</button></li>
                                ))}
                            </ul>
                        </div>
                        {/* CTA */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">Bergabung</h4>
                            <p className="text-xs text-gray-400 mb-4">Jadilah bagian dari komunitas Baraya News.</p>
                            {auth.user ? (
                                <Link href={dashboard()} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
                                    <LayoutGrid className="size-4" /> Dashboard
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link href={register()} className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
                                        Daftar Gratis
                                    </Link>
                                    <Link href={login()} className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-300 hover:border-gray-400 hover:text-white transition-colors">
                                        Masuk
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-[10px] text-gray-500">© 2024 Baraya News. All rights reserved.</p>
                        <p className="text-[10px] text-gray-500">Portal Berita Terkini Jawa Barat</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
