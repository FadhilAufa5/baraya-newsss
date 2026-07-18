import React from 'react';
import { Link } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { login, register, dashboard } from '@/routes';

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
                            <span className="font-black text-2xl text-red-500 tracking-tight">baraya</span>
                            <span className="font-black text-2xl text-white tracking-tight">news</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">Portal berita terkini, terpercaya, dan terlengkap dari Jawa Barat untuk Indonesia.</p>
                    </div>
                    {/* Kategori */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">Kategori</h4>
                        <ul className="space-y-1.5">
                            {['Jawa Barat', 'Nasional', 'Ekonomi', 'Olahraga', 'Teknologi'].map((c) => (
                                <li key={c}><button className="text-xs text-gray-400 hover:text-red-400 transition-colors">{c}</button></li>
                            ))}
                        </ul>
                    </div>
                    {/* Tentang */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">Perusahaan</h4>
                        <ul className="space-y-1.5">
                            {['Tentang Kami', 'Redaksi', 'Pedoman Media Siber', 'Karir', 'Hubungi Kami'].map((c) => (
                                <li key={c}><button className="text-xs text-gray-400 hover:text-red-400 transition-colors">{c}</button></li>
                            ))}
                        </ul>
                    </div>
                    {/* CTA */}
                    {/* <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">Bergabung</h4>
                        <p className="text-xs text-gray-400 mb-4">Jadilah bagian dari komunitas Baraya News.</p>
                        {user ? (
                            <Link href={dashboard()} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
                                <LayoutGrid className="size-4" /> Dashboard
                            </Link>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link href={register()} className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
                                    Daftar Gratis
                                </Link>
                                <Link href={login()} className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-300 hover:border-gray-400 hover:text-white transition-colors">
                                    Masuk
                                </Link>
                            </div>
                        )}
                    </div> */}
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-gray-500">© 2026 Baraya News. All rights reserved.</p>
                    <p className="text-[10px] text-gray-500">Portal Berita Terkini Jawa Barat</p>
                </div>
            </div>
        </footer>
    );
}
