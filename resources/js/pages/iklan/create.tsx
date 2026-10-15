import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdFormContent from '@/components/iklan/ad-form-content';
import AdFormLink from '@/components/iklan/ad-form-link';
import AdFormSettings from '@/components/iklan/ad-form-settings';
import type { AdFormData } from '@/components/iklan/types';

export default function CreateAd() {
    const { data, setData, post, processing, errors } = useForm<AdFormData>({
        title: '',
        sponsor_name: '',
        description: '',
        cta_text: 'Kunjungi',
        cta_url: 'https://',
        type: 'leaderboard',
        position: 'top',
        is_active: true,
        sort_order: 0,
        starts_at: '',
        ends_at: '',
    });

    const handleChange = <K extends keyof AdFormData>(key: K, value: AdFormData[K]) => setData(key as any, value as any);
    const submit = () => post('/iklan');

    return (
        <>
            <Head title="Tambah Iklan" />

            <div className="flex flex-col gap-6 p-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-amber-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 left-20 size-40 rounded-full bg-orange-500/10 blur-2xl" />

                    <div className="relative flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="size-10 shrink-0 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 hover:bg-white/20 text-white">
                            <Link href="/iklan">
                                <ArrowLeft className="size-5" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <Megaphone className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Tambah Iklan Baru</h1>
                                <p className="text-sm text-slate-400">Buat iklan baru untuk ditampilkan di halaman beranda.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <AdFormContent data={data} errors={errors} onChange={handleChange} />
                        <AdFormLink data={data} errors={errors} onChange={handleChange} />
                    </div>

                    <AdFormSettings data={data} processing={processing} onChange={handleChange} onSubmit={submit} />
                </div>
            </div>
        </>
    );
}

CreateAd.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Iklan', href: '/iklan' },
        { title: 'Tambah', href: '/iklan/create' },
    ],
};
