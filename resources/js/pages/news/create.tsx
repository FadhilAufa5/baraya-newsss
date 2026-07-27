import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    ArrowLeft,
    Upload,
    X,
    Tag,
    Star,
    Eye,
    Save,
    Send,
    Globe,
    FileText,
    Image as ImageIcon,
    Info,
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
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import RichTextEditor from '@/components/ui/rich-text-editor';

interface Props {
    categories: string[];
}

export default function CreateNews({ categories }: Props) {
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const overrideStatusRef = useRef<'draft' | 'published' | 'archived'>(
        'draft',
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
        meta_description: string;
        tags: string[];
        status: 'draft' | 'published' | 'archived';
        is_featured: boolean;
        published_at: string;
    }>({
        title: '',
        slug: '',
        category: '',
        author: '',
        excerpt: '',
        content: '',
        image: null,
        image_caption: '',
        meta_description: '',
        tags: [],
        status: 'draft',
        is_featured: false,
        published_at: '',
    });

    // Transform is called right before the request is sent — safe to read ref here.
    transform((d) => {
        const result: Record<string, unknown> = { ...d, status: overrideStatusRef.current };
        for (const key of Object.keys(result)) {
            if (result[key] === null || result[key] === '') delete result[key];
        }
        return result;
    });

    // Auto-generate slug from title
    const handleTitleChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug:
                prev.slug === '' || prev.slug === slugify(prev.title)
                    ? slugify(val)
                    : prev.slug,
        }));
    };

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

    // Image handling
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('image', file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    // Tag handling
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

    // Submit
    const submit = (submitStatus: 'draft' | 'published' | 'archived') => {
        overrideStatusRef.current = submitStatus;
        // use post with forceFormData for file upload
        post('/news', { forceFormData: true });
    };

    return (
        <>
            <Head title="Tulis Artikel Baru" />

            <div className="flex flex-col gap-6">
                {/* Header */}
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
                        <h1 className="text-xl font-bold">
                            Tulis Artikel Baru
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Buat dan publikasikan artikel berita
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ── LEFT COLUMN — Main Content ── */}
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        {/* Judul */}
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
                                        placeholder="Masukkan judul artikel yang menarik..."
                                        className="text-base font-medium"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="slug">
                                        Slug URL
                                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                                            (auto-generated)
                                        </span>
                                    </Label>
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
                                            placeholder="artikel-slug-url"
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
                                                <SelectValue placeholder="Pilih kategori..." />
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
                                    <Label htmlFor="excerpt">
                                        Ringkasan
                                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                                            (maks 500 karakter)
                                        </span>
                                    </Label>
                                    <Textarea
                                        id="excerpt"
                                        rows={3}
                                        value={data.excerpt}
                                        onChange={(e) =>
                                            setData('excerpt', e.target.value)
                                        }
                                        placeholder="Tulis ringkasan singkat artikel yang tampil di halaman daftar berita..."
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
                                            className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                                        >
                                            <X className="size-4" />
                                        </button>
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
                                                Klik untuk upload gambar
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
                                    placeholder="Tulis isi berita lengkap di sini..."
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
                                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                                            (maks 160 karakter)
                                        </span>
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
                                        placeholder="Deskripsi singkat untuk mesin pencari..."
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

                                {/* Tags */}
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
                                                        className="ml-0.5 rounded-sm hover:text-destructive"
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

                    {/* ── RIGHT COLUMN — Publish Settings ── */}
                    <div className="flex flex-col gap-4">
                        {/* Publish Panel */}
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
                                    <p className="text-xs text-muted-foreground">
                                        Kosongkan untuk auto-set saat tayang
                                    </p>
                                </div>

                                {/* Featured toggle */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'is_featured',
                                            !data.is_featured,
                                        )
                                    }
                                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                                        data.is_featured
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
                                            Tampil di posisi hero halaman utama
                                        </p>
                                    </div>
                                </button>

                                <Separator />

                                {/* Preview info */}
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
                                            {data.image ? '✓ Diunggah' : '—'}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                {/* Submit buttons */}
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
                                        Terbitkan Sekarang
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
                                        {data.status === 'published'
                                            ? 'Simpan'
                                            : data.status === 'archived'
                                              ? 'Simpan Arsip'
                                              : 'Simpan Draft'}
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

CreateNews.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Berita', href: '/news' },
        { title: 'Tulis Artikel', href: '/news/create' },
    ],
};
