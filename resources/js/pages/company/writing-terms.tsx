import React from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import {
    PenTool,
    CheckCircle2,
    FileText,
    Mail,
    Share2,
    AlertCircle,
    Instagram,
    Twitter,
    Facebook,
    ExternalLink,
} from 'lucide-react';

interface Props {
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
}

const GENERAL_TERMS = [
    'Asli, bukan plagiasi, bukan saduran, bukan terjemahan, bukan sekadar kompilasi, bukan rangkuman pendapat/buku orang lain.',
    'Belum pernah dimuat di media atau penerbitan lain termasuk Blog, dan juga tidak dikirim bersamaan ke media atau penerbitan lain.',
    'Topik yang diuraikan atau dibahas adalah sesuatu yang actual, relevan, dan menjadi persoalan dalam masyarakat.',
    'Artikel mengandung hal baru yang belum pernah dikemukakan penulis lain, baik informasinya, pandangan, pencerahan, pendekatan, saran, maupun solusinya.',
    'Uraiannya bisa membuka pemahaman atau pemaknaan baru maupun inspirasi atas suatu masalah atau fenomena.',
    'Penyajian tidak berkepanjangan, dan menggunakan bahasa populer/luwes yang mudah ditangkap oleh pembaca yang awam sekalipun. Panjang tulisan 3,5 halaman kuarto spasi ganda atau 700 kata atau 5000 karakter (dengan spasi) ditulis dengan program Words.',
    'Artikel tidak boleh ditulis berdua atau lebih.',
    'Menyertakan data diri/daftar riwayat hidup singkat (termasuk nomor telepon / HP), nama Bank dan nomor rekening.',
];

const RULES = [
    'Tulisan tidak boleh copas milik orang lain. Jika harus di tulis ulang (rewrite), sertakan sumber aslinya. Dan belum diterbitkan di media lain atau blog pribadi.',
    'Khusus resensi / review film, diusahakan film terbaru atau film mulai tahun 2019an.',
    'Hak cipta setiap karya tulis adalah milik kontributor dan bertanggung jawab atas tulisannya. BarayaNews.co.id hanya memiliki hak untuk menayangkan dan mengedit karya tersebut.',
    'Redaktur BarayaNews.co.id berhak menyunting tulisan dan menentukan apakah boleh ditayangkan atau tidak.',
    'Masa peninjauan oleh redaktur adalah paling cepat 1 Minggu setelah tulisan di-submit, bila tidak layak maka otomatis akan dihapus, dan bila tulisan kamu lolos maka akan ditayangkan sesuai jadwal + akan dipost juga di medsos Official, pastikan kamu sudah follow/like ya.',
    'Jika kamu adalah kontributor yang karyanya sudah dimuat disini, kamu tidak boleh menerbitkan ulang karyamu di tempat atau media lain.',
    'Dan jangan lupa SHARE tulisanmu di Medsos.',
];

const FORMAT_RULES = [
    'Panjang tulisan minimal 650 kata & maks 1500 kata (termasuk Cerpen) kecuali Puisi.',
    'Penulisan judul dengan menggunakan huruf kapital di awal kata.',
    'Perhatikan unsur 5W+1H dalam tulisan.',
    'Panjang setiap paragraf antara 3 sampai 5 baris dan berikan spasi setelah tanda baca (titik/koma).',
    'Opsional menyertakan foto/gambar sesuai tulisan minimal 1 buah.',
    'Jika foto/gambar mengambil milik orang lain, harap dicantumkan sumbernya (foto milik sendiri lebih bagus).',
    'Sebisa mungkin penulis melakukan penyuntingan dasar yakni dengan memperhatikan Pedoman Umum Ejaan Bahasa Indonesia, mulai dari tanda baca, besar-kecil huruf, penggunaan istilah asing dan lain sebagainya.',
];

export default function WritingTermsPage({
    beritaTerpopuler = [],
    beritaTerbaru = [],
    trendingItems = [],
}: Props) {
    return (
        <CompanyLayout
            title="Syarat Karya Tulis"
            subtitle="Panduan dan ketentuan pengiriman artikel opini, esai, dan karya tulis pembaca di BarayaNews.co.id."
            activeSlug="writing-terms"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {/* ── LOGO & HEADER ───────────────────────────────────────── */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <img
                        src="/logobaraya.png"
                        alt="Logo Baraya News"
                        className="h-10 sm:h-12 w-auto object-contain"
                    />
                    <div className="text-right">
                        <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                            Kanal Opini & Publikasi
                        </span>
                        <a
                            href="https://barayanews.co.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-red-600"
                        >
                            barayanews.co.id
                        </a>
                    </div>
                </div>

                {/* ── 1. SYARAT UMUM ──────────────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <PenTool className="size-4 text-red-600" />
                        <h2 className="font-bold text-base text-gray-900 dark:text-white">
                            Syarat Umum Yang Dimuat oleh BarayaNews.co.id
                        </h2>
                    </div>

                    <div className="space-y-2.5">
                        {GENERAL_TERMS.map((term, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                    {term}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Email Pengiriman & Pas Foto Note */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                            <Mail className="size-3.5 text-red-600" />
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Alamat e-mail pengiriman naskah:</span>
                            <a
                                href="mailto:barayanewsbogor@gmail.com"
                                className="font-bold text-red-600 dark:text-red-400 hover:underline"
                            >
                                barayanewsbogor@gmail.com
                            </a>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            Catatan: Untuk kelengkapan administrasi, bila mengirimkan tulisan mohon disertakan pas foto.
                        </p>
                    </div>
                </section>

                {/* ── 2. KETENTUAN ────────────────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <AlertCircle className="size-4 text-red-600" />
                        <h2 className="font-bold text-base text-gray-900 dark:text-white">
                            Ketentuan
                        </h2>
                    </div>

                    {/* Follow Medsos Banner */}
                    <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 p-4 space-y-2">
                        <span className="text-xs font-bold text-red-900 dark:text-red-300 block">
                            Wajib Follow & Like Media Sosial Resmi Baraya News:
                        </span>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <a
                                href="https://www.instagram.com/barayanews/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-400 hover:underline"
                            >
                                <Instagram className="size-3.5" />
                                <span>IG @barayanews</span>
                                <ExternalLink className="size-2.5" />
                            </a>
                            <span>•</span>
                            <a
                                href="https://twitter.com/barayanews"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-bold text-sky-500 hover:underline"
                            >
                                <Twitter className="size-3.5" />
                                <span>Twitter @barayanews</span>
                                <ExternalLink className="size-2.5" />
                            </a>
                            <span>•</span>
                            <a
                                href="https://www.facebook.com/barayanewsbogor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <Facebook className="size-3.5" />
                                <span>Fanspage Baraya News Bogor</span>
                                <ExternalLink className="size-2.5" />
                            </a>
                        </div>
                    </div>

                    <ul className="space-y-2.5 pl-4 border-l-2 border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {RULES.map((rule, idx) => (
                            <li key={idx}>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── 3. ATURAN FORMAT TULISAN ────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <FileText className="size-4 text-red-600" />
                        <h2 className="font-bold text-base text-gray-900 dark:text-white">
                            Aturan Format Tulisan
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2.5">
                        {FORMAT_RULES.map((format, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                                <span className="flex size-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[11px] font-bold shrink-0 mt-0.5">
                                    {idx + 1}
                                </span>
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    {format}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </CompanyLayout>
    );
}
