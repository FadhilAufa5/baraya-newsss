import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, Send, Upload, Video, X } from 'lucide-react';
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

    transform((formData) => ({ ...formData, status: overrideStatusRef.current }));

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

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
                        <Link href="/short-videos">
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Link>
                    </Button>
                    <Separator orientation="vertical" className="h-5" />
                    <div>
                        <h1 className="text-xl font-bold">Upload Short Video</h1>
                        <p className="text-sm text-muted-foreground">Video pendek dikelola terpisah dari berita.</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Video className="size-4 text-muted-foreground" />
                                    File Video
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {videoPreview ? (
                                    <div className="relative overflow-hidden rounded-xl border bg-black">
                                        <video src={videoPreview} controls className="max-h-[520px] w-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => videoRef.current?.click()}
                                        className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                                    >
                                        <Upload className="size-9 opacity-60" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Klik untuk upload short video</p>
                                            <p className="text-xs">MP4, WebM, MOV - maks 50MB</p>
                                        </div>
                                    </button>
                                )}
                                <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoChange} />
                                {videoPreview && (
                                    <Button type="button" variant="outline" size="sm" onClick={() => videoRef.current?.click()} className="gap-2">
                                        <Upload className="size-4" />
                                        Ganti Video
                                    </Button>
                                )}
                                <InputError message={errors.video} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <ImageIcon className="size-4 text-muted-foreground" />
                                    Thumbnail
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {thumbnailPreview ? (
                                    <div className="relative overflow-hidden rounded-xl border">
                                        <img src={thumbnailPreview} alt="Preview thumbnail" className="h-56 w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => thumbnailRef.current?.click()}
                                        className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                                    >
                                        <Upload className="size-8 opacity-60" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Upload thumbnail opsional</p>
                                            <p className="text-xs">JPG, PNG, WebP - maks 4MB</p>
                                        </div>
                                    </button>
                                )}
                                <input ref={thumbnailRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden" onChange={handleThumbnailChange} />
                                <InputError message={errors.thumbnail} />
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-fit lg:sticky lg:top-4">
                        <CardHeader>
                            <CardTitle className="text-sm">Detail Publikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="title">Judul <span className="text-destructive">*</span></Label>
                                <Input id="title" value={data.title} onChange={(event) => setData('title', event.target.value)} placeholder="Judul short video..." />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    maxLength={1000}
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    placeholder="Deskripsi singkat video..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setData('status', value)}>
                                    <SelectTrigger>
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
                                <Label htmlFor="published_at">Tanggal Terbit</Label>
                                <Input id="published_at" type="datetime-local" value={data.published_at} onChange={(event) => setData('published_at', event.target.value)} />
                                <p className="text-xs text-muted-foreground">Kosongkan untuk otomatis saat status tayang.</p>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <Button type="button" className="w-full gap-2 bg-red-600 hover:bg-red-700" disabled={processing} onClick={() => submit('published')}>
                                    {processing ? <Spinner /> : <Send className="size-4" />}
                                    Upload & Tayang
                                </Button>
                                <Button type="button" variant="outline" className="w-full" disabled={processing} onClick={() => submit(data.status)}>
                                    Simpan
                                </Button>
                                <Button asChild variant="ghost" className="w-full text-muted-foreground">
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
