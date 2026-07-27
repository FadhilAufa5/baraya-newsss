import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Megaphone, Save, Send } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

interface Ad {
    id: number;
    title: string;
    sponsor_name: string | null;
    description: string | null;
    cta_text: string;
    cta_url: string;
    type: 'leaderboard' | 'in-feed' | 'rectangle';
    position: 'top' | 'middle' | 'sidebar';
    is_active: boolean;
    sort_order: number;
    starts_at: string | null;
    ends_at: string | null;
}

interface Props {
    ad: Ad;
}

function toLocalDateTime(value: string | null): string {
    if (!value) return '';
    const d = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditAd({ ad }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: ad.title,
        sponsor_name: ad.sponsor_name ?? '',
        description: ad.description ?? '',
        cta_text: ad.cta_text,
        cta_url: ad.cta_url,
        type: ad.type,
        position: ad.position,
        is_active: ad.is_active,
        sort_order: ad.sort_order,
        starts_at: toLocalDateTime(ad.starts_at),
        ends_at: toLocalDateTime(ad.ends_at),
    });

    const submit = () => {
        put(`/iklan/${ad.id}`);
    };

    return (
        <>
            <Head title="Edit Iklan" />

            <div className="flex flex-col gap-6 p-4">
                {/* ── Header ──────────────────────────────────────────────── */}
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
                                <h1 className="text-xl font-bold">Edit Iklan</h1>
                                <p className="text-sm text-slate-400">{ad.title}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Form Grid ───────────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: Content */}
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <Card className="overflow-hidden">
                            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                        <Megaphone className="size-4" />
                                    </div>
                                    Konten Iklan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="title" className="text-xs font-bold">Judul Iklan <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Judul iklan..."
                                        className="rounded-xl"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="sponsor_name" className="text-xs font-bold">Nama Sponsor</Label>
                                    <Input
                                        id="sponsor_name"
                                        value={data.sponsor_name}
                                        onChange={(e) => setData('sponsor_name', e.target.value)}
                                        placeholder="Nama perusahaan/brand..."
                                        className="rounded-xl"
                                    />
                                    <InputError message={errors.sponsor_name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="description" className="text-xs font-bold">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        rows={3}
                                        maxLength={500}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Deskripsi singkat iklan..."
                                        className="rounded-xl resize-none"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <ExternalLink className="size-4" />
                                    </div>
                                    Link & Tombol
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="cta_text" className="text-xs font-bold">Teks Tombol <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="cta_text"
                                        value={data.cta_text}
                                        onChange={(e) => setData('cta_text', e.target.value)}
                                        placeholder="Kunjungi, Beli Sekarang, dll..."
                                        className="rounded-xl"
                                    />
                                    <InputError message={errors.cta_text} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="cta_url" className="text-xs font-bold">URL Tujuan <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="cta_url"
                                        value={data.cta_url}
                                        onChange={(e) => setData('cta_url', e.target.value)}
                                        placeholder="https://..."
                                        className="rounded-xl"
                                    />
                                    <InputError message={errors.cta_url} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Settings */}
                    <Card className="h-fit lg:sticky lg:top-4 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <Save className="size-4" />
                                </div>
                                Pengaturan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-5">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold">Tipe Iklan <span className="text-destructive">*</span></Label>
                                <Select value={data.type} onValueChange={(v: 'leaderboard' | 'in-feed' | 'rectangle') => setData('type', v)}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="leaderboard">Leaderboard</SelectItem>
                                        <SelectItem value="in-feed">In-Feed</SelectItem>
                                        <SelectItem value="rectangle">Rectangle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold">Posisi <span className="text-destructive">*</span></Label>
                                <Select value={data.position} onValueChange={(v: 'top' | 'middle' | 'sidebar') => setData('position', v)}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="top">Atas</SelectItem>
                                        <SelectItem value="middle">Tengah</SelectItem>
                                        <SelectItem value="sidebar">Sidebar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="sort_order" className="text-xs font-bold">Urutan</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="rounded-xl"
                                />
                                <p className="text-[10px] text-muted-foreground">Semakin kecil, semakin atas.</p>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="starts_at" className="text-xs font-bold">Mulai Tayang</Label>
                                <Input
                                    id="starts_at"
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) => setData('starts_at', e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="ends_at" className="text-xs font-bold">Berakhir Tayang</Label>
                                <Input
                                    id="ends_at"
                                    type="datetime-local"
                                    value={data.ends_at}
                                    onChange={(e) => setData('ends_at', e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="size-4 rounded border-input accent-primary"
                                />
                                <Label htmlFor="is_active" className="text-xs font-bold cursor-pointer">Aktifkan iklan</Label>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2.5">
                                <Button
                                    type="button"
                                    className="w-full gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/25"
                                    disabled={processing}
                                    onClick={submit}
                                >
                                    {processing ? <Spinner /> : <Send className="size-4" />}
                                    Perbarui Iklan
                                </Button>
                                <Button asChild variant="ghost" className="w-full rounded-xl text-muted-foreground">
                                    <Link href="/iklan">Batal</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

EditAd.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Iklan', href: '/iklan' },
        { title: 'Edit', href: '#' },
    ],
};
