import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { imageUrl } from '@/lib/utils';
import {
    ArrowLeft,
    Film,
    Upload,
    X,
    Tag,
    Star,
    Save,
    Send,
    Globe,
    FileText,
    Image as ImageIcon,
    Info,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import RichTextEditor from '@/components/ui/rich-text-editor';

interface Article {
    id: number;
    title: string;
    slug: string;
    category: string;
    author: string | null;
    excerpt: string | null;
    content: string;
    image: string | null;
    image_caption: string | null;
    short_video: string | null;
    short_video_caption: string | null;
    meta_description: string | null;
    tags: string[] | null;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    published_at: string | null;
}

interface Props {
    article: Article;
    categories: string[];
}

function formatDatetimeLocal(s: string | null): string {
    if (!s) return '';
    const d = new Date(s);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditNews({ article, categories }: Props) {
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(
        imageUrl(article.image),
    );
    const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLInputElement>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(
        article.short_video ? `/storage/${article.short_video}` : null,
    );

    // Ref to hold the intended publish status at submit time,
    // because setData is async and cannot be relied on before post().
    const overrideStatusRef = useRef<'draft' | 'published' | 'archived'>(
        article.status,
    );

    const { data, setData, post, processing, errors, transform } = useForm<{
        title: string;
        slug: string;
        category: string;
        author: string;
        excerpt: string;
        content: string;
        image: File | null;
        image_caption: string;
        remove_image: boolean;
        short_video: File | null;
        short_video_caption: string;
        remove_short_video: boolean;
        meta_description: string;
        tags: string[];
        status: 'draft' | 'published' | 'archived';
        is_featured: boolean;
        published_at: string;
        _method: string;
    }>({
        title: article.title,
        slug: article.slug,
        category: article.category,
        author: article.author ?? '',
        excerpt: article.excerpt ?? '',
        content: article.content,
        image: null,
        image_caption: article.image_caption ?? '',
        remove_image: false,
        short_video: null,
        short_video_caption: article.short_video_caption ?? '',
        remove_short_video: false,
        meta_description: article.meta_description ?? '',
        tags: article.tags ?? [],
        status: article.status,
        is_featured: article.is_featured,
        published_at: formatDatetimeLocal(article.published_at),
        _method: 'PUT',
    });

    // Transform is called right before the request is sent — safe to read ref here.
    transform((d) => {
        const result: Record<string, unknown> = { ...d, status: overrideStatusRef.current };
        for (const key of Object.keys(result)) {
            if (result[key] === null || result[key] === '') delete result[key];
        }
        return result;
    });

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

    const handleTitleChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug: prev.slug === article.slug ? slugify(val) : prev.slug,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData((prev) => ({
            ...prev,
            image: file,
            remove_image: false,
        }));
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setData((prev) => ({
            ...prev,
            image: null,
            remove_image: true,
        }));
        setImagePreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData((prev) => ({
            ...prev,
            short_video: file,
            remove_short_video: false,
        }));
        if (videoPreview && videoPreview.startsWith('blob:')) URL.revokeObjectURL(videoPreview);
        setVideoPreview(URL.createObjectURL(file));
    };

    const removeSelectedVideo = () => {
        setData((prev) => ({
            ...prev,
            short_video: null,
            remove_short_video: false, // We're not removing the backend video, just the locally selected one
        }));
        if (videoPreview && videoPreview.startsWith('blob:')) URL.revokeObjectURL(videoPreview);
        setVideoPreview(article.short_video ? `/storage/${article.short_video}` : null);
        if (videoRef.current) videoRef.current.value = '';
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !data.tags.includes(tag) && data.tags.length < 10) {
            setData('tags', [...data.tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (t: string) =>
        setData(
            'tags',
            data.tags.filter((x) => x !== t),
        );

    const submit = (submitStatus: 'draft' | 'published' | 'archived') => {
        // Set the ref BEFORE calling post() so transform() picks it up synchronously.
        overrideStatusRef.current = submitStatus;
        post(`/news/${article.slug}`, { forceFormData: true });
    };

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/news/${article.slug}`, {
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <>
            <Head title={`Edit: ${article.title}`} />

            {/* Delete confirm */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Artikel</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus artikel{' '}
                            <strong>"{article.title}"</strong>? Tindakan ini
                            tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                            disabled={deleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Menghapus...' : 'Hapus Permanen'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-1.5 text-muted-foreground"
                        >
                            <Link href="/news">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Separator orientation="vertical" className="h-5" />
                        <div>
                            <h1 className="text-xl font-bold">Edit Artikel</h1>
                            <p className="line-clamp-1 max-w-sm text-xs text-muted-foreground">
                                {article.title}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-destructive/30 text-destructive hover:border-destructive hover:text-destructive"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="size-4" />
                        Hapus
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* LEFT — Content */}
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <FileText className="size-4 text-muted-foreground" />
                                    Informasi Artikel
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="title">
                                        Judul Artikel{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            handleTitleChange(e.target.value)
                                        }
                                        placeholder="Judul artikel..."
                                        className="text-base font-medium"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="slug">Slug URL</Label>
                                    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                                        <span className="shrink-0 text-muted-foreground">
                                            /news/
                                        </span>
                                        <input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData('slug', e.target.value)
                                            }
                                            className="flex-1 bg-transparent text-foreground outline-none"
                                        />
                                    </div>
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="category">
                                            Kategori{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(v) =>
                                                setData('category', v)
                                            }
                                        >
                                            <SelectTrigger id="category">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem
                                                        key={c}
                                                        value={c}
                                                    >
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="author">
                                            Nama Penulis
                                        </Label>
                                        <Input
                                            id="author"
                                            value={data.author}
                                            onChange={(e) =>
                                                setData(
                                                    'author',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama reporter / editor"
                                        />
                                        <InputError message={errors.author} />
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="excerpt">Ringkasan</Label>
                                    <Textarea
                                        id="excerpt"
                                        rows={3}
                                        value={data.excerpt}
                                        onChange={(e) =>
                                            setData('excerpt', e.target.value)
                                        }
                                        placeholder="Ringkasan singkat artikel..."
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between">
                                        <InputError message={errors.excerpt} />
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {data.excerpt.length}/500
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Gambar */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <ImageIcon className="size-4 text-muted-foreground" />
                                    Gambar Utama
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {imagePreview ? (
                                    <div className="relative overflow-hidden rounded-xl border">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-56 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                        >
                                            <X className="size-4" />
                                        </button>
                                        {article.image && !data.image && (
                                            <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                                                Gambar saat ini
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="flex h-44 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 hover:text-foreground"
                                    >
                                        <Upload className="size-8 opacity-50" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium">
                                                Klik untuk upload gambar baru
                                            </p>
                                            <p className="text-xs">
                                                JPG, PNG, WebP — maks 4MB
                                            </p>
                                        </div>
                                    </button>
                                )}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileRef.current?.click()}
                                        className="gap-2"
                                    >
                                        <Upload className="size-3.5" />
                                        Ganti Gambar
                                    </Button>
                                )}
                                <div className="grid gap-1.5">
                                    <Label htmlFor="image_caption">
                                        Keterangan Gambar
                                    </Label>
                                    <Input
                                        id="image_caption"
                                        value={data.image_caption}
                                        onChange={(e) =>
                                            setData(
                                                'image_caption',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Sumber / deskripsi gambar..."
                                    />
                                </div>
                                <InputError message={errors.image} />
                            </CardContent>
                        </Card>


                        {/* Konten */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <Globe className="size-4 text-muted-foreground" />
                                    Konten Artikel{' '}
                                    <span className="text-destructive">*</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RichTextEditor
                                    value={data.content}
                                    onChange={(v) => setData('content', v)}
                                    minHeight={360}
                                />
                                <InputError message={errors.content} />
                            </CardContent>
                        </Card>

                        {/* SEO */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <Info className="size-4 text-muted-foreground" />
                                    SEO & Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="meta_description">
                                        Meta Description
                                    </Label>
                                    <Textarea
                                        id="meta_description"
                                        rows={2}
                                        value={data.meta_description}
                                        onChange={(e) =>
                                            setData(
                                                'meta_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi untuk mesin pencari..."
                                        maxLength={160}
                                    />
                                    <div className="flex justify-between">
                                        <InputError
                                            message={errors.meta_description}
                                        />
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {data.meta_description.length}/160
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Tag Artikel</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                value={tagInput}
                                                onChange={(e) =>
                                                    setTagInput(e.target.value)
                                                }
                                                onKeyDown={(e) =>
                                                    e.key === 'Enter' &&
                                                    (e.preventDefault(),
                                                        addTag())
                                                }
                                                placeholder="Ketik tag lalu Enter..."
                                                className="pl-8"
                                                disabled={
                                                    data.tags.length >= 10
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addTag}
                                            disabled={
                                                !tagInput.trim() ||
                                                data.tags.length >= 10
                                            }
                                        >
                                            Tambah
                                        </Button>
                                    </div>
                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {data.tags.map((t) => (
                                                <Badge
                                                    key={t}
                                                    variant="secondary"
                                                    className="gap-1 pr-1"
                                                >
                                                    {t}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(t)
                                                        }
                                                        className="ml-0.5 hover:text-destructive"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT — Publish */}
                    <div className="flex flex-col gap-4">
                        <Card className="sticky top-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold">
                                    Pengaturan Publikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="grid gap-1.5">
                                    <Label>Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(
                                            v:
                                                | 'draft'
                                                | 'published'
                                                | 'archived',
                                        ) => setData('status', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">
                                                🗒️ Draft
                                            </SelectItem>
                                            <SelectItem value="published">
                                                ✅ Tayang
                                            </SelectItem>
                                            <SelectItem value="archived">
                                                📦 Arsip
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="published_at">
                                        Tanggal Terbit
                                    </Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) =>
                                            setData(
                                                'published_at',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'is_featured',
                                            !data.is_featured,
                                        )
                                    }
                                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${data.is_featured
                                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                                        : 'border-border hover:border-amber-300'
                                        }`}
                                >
                                    <Star
                                        className={`size-5 ${data.is_featured ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                                    />
                                    <div className="text-left">
                                        <p className="text-sm font-medium">
                                            Artikel Unggulan
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Tampil di posisi hero
                                        </p>
                                    </div>
                                </button>

                                <Separator />

                                <div className="space-y-1.5 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Kategori</span>
                                        <span className="font-medium text-foreground">
                                            {data.category || '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Penulis</span>
                                        <span className="font-medium text-foreground">
                                            {data.author || '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tags</span>
                                        <span className="font-medium text-foreground">
                                            {data.tags.length} tag
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Gambar</span>
                                        <span className="font-medium text-foreground">
                                            {imagePreview ? '✓' : '—'}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        className="w-full gap-2 bg-red-600 hover:bg-red-700"
                                        disabled={processing}
                                        onClick={() => submit('published')}
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <Send className="size-4" />
                                        )}
                                        Perbarui & Tayang
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2"
                                        disabled={processing}
                                        onClick={() => submit(data.status)}
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <Save className="size-4" />
                                        )}
                                        Simpan Perubahan
                                    </Button>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full text-muted-foreground"
                                    >
                                        <Link href="/news">Batal</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

EditNews.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Berita', href: '/news' },
        { title: 'Edit Artikel', href: '#' },
    ],
};
