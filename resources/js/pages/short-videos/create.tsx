import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Film, ImageIcon, Send, Upload, Video, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

export default function CreateShortVideo() {
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const videoRef = useRef<HTMLInputElement>(null);
    const thumbnailRef = useRef<HTMLInputElement>(null);
    const overrideStatusRef = useRef<'draft' | 'published' | 'archived'>('draft');

    const { data, setData, post, processing, errors, transform } = useForm<{
        title: string;
        description: string;
        video: File | null;
        thumbnail: File | null;
        status: 'draft' | 'published' | 'archived';
        published_at: string;
    }>({
        title: '',
        description: '',
        video: null,
        thumbnail: null,
        status: 'draft',
        published_at: '',
    });

    transform((formData) => {
        const result: Record<string, unknown> = { ...formData, status: overrideStatusRef.current };
        for (const key of Object.keys(result)) {
            if (result[key] === null || result[key] === '') delete result[key];
        }
        return result;
    });

    const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setData('video', file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const removeVideo = () => {
        setData('video', null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        if (videoRef.current) videoRef.current.value = '';
    };

    const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        setData('thumbnail', file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const removeThumbnail = () => {
        setData('thumbnail', null);
        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
        if (thumbnailRef.current) thumbnailRef.current.value = '';
    };

    const submit = (status: 'draft' | 'published' | 'archived') => {
        overrideStatusRef.current = status;
        post('/short-videos', { forceFormData: true });
    };

    return (
        <>
            <Head title="Upload Short Video" />

            <div className="flex flex-col gap-6 p-4">
                {/* ── Header Banner ───────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-red-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 left-20 size-40 rounded-full bg-blue-500/10 blur-2xl" />

                    <div className="relative flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="size-10 shrink-0 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 hover:bg-white/20 text-white">
                            <Link href="/short-videos">
                                <ArrowLeft className="size-5" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <Film className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Upload Short Video</h1>
                                <p className="text-sm text-slate-400">Video pendek dikelola terpisah dari berita.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Grid ───────────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: Upload Areas */}
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        {/* Video Upload */}
                        <Card className="overflow-hidden">
                            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                                        <Video className="size-4" />
                                    </div>
                                    File Video
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                {videoPreview ? (
                                    <div className="relative overflow-hidden rounded-2xl border bg-black shadow-inner">
                                        <video src={videoPreview} controls className="max-h-[520px] w-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors shadow-lg"
                                        >
                                            <X className="size-4" />
                                        </button>
                                        <div className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white">
                                            Video Preview
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => videoRef.current?.click()}
                                        className="flex h-72 w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/10 text-muted-foreground transition-all hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:text-foreground group"
                                    >
                                        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                                            <Upload className="size-8 opacity-60 group-hover:opacity-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-all" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold">Klik untuk upload short video</p>
                                            <p className="text-xs mt-1">MP4, WebM, MOV — maks 50MB</p>
                                        </div>
                                    </button>
                                )}
                                <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoChange} />
                                {videoPreview && (
                                    <Button type="button" variant="outline" size="sm" onClick={() => videoRef.current?.click()} className="gap-2 rounded-xl">
                                        <Upload className="size-4" />
                                        Ganti Video
                                    </Button>
                                )}
                                <InputError message={errors.video} />
                            </CardContent>
                        </Card>

                        {/* Thumbnail Upload */}
                        <Card className="overflow-hidden">
                            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <ImageIcon className="size-4" />
                                    </div>
                                    Thumbnail
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                {thumbnailPreview ? (
                                    <div className="relative overflow-hidden rounded-2xl border shadow-inner">
                                        <img src={thumbnailPreview} alt="Preview thumbnail" className="h-56 w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors shadow-lg"
                                        >
                                            <X className="size-4" />
                                        </button>
                                        <div className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white">
                                            Thumbnail Preview
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => thumbnailRef.current?.click()}
                                        className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/10 text-muted-foreground transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:text-foreground group"
                                    >
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                            <Upload className="size-7 opacity-60 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold">Upload thumbnail opsional</p>
                                            <p className="text-xs mt-1">JPG, PNG, WebP — maks 4MB</p>
                                        </div>
                                    </button>
                                )}
                                <input ref={thumbnailRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden" onChange={handleThumbnailChange} />
                                <InputError message={errors.thumbnail} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Publish Settings */}
                    <Card className="h-fit lg:sticky lg:top-4 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <Send className="size-4" />
                                </div>
                                Detail Publikasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="title" className="text-xs font-bold">Judul <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    placeholder="Judul short video..."
                                    className="rounded-xl"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="description" className="text-xs font-bold">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    maxLength={1000}
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    placeholder="Deskripsi singkat video..."
                                    className="rounded-xl resize-none"
                                />
                                <p className="text-[10px] text-muted-foreground text-right">{data.description.length}/1000</p>
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold">Status</Label>
                                <Select value={data.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setData('status', value)}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Tayang</SelectItem>
                                        <SelectItem value="archived">Arsip</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="published_at" className="text-xs font-bold">Tanggal Terbit</Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(event) => setData('published_at', event.target.value)}
                                    className="rounded-xl"
                                />
                                <p className="text-[10px] text-muted-foreground">Kosongkan untuk otomatis saat status tayang.</p>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2.5">
                                <Button
                                    type="button"
                                    className="w-full gap-2 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25"
                                    disabled={processing}
                                    onClick={() => submit('published')}
                                >
                                    {processing ? <Spinner /> : <Send className="size-4" />}
                                    Upload & Tayang
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full rounded-xl"
                                    disabled={processing}
                                    onClick={() => submit(data.status)}
                                >
                                    Simpan
                                </Button>
                                <Button asChild variant="ghost" className="w-full rounded-xl text-muted-foreground">
                                    <Link href="/short-videos">Batal</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

CreateShortVideo.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Short Video', href: '/short-videos' },
        { title: 'Upload', href: '/short-videos/create' },
    ],
};
