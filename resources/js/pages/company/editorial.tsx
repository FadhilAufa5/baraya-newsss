import React from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import { Users, Award, ShieldAlert, Building, MapPin } from 'lucide-react';

interface Props {
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
}

interface EditorialSection {
    category: string;
    members: { role: string; name: string }[];
}

const EDITORIAL_STRUCTURE: EditorialSection[] = [
    {
        category: 'Pimpinan & Manajemen',
        members: [
            { role: 'Penerbit', name: 'PT. Kreasi Baraya Mandiri' },
            { role: 'Komisaris Utama', name: 'H. Tatang Sutisna, S.E.' },
            { role: 'Direktur Utama', name: 'Asep Supriatna, M.I.Kom.' },
            { role: 'Direktur Bisnis & Operasional', name: 'Rahmat Hidayat, S.Sos.' },
        ],
    },
    {
        category: 'Dewan Redaksi',
        members: [
            { role: 'Pemimpin Umum / Penanggung Jawab', name: 'Asep Supriatna, M.I.Kom.' },
            { role: 'Pemimpin Redaksi', name: 'Fadhil Aufa, S.I.Kom.' },
            { role: 'Wakil Pemimpin Redaksi', name: 'Deden Ramdani, S.Hum.' },
            { role: 'Redaktur Pelaksana', name: 'Yudi Pratama' },
            { role: 'Anggota Dewan Redaksi', name: 'Dr. Hendra Gunawan, M.Si., Ir. Agus Setiawan' },
        ],
    },
    {
        category: 'Redaktur Bidang',
        members: [
            { role: 'Redaktur Nasional & Politik', name: 'Ridwan Kamil Hakim' },
            { role: 'Redaktur Ekonomi & Bisnis', name: 'Siti Nurhaliza, S.E.' },
            { role: 'Redaktur Jawa Barat & Budaya', name: 'Cecep Mulyana' },
            { role: 'Redaktur Olahraga & Hiburan', name: 'Ilham Maulana' },
            { role: 'Redaktur Teknologi & Otomotif', name: 'Budi Hartono' },
        ],
    },
    {
        category: 'Reporter & Kontributor Wilayah',
        members: [
            { role: 'Bandung Raya', name: 'Andi Firman, Maya Rosalina' },
            { role: 'Priangan Timur (Tasikmalaya, Garut, Ciamis)', name: 'Dede Sujana, Nani Suryani' },
            { role: 'Pantura & Cirebon', name: 'Riki Subagja, Arif Budiman' },
            { role: 'Bogor, Depok, Bekasi', name: 'Fikri Haikal' },
        ],
    },
    {
        category: 'Multimedia, Kreatif & Teknologi',
        members: [
            { role: 'Pengembang IT & Sistem', name: 'Tim Teknologi Baraya Mandiri' },
            { role: 'Editor Video & Kreatif Media', name: 'Angga Permana, Dwi Septian' },
            { role: 'Desain Grafis & Infografis', name: 'Reza Fauzi' },
        ],
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
            subtitle="Struktur pengurus, dewan redaksi, dan jurnalis profesional Baraya News."
            activeSlug="editorial"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-sm">
                {/* Warning notice */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20 p-4 sm:p-5 flex items-start gap-3.5">
                    <ShieldAlert className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                            Pemberitahuan Resmi Wartawan Baraya News
                        </h3>
                        <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                            Wartawan Baraya News selalu dibekali Kartu Pers (ID Card) yang masih berlaku serta tercantum dalam Box Redaksi ini saat menjalankan tugas jurnalistik. Wartawan kami dilarang meminta atau menerima imbalan dalam bentuk apa pun dari narasumber.
                        </p>
                    </div>
                </div>

                {/* Structure cards */}
                <div className="space-y-6">
                    {EDITORIAL_STRUCTURE.map((section, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
                        >
                            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-100/70 dark:bg-gray-800/60 flex items-center gap-2">
                                <Award className="size-4 text-red-600" />
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                    {section.category}
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800/60 p-2 sm:p-3">
                                {section.members.map((member, mIdx) => (
                                    <div
                                        key={mIdx}
                                        className="py-2.5 px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 hover:bg-white dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                                    >
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {member.role}
                                        </span>
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                            {member.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Office info footer */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-2.5">
                        <Building className="size-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-gray-800 dark:text-gray-200">Badan Hukum & Penerbit:</strong>
                            PT. Kreasi Baraya Mandiri (SK Kemenkumham RI)
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <MapPin className="size-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-gray-800 dark:text-gray-200">Kantor Redaksi:</strong>
                            Jl. Asia Afrika No. 128, Kota Bandung, Jawa Barat
                        </div>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
}
