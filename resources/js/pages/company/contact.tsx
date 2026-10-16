import React, { useState } from 'react';
import { CompanyLayout, ArticleSidebarItem } from './company-layout';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

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
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Redaksi',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;
        setFormSubmitted(true);
    };

    return (
        <CompanyLayout
            title="Kontak & Kantor"
            subtitle="Hubungi tim redaksi, layanan kemitraan iklan, atau kunjungi kantor Baraya News."
            activeSlug="contact"
            lastUpdated="16 Oktober 2026"
            beritaTerpopuler={beritaTerpopuler}
            beritaTerbaru={beritaTerbaru}
            trendingItems={trendingItems}
        >
            <div className="space-y-8 text-sm">
                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Alamat */}
                    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 p-5 flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-red-600 text-white shrink-0">
                            <MapPin className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Kantor Redaksi</h3>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Gedung Baraya Mandiri, Lt. 3<br />
                                Jl. Asia Afrika No. 128, Braga, Sumur Bandung<br />
                                Kota Bandung, Jawa Barat 40112
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 p-5 flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-red-600 text-white shrink-0">
                            <Mail className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Email Resmi</h3>
                            <div className="mt-1 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                <div>Redaksi: <a href="mailto:redaksi@barayanews.co.id" className="text-red-600 hover:underline font-medium">redaksi@barayanews.co.id</a></div>
                                <div>Iklan & Bisnis: <a href="mailto:iklan@barayanews.co.id" className="text-red-600 hover:underline font-medium">iklan@barayanews.co.id</a></div>
                            </div>
                        </div>
                    </div>

                    {/* Telepon / Hotline */}
                    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 p-5 flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-red-600 text-white shrink-0">
                            <Phone className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Hotline & WhatsApp</h3>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Telp: (022) 8765-4321<br />
                                WhatsApp Redaksi: +62 812-3456-7890
                            </p>
                        </div>
                    </div>

                    {/* Jam Operasional */}
                    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 p-5 flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-red-600 text-white shrink-0">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Jam Operasional</h3>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Peliputan Berita: 24 Jam Nonstop<br />
                                Layanan Bisnis & Kantor: Senin – Jumat (09.00 – 17.00 WIB)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Kirim Pesan */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-7">
                    <div className="flex items-center gap-2 mb-2 font-bold text-base text-gray-900 dark:text-white">
                        <MessageSquare className="size-5 text-red-600" />
                        <h2>Kirim Pesan ke Redaksi</h2>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                        Punya saran liputan, informasi penting, atau pertanyaan kerjasama? Tuliskan pesan Anda di bawah ini:
                    </p>

                    {formSubmitted ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30 p-6 text-center space-y-2">
                            <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                            <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                                Pesan Anda Berhasil Dikirim!
                            </h3>
                            <p className="text-xs text-emerald-800/80 dark:text-emerald-400/90 max-w-md mx-auto">
                                Terima kasih telah menghubungi Baraya News. Tim kami akan meninjau pesan Anda dan segera membalas ke email yang Anda cantumkan.
                            </p>
                            <button
                                onClick={() => {
                                    setFormSubmitted(false);
                                    setFormData({ name: '', email: '', subject: 'Redaksi', message: '' });
                                }}
                                className="mt-3 inline-flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-300 underline hover:no-underline cursor-pointer"
                            >
                                Kirim pesan lainnya
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="contact-name" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Nama Lengkap <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        required
                                        placeholder="Nama Anda"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="contact-email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Alamat Email <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        required
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="contact-subject" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Kategori Pesan
                                </label>
                                <select
                                    id="contact-subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                >
                                    <option value="Redaksi">Redaksi / Liputan Berita</option>
                                    <option value="Kerjasama">Kerjasama Media / Liputan Khusus</option>
                                    <option value="Iklan">Pemasangan Iklan & Advertorial</option>
                                    <option value="Pengaduan">Pengaduan Konten / Hak Jawab</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="contact-message" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Pesan Anda <span className="text-red-600">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    required
                                    rows={4}
                                    placeholder="Tuliskan pesan atau informasi Anda dengan jelas..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                            >
                                <Send className="size-3.5" />
                                <span>Kirim Pesan</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </CompanyLayout>
    );
}
