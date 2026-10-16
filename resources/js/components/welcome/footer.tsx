import React from 'react';
import { Link } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { login, dashboard } from '@/routes';

interface FooterProps {
    user: unknown;
}

export function Footer({ user }: FooterProps) {
    return (
        <footer className="border-t border-gray-200 bg-gray-800 dark:bg-gray-950 dark:border-gray-800">
            <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-baseline gap-0.5 mb-1">
                            <span className="font-black text-2xl text-red-500 tracking-tight">Kreasi</span>
                            <span className="font-black text-2xl text-white tracking-tight">Baraya</span>
                            <span className="font-black text-2xl text-white tracking-tight">Mandiri</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">PT. Kreasi Baraya Mandiri adalah sebuah perusahaan yang bergerak di bidang media yang menaungi website portal berita barayanews.co.id untuk menayangkan berita terkini dan terpercaya.</p>
                    </div>
                    {/* Kategori */}
                   
                    {/* Tentang / Perusahaan */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">Perusahaan</h4>
                        <ul className="space-y-1.5">
                            {[
                                { title: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
                                { title: 'Redaksi', href: '/redaksi' },
                                { title: 'Pedoman Media Siber', href: '/pedoman-media-siber' },
                                { title: 'Kontak', href: '/kontak' },
                                { title: 'Syarat Karya Tulis', href: '/syarat-karya-tulis' },
                            ].map((item) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-gray-500">© 2026 Baraya News. All rights reserved.</p>
                    <p className="text-[10px] text-gray-500">Portal Berita Terkini Jawa Barat</p>
                </div>
            </div>
        </footer>
    );
}
