import React from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import { ShieldCheck, Lock, Eye, Database, Globe, Bell } from 'lucide-react';

interface Props {
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
}

export default function PrivacyPage({
    beritaTerpopuler = [],
    beritaTerbaru = [],
    trendingItems = [],
}: Props) {
    return (
        <CompanyLayout
            title="Kebijakan Privasi"
            subtitle="Pedoman perlindungan data dan privasi pengguna di portal berita Baraya News."
            activeSlug="privacy"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {/* Highlight box */}
                <div className="rounded-xl border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/20 p-4 sm:p-5 flex items-start gap-3.5">
                    <ShieldCheck className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-red-900 dark:text-red-300 text-sm">
                            Komitmen Perlindungan Privasi Anda
                        </h3>
                        <p className="mt-1 text-xs text-red-800/80 dark:text-red-400/90 leading-relaxed">
                            PT. Kreasi Baraya Mandiri berkomitmen penuh melindungi dan menghormati hak privasi setiap pengunjung dan pembaca setia barayanews.co.id. Kebijakan ini menjelaskan bagaimana kami mengelola informasi yang Anda berikan.
                        </p>
                    </div>
                </div>

                {/* Section 1 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Database className="size-4 text-red-600" />
                        <h2>1. Informasi yang Kami Kumpulkan</h2>
                    </div>
                    <p>Kami dapat mengumpulkan informasi dari Anda dalam beberapa cara berikut:</p>
                    <ul className="list-disc list-inside space-y-1.5 ml-1 text-gray-600 dark:text-gray-400">
                        <li>
                            <strong className="text-gray-800 dark:text-gray-200">Data Penggunaan Otomatis:</strong> Alamat IP, jenis browser, perangkat, laman yang dikunjungi, serta waktu dan durasi akses untuk keperluan statistik dan peningkatan performa situs.
                        </li>
                        <li>
                            <strong className="text-gray-800 dark:text-gray-200">Data Komentar & Interaksi:</strong> Nama, alamat email, serta isi komentar atau tanggapan yang Anda kirimkan pada kolom komentar artikel atau video.
                        </li>
                        <li>
                            <strong className="text-gray-800 dark:text-gray-200">Data Formulir Kontak:</strong> Informasi yang Anda cantumkan ketika menghubungi redaksi atau tim bisnis kami melalui formulir kontak.
                        </li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Eye className="size-4 text-red-600" />
                        <h2>2. Penggunaan Informasi</h2>
                    </div>
                    <p>Informasi yang kami himpun digunakan semata-mata untuk:</p>
                    <ul className="list-disc list-inside space-y-1.5 ml-1 text-gray-600 dark:text-gray-400">
                        <li>Menyajikan konten berita, video, dan informasi aktual yang relevan dan berkualitas tinggi.</li>
                        <li>Memproses, memoderasi, dan menampilkan komentar publik secara sehat sesuai etika jurnalistik.</li>
                        <li>Mendeteksi, mencegah, dan menangani aktivitas mencurigakan atau potensi pelanggaran hukum.</li>
                        <li>Menganalisis performa artikel untuk menghadirkan pengalaman navigasi yang lebih cepat dan nyaman.</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Lock className="size-4 text-red-600" />
                        <h2>3. Cookies dan Teknologi Pelacakan</h2>
                    </div>
                    <p>
                        Situs web kami menggunakan <em>cookies</em> untuk menyimpan preferensi pengguna (seperti tema tampilan Gelap/Terang) serta mengumpulkan analitik anonim. Anda dapat mengatur browser Anda untuk menolak atau menghapus cookies kapan saja tanpa kehilangan akses ke sebagian besar konten berita.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Globe className="size-4 text-red-600" />
                        <h2>4. Kerahasiaan & Pihak Ketiga</h2>
                    </div>
                    <p>
                        PT. Kreasi Baraya Mandiri tidak akan pernah menjual, menyewakan, atau memperjualbelikan data pribadi pengguna kepada pihak ketiga mana pun. Kami hanya dapat membagikan informasi apabila diwajibkan oleh undang-undang atau perintah pengadilan yang sah di wilayah Republik Indonesia.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Bell className="size-4 text-red-600" />
                        <h2>5. Perubahan Kebijakan & Pertanyaan</h2>
                    </div>
                    <p>
                        Kebijakan Privasi ini dapat diperbarui sewaktu-waktu seiring perkembangan teknologi dan hukum yang berlaku. Jika Anda memiliki pertanyaan mengenai kebijakan privasi kami, silakan menghubungi kami melalui email di <a href="mailto:redaksi@barayanews.co.id" className="font-semibold text-red-600 hover:underline">redaksi@barayanews.co.id</a>.
                    </p>
                </section>
            </div>
        </CompanyLayout>
    );
}
