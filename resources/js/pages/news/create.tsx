import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import RichTextEditor from '@/components/ui/rich-text-editor';
import ArticleInfoCard from '@/components/news/article-info-card';
import ImageUploadCard from '@/components/news/image-upload-card';
import SeoMetaCard from '@/components/news/seo-meta-card';
import PublishPanel from '@/components/news/publish-panel';
import type { NewsFormData } from '@/components/news/types';

interface Props {
    categories: string[];
}

export default function CreateNews({ categories }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const overrideStatusRef = useRef<'draft' | 'published' | 'archived'>('draft');

    const { data, setData, post, processing, errors, transform } = useForm<NewsFormData>({
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

    transform((d) => {
        const result: Record<string, unknown> = { ...d, status: overrideStatusRef.current };
        for (const key of Object.keys(result)) {
            if (result[key] === null || result[key] === '') delete result[key];
        }
        return result;
    });

    const slugify = (text: string) =>
        text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const handleTitleChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug: prev.slug === '' || prev.slug === slugify(prev.title) ? slugify(val) : prev.slug,
        }));
    };

    const handleDataChange = (key: keyof NewsFormData, value: unknown) => {
        setData(key, value as never);
    };

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
    };

    const submit = (submitStatus: 'draft' | 'published' | 'archived') => {
        overrideStatusRef.current = submitStatus;
        post('/news', { forceFormData: true });
    };

    return (
        <>
            <Head title="Tulis Artikel Baru" />

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground">
                        <Link href="/news">
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Link>
                    </Button>
                    <Separator orientation="vertical" className="h-5" />
                    <div>
                        <h1 className="text-xl font-bold">Tulis Artikel Baru</h1>
                        <p className="text-xs text-muted-foreground">Buat dan publikasikan artikel berita</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <ArticleInfoCard
                            data={data}
                            errors={errors}
                            categories={categories}
                            onDataChange={handleDataChange}
                            onTitleChange={handleTitleChange}
                        />

                        <ImageUploadCard
                            data={data}
                            errors={errors}
                            imagePreview={imagePreview}
                            processing={processing}
                            onDataChange={handleDataChange}
                            onImageChange={handleImageChange}
                            onRemoveImage={removeImage}
                        />

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <Globe className="size-4 text-muted-foreground" />
                                    Konten Artikel <span className="text-destructive">*</span>
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

                        <SeoMetaCard data={data} errors={errors} onDataChange={handleDataChange} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <PublishPanel data={data} processing={processing} onDataChange={handleDataChange} onSubmit={submit} />
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
