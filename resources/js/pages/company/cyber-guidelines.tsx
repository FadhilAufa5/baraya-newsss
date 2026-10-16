import React from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import { Scale, HelpCircle } from 'lucide-react';

interface Props {
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
}

const GUIDELINES = [
    {
        num: '1',
        title: 'Ruang Lingkup',
        content:
            'Media Siber adalah segala bentuk media yang menggunakan wahana internet dan melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan Undang-Undang Pers dan Standar Perusahaan Pers yang ditetapkan Dewan Pers. Isi Buatan Pengguna (User Generated Content) adalah segala isi yang dibuat dan atau dipublikasikan oleh pengguna media siber.',
    },
    {
        num: '2',
        title: 'Verifikasi dan Keberimbangan Berita',
        content:
            'Pada prinsipnya setiap berita harus melalui verifikasi. Berita yang dapat merugikan pihak lain memerlukan verifikasi pada berita yang sama untuk memenuhi prinsip akurasi dan keberimbangan. Dalam hal berita mendesak yang belum lengkap verifikasinya, media wajib mencantumkan keterangan bahwa berita masih dalam proses verifikasi dan akan dilengkapi secepatnya.',
    },
    {
        num: '3',
        title: 'Isi Buatan Pengguna (User Generated Content)',
        content:
            'Media siber wajib mencantumkan syarat dan ketentuan mengenai Isi Buatan Pengguna yang tidak bertentangan dengan UU Pers dan Kode Etik Jurnalistik. Komentar pengguna dilarang memuat isi bohong, fitnah, sadis, cabul, prasangka dan kebencian terkait SARA, serta diskriminasi jenis kelamin atau kaum rentan. Media berhak menyunting atau menghapus isi buatan pengguna yang melanggar ketentuan.',
    },
    {
        num: '4',
        title: 'Ralat, Koreksi, dan Hak Jawab',
        content:
            'Ralat, koreksi, dan hak jawab mengacu pada UU Pers, Kode Etik Jurnalistik, dan Pedoman Hak Jawab yang ditetapkan Dewan Pers. Ralat, koreksi dan atau hak jawab wajib ditautkan pada berita yang diralat, dikoreksi atau yang diberi hak jawab, dengan mencantumkan waktu pemuatan ralat atau hak jawab tersebut.',
    },
    {
        num: '5',
        title: 'Pencabutan Berita',
        content:
            'Berita yang sudah dipublikasikan tidak dapat dicabut karena alasan penyensoran dari pihak luar redaksi, kecuali terkait masalah SARA, kesusilaan, masa depan anak, pengalaman traumatik korban atau berdasarkan pertimbangan khusus lain yang ditetapkan Dewan Pers. Pencabutan berita wajib disertai dengan alasan pencabutan dan diumumkan kepada publik.',
    },
    {
        num: '6',
        title: 'Praktik Iklan dan Komersial',
        content:
            'Media siber wajib membedakan dengan tegas antara produk berita dan iklan. Setiap artikel, berita, atau konten yang merupakan iklan, sponsor, atau berbayar wajib mencantumkan keterangan jelas seperti "Advertorial", "Iklan", atau "Sponsored" sehingga tidak menyesatkan pembaca.',
    },
    {
        num: '7',
        title: 'Hak Cipta',
        content:
            'Media siber wajib menghormati hak cipta sebagaimana diatur dalam peraturan perundang-undangan yang berlaku. Pengutipan berita atau materi dari media lain wajib mencantumkan sumber secara jelas dan menyertakan tautan aktif ke sumber asli.',
    },
];

export default function CyberGuidelinesPage({
    beritaTerpopuler = [],
    beritaTerbaru = [],
    trendingItems = [],
}: Props) {
    return (
        <CompanyLayout
            title="Pedoman Pemberitaan Media Siber"
            subtitle="Standar operasional jurnalistik digital Baraya News sesuai keputusan Dewan Pers."
            activeSlug="cyber-guidelines"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-sm">
                {/* Intro notice */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/20 p-4 sm:p-5 flex items-start gap-3.5">
                    <Scale className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                            Keputusan Dewan Pers Indonesia
                        </h3>
                        <p className="mt-1 text-xs text-blue-800/90 dark:text-blue-300/80 leading-relaxed">
                            Pedoman ini disahkan oleh Dewan Pers bersama Komunitas Pers di Jakarta pada 3 Februari 2012 dan menjadi pedoman utama seluruh jurnalis dan redaksi Baraya News (PT. Kreasi Baraya Mandiri) dalam memproduksi berita digital.
                        </p>
                    </div>
                </div>

                {/* Guidelines list */}
                <div className="space-y-4">
                    {GUIDELINES.map((item) => (
                        <div
                            key={item.num}
                            className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4 sm:p-5 transition-all hover:bg-white dark:hover:bg-gray-800/60"
                        >
                            <div className="flex items-center gap-2.5 mb-2">
                                <span className="flex size-6 items-center justify-center rounded-full bg-red-600 text-white text-xs font-black">
                                    {item.num}
                                </span>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm pl-8">
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right of reply note */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 dark:text-white">
                        <HelpCircle className="size-4 text-red-600" />
                        <h4>Pengajuan Hak Jawab & Koreksi</h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Masyarakat, narasumber, atau pihak yang merasa dirugikan oleh pemberitaan Baraya News berhak mengajukan Hak Jawab dan Hak Koreksi secara tertulis melalui email: <a href="mailto:redaksi@barayanews.co.id" className="text-red-600 font-semibold hover:underline">redaksi@barayanews.co.id</a> dengan subjek "HAK JAWAB - [Judul Berita]".
                    </p>
                </div>
            </div>
        </CompanyLayout>
    );
}
