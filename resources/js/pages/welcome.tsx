import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Header } from '@/components/welcome/header';
import { TrendingTicker } from '@/components/welcome/trending-ticker';
import { AdBanner } from '@/components/welcome/ad-banner';
import { HeroSection } from '@/components/welcome/hero-section';
import { NewsSections } from '@/components/welcome/news-sections';
import { Footer } from '@/components/welcome/footer';

// ─── Static demo data ──────────────────────────────────────────────────────────

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

const TRENDING_ITEMS = [
    'Ridwan Kamil Resmikan Gedung Inovasi Digital Jawa Barat',
    'Persib Bandung Menang Tipis Atas Arena FC di Stadion GBLA',
    'Inflasi Mei 2024 Terkendali di Angka 2.8 Persen',
];

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;
    const [activeCategory, setActiveCategory] = useState('Home');
    const [searchQuery, setSearchQuery] = useState('');
    const [trendingIndex, setTrendingIndex] = useState(0);

    return (
        <>
            <Head title="Baraya News - Portal Berita Terkini Jawa Barat" />

            {/* TOP HEADER */}
            <Header
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* TRENDING TICKER */}
            <TrendingTicker
                trendingItems={TRENDING_ITEMS}
                trendingIndex={trendingIndex}
                setTrendingIndex={setTrendingIndex}
            />

            {/* MAIN CONTENT */}
            <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 space-y-8">

                    {/* Leaderboard Ad */}
                    <AdBanner
                        type="leaderboard"
                        sponsorName="Kawah Putih Ciwidey"
                        title="Liburan Seru ke Kawah Putih Ciwidey - Tiket Masuk Diskon 20%!"
                        description="Nikmati eksotisme danau kawah vulkanik Ciwidey yang menakjubkan dengan udara pegunungan yang sejuk. Berlaku khusus untuk pemesanan online minggu ini."
                        ctaText="Dapatkan Tiket"
                        ctaUrl="https://kawahputihciwidey.com"
                    />

                    {/* HERO SECTION */}
                    <HeroSection
                        heroArticle={HERO_ARTICLE}
                        sideArticles={SIDE_ARTICLES}
                    />

                    {/* In-feed Ad */}
                    <AdBanner
                        type="in-feed"
                        sponsorName="Persib Store Official"
                        title="Jersey Persib Bandung 2026 Edisi Spesial Juara Liga!"
                        description="Dapatkan jersey resmi terbaru Persib Bandung dengan diskon 15% khusus pembaca Baraya News. Gunakan kode: PERS18JABAR."
                        ctaText="Miliki Sekarang"
                        ctaUrl="https://persibstore.id"
                    />

                    {/* ROW 2: Berita Terbaru | Pilihan Redaksi | Populer */}
                    <NewsSections
                        beritaTerbaru={BERITA_TERBARU}
                        pilihanRedaksi={PILIHAN_REDAKSI}
                        videoStories={VIDEO_STORIES}
                        beritaTerpopuler={BERITA_TERPOPULER}
                    />
                </div>
            </main>

            {/* FOOTER */}
            <Footer user={auth.user} />
        </>
    );
}
