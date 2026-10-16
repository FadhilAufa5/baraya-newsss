import React from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import { PenTool, CheckCircle2, FileText, Send, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
}

const CRITERIA = [
    {
        title: 'Orisinalitas & Bukan Plagiat',
        desc: 'Naskah merupakan karya asli penulis sendiri, belum pernah dipublikasikan di media cetak/online lain, dan tidak sedang dikirimkan ke media lain secara bersamaan.',
    },
    {
        title: 'Topik Aktual & Relevan',
        desc: 'Mengangkat isu-isu aktual seputar kebijakan publik, ekonomi, sosial budaya, pendidikan, lingkungan, atau teknologi yang menyangkut kepentingan masyarakat Jawa Barat dan Nasional.',
    },
    {
        title: 'Panjang Naskah Proporsional',
        desc: 'Panjang tulisan antara 600 hingga 1.200 kata. Ditulis dengan paragraf-paragraf yang mengalir dan mudah dipahami oleh pembaca umum.',
    },
    {
        title: 'Gaya Bahasa & Etika Jurnalistik',
        desc: 'Menggunakan kaidah Bahasa Indonesia yang baik, lugas, santun, tidak bernada menghasut, serta bebas dari unsur fitnah, hoaks, ujaran kebencian, dan SARA.',
    },
];

export default function WritingTermsPage({
    beritaTerpopuler = [],
    beritaTerbaru = [],
    trendingItems = [],
}: Props) {
    return (
        <CompanyLayout
            title="Syarat Karya Tulis"
            subtitle="Panduan dan ketentuan pengiriman artikel opini dan tulisan pembaca di Baraya News."
            activeSlug="writing-terms"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-sm">
                {/* Intro notice */}
                <div className="rounded-xl border border-red-200 bg-red-50/70 dark:border-red-900/50 dark:bg-red-950/20 p-4 sm:p-5 flex items-start gap-3.5">
                    <PenTool className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-red-900 dark:text-red-300 text-sm">
                            Ruang Opini & Gagasan Publik
                        </h3>
                        <p className="mt-1 text-xs text-red-800/90 dark:text-red-300/80 leading-relaxed">
                            Baraya News menyediakan ruang seluas-luasnya bagi akademisi, praktisi, mahasiswa, serta masyarakat umum untuk menyuarakan gagasan, analisis kritis, dan solusi terhadap berbagai isu di Jawa Barat dan Nusantara.
                        </p>
                    </div>
                </div>

                {/* Kriteria Tulisan */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Sparkles className="size-4 text-red-600" />
                        <h2>Kriteria Tulisan Opini</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CRITERIA.map((item, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4 space-y-1.5"
                            >
                                <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                    <span>{item.title}</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Kelengkapan Penulis */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <FileText className="size-4 text-red-600" />
                        <h2>Kelengkapan Berkas Penulis</h2>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Setiap naskah yang dikirimkan wajib melampirkan data diri berikut pada bagian akhir naskah:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-700 dark:text-gray-300 ml-1">
                        <li><strong>Biodata Singkat:</strong> 2–3 kalimat mencakup nama lengkap, profesi, instansi/komunitas, dan domisili.</li>
                        <li><strong>Kontak Aktif:</strong> Nomor WhatsApp dan akun media sosial yang dapat dihubungi.</li>
                        <li><strong>Foto Penulis:</strong> Lampirkan foto formal atau semi-formal resolusi tinggi (format JPG/PNG).</li>
                        <li><strong>Identitas Diri:</strong> Lampirkan foto/scan identitas (KTP/KTM/SIM) yang masih berlaku.</li>
                    </ul>
                </div>

                {/* Hak Redaksi */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <AlertCircle className="size-4 text-red-600" />
                        <h2>Ketentuan Penyuntingan & Hak Cipta</h2>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Redaksi Baraya News berhak menyunting judul, subjudul, dan tata bahasa naskah tanpa mengubah substansi pokok pikiran penulis. Hak cipta naskah tetap berada pada penulis, namun hak publikasi digital menjadi hak bersama antara penulis dan Baraya News.
                    </p>
                </div>

                {/* Cara Pengiriman */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-base text-gray-900 dark:text-white">
                        <Send className="size-4 text-red-600" />
                        <h2>Cara Pengiriman Naskah</h2>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Kirimkan naskah tulisan Anda dalam format Microsoft Word (.docx) atau Google Docs melalui email:
                    </p>
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-700 font-mono text-xs text-gray-800 dark:text-gray-200 space-y-1">
                        <div><strong>Kepada:</strong> <span className="text-red-600">opini@barayanews.co.id</span></div>
                        <div><strong>Subjek:</strong> [OPINI BARAYA] - Judul Tulisan - Nama Penulis</div>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        *Jika naskah tidak dimuat dalam waktu 5 (lima) hari kerja sejak pengiriman, penulis berhak mengirimkan naskah tersebut ke media lain.
                    </p>
                </div>
            </div>
        </CompanyLayout>
    );
}
