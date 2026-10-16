import React from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import {
    ShieldCheck,
    Globe,
    MessageSquare,
    Image,
    Cookie,
    ExternalLink,
    Share2,
    Clock,
    UserCheck,
    Send,
} from 'lucide-react';

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
            subtitle="Pedoman pengelolaan dan perlindungan data pribadi pengunjung portal Baraya News."
            activeSlug="privacy"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {/* 1. Siapa kami */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Globe className="size-4 text-red-600" />
                        <h2>Siapa kami</h2>
                    </div>
                    <p>
                        Alamat situs web kami adalah:{' '}
                        <a
                            href="https://barayanews.co.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                        >
                            https://barayanews.co.id
                        </a>
                    </p>
                </section>

                {/* 2. Komentar */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <MessageSquare className="size-4 text-red-600" />
                        <h2>Komentar</h2>
                    </div>
                    <p>
                        Saat pengunjung meninggalkan komentar pada situs, kita mengumpulkan data yang ditampilkan pada form komentar, alamat IP pengunjung dan user agent browser untuk membantu pendeteksian spam.
                    </p>
                    <p>
                        String anonim yang dibuat dari alamat email Anda (juga disebut hash) dapat diberikan ke layanan Gravatar untuk melihat apakah Anda menggunakannya. Kebijakan privasi layanan Gravatar tersedia di sini:{' '}
                        <a
                            href="https://automattic.com/privacy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 dark:text-red-400 hover:underline font-medium inline-flex items-center gap-0.5"
                        >
                            https://automattic.com/privacy/ <ExternalLink className="size-3 inline" />
                        </a>
                        . Setelah persetujuan atas komentar Anda, gambar profil Anda dapat dilihat oleh publik dalam konteks komentar Anda.
                    </p>
                </section>

                {/* 3. Media */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Image className="size-4 text-red-600" />
                        <h2>Media</h2>
                    </div>
                    <p>
                        Jika Anda mengunggah gambar ke situs web, Anda harus menghindari mengunggah gambar dengan data lokasi tertanam (GPS EXIF) yang disertakan. Pengunjung ke situs web dapat mengunduh dan mengekstrak data lokasi apa pun dari gambar di situs web.
                    </p>
                </section>

                {/* 4. Cookies */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Cookie className="size-4 text-red-600" />
                        <h2>Cookies</h2>
                    </div>
                    <p>
                        Jika Anda meninggalkan komentar di situs kami, Anda dapat memilih untuk menyimpan nama, alamat email, dan situs web Anda dalam cookie. Ini untuk kenyamanan Anda sehingga Anda tidak perlu mengisi detail Anda lagi ketika Anda meninggalkan komentar lain. Cookie ini akan bertahan selama satu tahun.
                    </p>
                    <p>
                        Jika Anda mengunjungi laman login kami, kami akan memasang cookie sementara untuk memastikan apakah browser Anda menerima cookie. Cookie ini tidak mengandung data pribadi dan dibuang ketika Anda menutup browser Anda.
                    </p>
                    <p>
                        Saat Anda log masuk, kami akan menyiapkan beberapa cookie untuk menyimpan informasi log masuk Anda dan tampilan yang Anda pilih. Cookie log masuk berlaku selama dua hari, dan cookie pengaturan tampilan berlaku selama satu tahun. Jika Anda memilih “Ingatkan Saya”, log masuk anda akan bertahan selama dua minggu. Jika Anda log keluar dari akun, cookie log masuk akan dihapus.
                    </p>
                    <p>
                        Jika Anda menyunting atau menerbitkan artikel, cookie tambahan akan disimpan di browser Anda. Cookie ini tidak menyertakan data pribadi dan hanya menunjukkan ID posting dari artikel yang baru saja Anda sunting. Kadaluwarsa setelah 1 hari.
                    </p>
                </section>

                {/* 5. Konten yang disematkan dari situs web lain */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <ExternalLink className="size-4 text-red-600" />
                        <h2>Konten yang disematkan dari situs web lain</h2>
                    </div>
                    <p>
                        Artikel-artikel di dalam situs ini dapat menyertakan konten terembed (seperti video, gambar, artikel, dll). Konten terembed dari situs web lain akan berlaku sama dengan pengunjung yang mengunjungi situs web lain.
                    </p>
                    <p>
                        Situs-situs web ini dapat mengumpulkan data tentang Anda, menggunakan cookies, menanamkan pelacak dari pihak ketiga, dan memonitor interaksi Anda dengan muatan tertanam, termasuk menggunakannya untuk melacak interaksi Anda jika Anda memiliki sebuah akun dan masuk ke dalam situs web tersebut.
                    </p>
                </section>

                {/* 6. Dengan siapa kami membagi data Anda */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Share2 className="size-4 text-red-600" />
                        <h2>Dengan siapa kami membagi data Anda</h2>
                    </div>
                    <p>
                        Jika Anda meminta pengaturan ulang kata sandi, alamat IP Anda akan dimasukkan dalam email pengaturan ulang.
                    </p>
                </section>

                {/* 7. Berapa lama kami menyimpan data Anda */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Clock className="size-4 text-red-600" />
                        <h2>Berapa lama kami menyimpan data Anda</h2>
                    </div>
                    <p>
                        Jika Anda meninggalkan komentar, komentar dan metadatanya dipertahankan tanpa batas. Ini agar kami dapat mengenali dan menyetujui komentar tindak lanjut secara otomatis dan tidak menahannya dalam antrean moderasi.
                    </p>
                    <p>
                        Untuk pengguna yang mendaftar pada website kami (jika ada), kami juga menyimpan informasi pribadi yang mereka berikan dalam profil pengguna mereka. Semua pengguna dapat melihat, mengedit, atau menghapus informasi pribadi mereka kapan saja (kecuali mereka tidak dapat mengubah nama pengguna mereka). Administrator situs juga dapat melihat dan mengedit informasi tersebut.
                    </p>
                </section>

                {/* 8. Hak apa yang Anda miliki atas data Anda */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <UserCheck className="size-4 text-red-600" />
                        <h2>Hak apa yang Anda miliki atas data Anda</h2>
                    </div>
                    <p>
                        Jika anda mempunyai akun di situs ini, atau telah meninggalkan komentar, anda dapat meminta untuk mendapat data personal dalam file export dari kami, termasuk data yang anda berikan kepada kami. Anda juga dapat meminta kami menghapus data personal mengenai anda. Ini tidak termasuk data yang wajib kami simpan untuk keperluan administratif, hukum, atau keamanan.
                    </p>
                </section>

                {/* 9. Where your data is sent */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        <Send className="size-4 text-red-600" />
                        <h2>Where your data is sent</h2>
                    </div>
                    <p>
                        Komentar pengunjung dapat diperiksa melalui layanan deteksi spam otomatis.
                    </p>
                </section>
            </div>
        </CompanyLayout>
    );
}
