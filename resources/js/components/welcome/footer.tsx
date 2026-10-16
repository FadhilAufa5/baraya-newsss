import React from 'react';
import { Link } from '@inertiajs/react';
import { Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react';

interface FooterProps {
    user?: unknown;
}

const SOCIAL_LINKS = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/barayanews/',
        icon: Instagram,
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com/barayanews',
        icon: Twitter,
    },
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/barayanewsbogor',
        icon: Facebook,
    },
    {
        name: 'WhatsApp',
        href: 'https://wa.me/6281311840357',
        icon: MessageCircle,
    },
];

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
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">
                            PT. Kreasi Baraya Mandiri adalah sebuah perusahaan yang bergerak di bidang media yang menaungi website portal berita barayanews.co.id untuk menayangkan berita terkini dan terpercaya.
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-2">
                            {SOCIAL_LINKS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.name}
                                        className="size-8 rounded-lg bg-gray-700/60 dark:bg-gray-800 hover:bg-red-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                                    >
                                        <Icon className="size-4" />
                                    </a>
                                );
                            })}
                        </div>
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

                {/* Bottom Bar with Watermark */}
                <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-gray-500">© 2026 Baraya News. All rights reserved.</p>

                    {/* Watermark: Tersembunyi (warna sama dengan background), terlihat saat teks di-blok */}
                    <div className="select-text cursor-default">
                        <span className="text-gray-800 dark:text-gray-950 selection:bg-red-600 selection:text-white font-mono text-[10px] select-text">
                            by:xyzdto
                        </span>
                    </div>

                    <p className="text-[10px] text-gray-500">Portal Berita Terkini Jawa Barat</p>
                </div>
            </div>
        </footer>
    );
}
