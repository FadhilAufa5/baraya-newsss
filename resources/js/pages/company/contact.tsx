import React, { useState } from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CheckCircle2,
    MessageSquare,
    Copy,
    Check,
    ExternalLink,
} from 'lucide-react';

interface Props {
    beritaTerpopuler?: ArticleSidebarItem[];
    beritaTerbaru?: ArticleSidebarItem[];
    trendingItems?: string[];
}

export default function ContactPage({
    beritaTerpopuler = [],
    beritaTerbaru = [],
    trendingItems = [],
}: Props) {
    const [copied, setCopied] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Redaksi',
        message: '',
    });

    const fullAddress = 'Jl. Dr. Semeru, Gang Kelor No. 26 RT 2/10, Kel. Menteng, Kec. Bogor Barat, 16111';

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(fullAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;
        setFormSubmitted(true);
    };

    return (
        <CompanyLayout
            title="Kontak"
            subtitle="Informasi resmi kontak redaksi, iklan, dan kantor PT. Kreasi Baraya Mandiri."
            activeSlug="contact"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-sm">
                {/* ── LOGO (DI LUAR CARD) ─────────────────────────────────── */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <img
                        src="/logobaraya.png"
                        alt="Logo Baraya News"
                        className="h-10 sm:h-12 w-auto object-contain"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Portal Berita Jawa Barat
                    </span>
                </div>

                {/* ── KARTU KONTAK (SIMPLE & CLEAN) ────────────────────────── */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-7 shadow-xs">
                    {/* Header Kartu */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
                        <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                            Penerbit & Kantor Redaksi
                        </span>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                            PT. Kreasi Baraya Mandiri
                        </h2>
                    </div>

                    {/* Informasi Alamat & Kontak */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Alamat */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <MapPin className="size-3.5 text-red-600" />
                                <span>Alamat</span>
                            </div>
                            <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                <p>Jl. Dr. Semeru, Gang Kelor No. 26 RT 2/10</p>
                                <p>Kel. Menteng, Kec. Bogor Barat</p>
                                <p className="font-semibold text-gray-900 dark:text-white mt-1">
                                    16111
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-2 text-xs">
                                <button
                                    onClick={handleCopyAddress}
                                    className="inline-flex items-center gap-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="size-3 text-emerald-600" />
                                            <span className="text-emerald-600 font-medium">Tersalin</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3" />
                                            <span>Salin Alamat</span>
                                        </>
                                    )}
                                </button>
                                <span>•</span>
                                <a
                                    href="https://maps.google.com/?q=Jl.+Dr.+Semeru+Gang+Kelor+No.+26+Bogor+Barat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline font-medium"
                                >
                                    <span>Google Maps</span>
                                    <ExternalLink className="size-3" />
                                </a>
                            </div>
                        </div>

                        {/* Kontak */}
                        <div className="space-y-3.5 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6">
                            <div>
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                    Redaksi & Informasi Iklan
                                </span>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="size-3.5 text-red-600 shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-400 text-xs">Telepon/WA:</span>
                                    <a
                                        href="https://wa.me/6281299264494"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400"
                                    >
                                        081299264494
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-start gap-2">
                                    <Mail className="size-3.5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400 mr-1.5">Redaksi:</span>
                                        <a
                                            href="mailto:barayanewsbogor@gmail.com"
                                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            barayanewsbogor@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Mail className="size-3.5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400 mr-1.5">Iklan:</span>
                                        <a
                                            href="mailto:kreasibarayamandiri.pt@gmail.com"
                                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            kreasibarayamandiri.pt@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FORMULIR PESAN ──────────────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm text-gray-900 dark:text-white">
                        <MessageSquare className="size-4 text-red-600" />
                        <h2>Kirim Pesan</h2>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                        Tinggalkan pesan, informasi liputan, atau penawaran kerjasama:
                    </p>

                    {formSubmitted ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-5 text-center space-y-1.5">
                            <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
                            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                Pesan Terkirim
                            </h3>
                            <p className="text-xs text-emerald-800/80 dark:text-emerald-400/90">
                                Terima kasih, pesan Anda telah diterima dan akan segera direspons oleh tim kami.
                            </p>
                            <button
                                onClick={() => {
                                    setFormSubmitted(false);
                                    setFormData({ name: '', email: '', subject: 'Redaksi', message: '' });
                                }}
                                className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 underline cursor-pointer"
                            >
                                Kirim pesan lain
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        placeholder="Nama Anda"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="email@anda.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="subject" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Tujuan
                                </label>
                                <select
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                                >
                                    <option value="Redaksi">Redaksi (barayanewsbogor@gmail.com)</option>
                                    <option value="Iklan">Informasi Iklan (kreasibarayamandiri.pt@gmail.com)</option>
                                    <option value="Kerjasama">Kerjasama</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="message" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Pesan
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={3}
                                    placeholder="Tuliskan pesan Anda..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                <Send className="size-3.5" />
                                <span>Kirim</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </CompanyLayout>
    );
}
