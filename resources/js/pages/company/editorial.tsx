import React from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import { Users, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

interface Props {
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
}

const EDITORIAL_MEMBERS = [
    {
        role: 'Direktur Utama',
        name: 'Banu Lesmana Bagaskara S.M',
    },
    {
        role: 'General Manager',
        name: 'Bayu Baskara S.E',
    },
    {
        role: 'Pimpinan Redaksi',
        name: 'Aprilda Dasa Pratiwi',
    },
    {
        role: 'Redaktur Pelaksana',
        name: 'Erik Prayoga',
    },
    {
        role: 'Reporter',
        name: 'Erik Prayoga, Meli Destianti, Faras Nabila',
    },
    {
        role: 'Fotografer',
        name: 'Dwi Desniar Afianti, Dias Darwati',
    },
    {
        role: 'Marketing / Periklanan',
        name: 'Nida Febrianti, Della Heryani',
    },
    {
        role: 'Riset dan Olah Data',
        name: 'Meli Destianti',
    },
];

export default function EditorialPage({
    beritaTerpopuler = [],
    beritaTerbaru = [],
    trendingItems = [],
}: Props) {
    return (
        <CompanyLayout
            title="Susunan Redaksi"
            subtitle="Struktur kepengurusan dan tim redaksi resmi portal berita Baraya News."
            activeSlug="editorial"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-sm text-gray-800 dark:text-gray-200">
                {/* ── HEADER & LOGO ──────────────────────────────────────── */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <img
                        src="/logobaraya.png"
                        alt="Logo Baraya News"
                        className="h-10 sm:h-12 w-auto object-contain"
                    />
                    <div className="text-right">
                        <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                            Penerbit
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            PT. KREASI BARAYA MANDIRI
                        </span>
                    </div>
                </div>

                {/* ── SUSUNAN REDAKSI (CLEAN & SIMPLE LIST) ───────────────── */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs">
                    <div className="bg-gray-50/80 dark:bg-gray-800/50 px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                        <Users className="size-4 text-red-600" />
                        <h2>Struktur Dewan & Tim Redaksi</h2>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {EDITORIAL_MEMBERS.map((item, idx) => (
                            <div
                                key={idx}
                                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                            >
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:w-1/3">
                                    {item.role}
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white sm:w-2/3 sm:text-right">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SEKRETARIAT REDAKSI & KERJASAMA ─────────────────────── */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-xs space-y-3.5">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        Sekretariat Redaksi & Kerjasama
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Untuk undangan peliputan redaksi, wawancara khusus dengan reporter, pengiriman press release, ataupun kerjasama pemberitaan dan publikasi, silahkan kirim surat melalui sekretariat redaksi kami:
                    </p>

                    <div className="space-y-2.5 pt-1 text-xs">
                        <div className="flex items-start gap-2.5">
                            <Phone className="size-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    SMS Center Iklan, Redaksi dan WhatsApp:
                                </span>{' '}
                                <a
                                    href="https://wa.me/6281311840357"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-gray-900 dark:text-white hover:text-red-600 font-mono"
                                >
                                    +62 813-1184-0357
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Mail className="size-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Email:
                                </span>{' '}
                                <a
                                    href="mailto:barayanewsbogor@gmail.com"
                                    className="font-medium text-red-600 dark:text-red-400 hover:underline"
                                >
                                    barayanewsbogor@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 pt-1">
                            <MapPin className="size-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <strong className="block text-gray-900 dark:text-white">
                                    Alamat Redaksi, Bisnis dan Tata Usaha:
                                </strong>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-0.5">
                                    <strong>PT. KREASI BARAYA MANDIRI</strong><br />
                                    Jl. Dr. Semeru, Gang Kelor No. 26, RT 2 RW 11, Menteng, Bogor Barat, Kota Bogor 16111
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PERHATIAN / HAK CIPTA ───────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850 p-5 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                        <AlertCircle className="size-4 text-red-600" />
                        <span>PERHATIAN</span>
                    </div>
                    <blockquote className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 border-red-500 pl-3">
                        &ldquo;Hak Cipta dilindungi Undang-undang. Dilarang mengutip sebagian atau seluruh isi pemberitaan barayanews.co.id tanpa izin dari penerbit. Pengutipan diperkenankan sepanjang hanya mencantumkan link judul dan lead berita dan tidak mengambil keseluruhan isi berita, serta diberikan link langsung ke berita dimaksud di alamat barayanews.co.id. Silahkan kontak kami untuk kepentingan redistribusi berita.&rdquo;
                    </blockquote>
                </div>
            </div>
        </CompanyLayout>
    );
}
