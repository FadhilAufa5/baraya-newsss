import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { imageUrl } from '@/lib/utils';
import {
    ArrowLeft,
    Clock,
    Eye,
    Tag,
    Star,
    Edit2,
    Trash2,
    Calendar,
    User,
    ChevronRight,
    MessageCircle,
    Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
    views: number;
    reading_time: number;
    user?: { name: string };
    comments: Comment[];
    created_at: string;
}

interface Props {
    article: Article;
    canManageComments: boolean;
}

interface Comment {
    id: number;
    body: string;
    created_at: string;
    user_id: number;
    user?: {
        id: number;
        name: string;
    };
}

const STATUS_CONFIG = {
    draft: {
        label: 'Draft',
        cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    published: {
        label: 'Tayang',
        cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    },
    archived: {
        label: 'Arsip',
        cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    },
};

const CATEGORY_COLORS: Record<string, string> = {
    Nasional: 'bg-red-600',
    Internasional: 'bg-blue-600',
    Politik: 'bg-violet-600',
    Ekonomi: 'bg-emerald-600',
    Olahraga: 'bg-orange-500',
    Teknologi: 'bg-cyan-600',
    Hiburan: 'bg-pink-500',
    Kesehatan: 'bg-teal-600',
    Pendidikan: 'bg-indigo-600',
    Budaya: 'bg-amber-600',
    Lingkungan: 'bg-lime-600',
    Hukum: 'bg-slate-600',
    Umum: 'bg-gray-500',
};

function formatDate(s: string | null) {
    if (!s) return '';
    return new Date(s).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function ShowNews({ article, canManageComments }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { auth } = usePage<{ auth: { user: { id: number; name: string } } }>()
        .props;
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });

    const st = STATUS_CONFIG[article.status];
    const catColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-500';
    const imgUrl = imageUrl(article.image);
    const videoUrl = article.short_video
        ? `/storage/${article.short_video}`
        : null;

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/news/${article.id}`, {
            onFinish: () => setDeleting(false),
        });
    };

    const submitComment = (e: FormEvent) => {
        e.preventDefault();
        post(`/news/${article.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset('body'),
        });
    };

    const deleteComment = (commentId: number) => {
        router.delete(`/comments/${commentId}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title={article.title} />

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
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
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
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Link
                                href="/news"
                                className="hover:text-foreground"
                            >
                                Berita
                            </Link>
                            <ChevronRight className="size-3" />
                            <span className="line-clamp-1 max-w-xs font-medium text-foreground">
                                {article.title}
                            </span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Link href={`/news/${article.id}/edit`}>
                                <Edit2 className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-destructive/30 text-destructive hover:text-destructive"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="size-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* Article */}
                <article className="mx-auto w-full max-w-4xl">
                    {/* Category & Status */}
                    <div className="mb-4 flex items-center gap-2">
                        <span
                            className={`${catColor} rounded-sm px-2.5 py-0.5 text-xs font-bold tracking-wider text-white uppercase`}
                        >
                            {article.category}
                        </span>
                        {article.is_featured && (
                            <span className="flex items-center gap-1 rounded-sm bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-900">
                                <Star className="size-3" /> Unggulan
                            </span>
                        )}
                        <span
                            className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}
                        >
                            {st.label}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl leading-tight font-extrabold tracking-tight md:text-4xl">
                        {article.title}
                    </h1>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="mt-3 border-l-4 border-red-500 pl-4 text-lg leading-relaxed text-muted-foreground">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <User className="size-4" />
                            <span className="font-medium text-foreground">
                                {article.author ??
                                    article.user?.name ??
                                    'Redaksi'}
                            </span>
                        </span>
                        {article.published_at && (
                            <span className="flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                {formatDate(article.published_at)}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Clock className="size-4" />
                            {article.reading_time} menit membaca
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye className="size-4" />
                            {article.views.toLocaleString('id-ID')} kali dibaca
                        </span>
                    </div>

                    <Separator className="my-5" />

                    {/* Hero image */}
                    {imgUrl && (
                        <figure className="mb-6 overflow-hidden rounded-2xl">
                            <img
                                src={imgUrl}
                                alt={article.title}
                                className="max-h-[500px] w-full object-cover"
                            />
                            {article.image_caption && (
                                <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
                                    {article.image_caption}
                                </figcaption>
                            )}
                        </figure>
                    )}

                    {videoUrl && (
                        <figure className="mb-6 overflow-hidden rounded-2xl border bg-black">
                            <video
                                src={videoUrl}
                                controls
                                playsInline
                                className="max-h-[560px] w-full object-contain"
                            />
                            {article.short_video_caption && (
                                <figcaption className="bg-background px-3 py-2 text-center text-xs text-muted-foreground italic">
                                    {article.short_video_caption}
                                </figcaption>
                            )}
                        </figure>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-slate dark:prose-invert prose-headings:font-extrabold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-blockquote:border-red-500 prose-blockquote:text-muted-foreground prose-a:text-red-600 prose-img:rounded-xl max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <Separator className="my-6" />

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag className="size-4 text-muted-foreground" />
                            {article.tags.map((t) => (
                                <Badge
                                    key={t}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {t}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MessageCircle className="size-4 text-muted-foreground" />
                                Komentar ({article.comments.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <form
                                onSubmit={submitComment}
                                className="space-y-2"
                            >
                                <Textarea
                                    value={data.body}
                                    onChange={(e) =>
                                        setData('body', e.target.value)
                                    }
                                    placeholder="Tulis komentar..."
                                    rows={4}
                                    maxLength={1000}
                                />
                                <div className="flex items-start justify-between gap-3">
                                    <InputError message={errors.body} />
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            data.body.trim().length < 3
                                        }
                                        className="gap-2 bg-red-600 hover:bg-red-700"
                                    >
                                        <Send className="size-4" />
                                        Kirim
                                    </Button>
                                </div>
                            </form>

                            <Separator />

                            {article.comments.length > 0 ? (
                                <div className="space-y-4">
                                    {article.comments.map((comment) => {
                                        const canDelete =
                                            canManageComments ||
                                            comment.user_id === auth.user.id;

                                        return (
                                            <div
                                                key={comment.id}
                                                className="flex gap-3"
                                            >
                                                <Avatar className="size-9">
                                                    <AvatarFallback className="text-xs">
                                                        {(
                                                            comment.user
                                                                ?.name ?? 'U'
                                                        )
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1 rounded-lg border bg-muted/20 p-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {comment.user
                                                                    ?.name ??
                                                                    'User'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatDate(
                                                                    comment.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                        {canDelete && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 gap-1 px-2 text-destructive hover:text-destructive"
                                                                onClick={() =>
                                                                    deleteComment(
                                                                        comment.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                                Hapus
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                                                        {comment.body}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Belum ada komentar.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Footer action */}
                    <div className="mt-8 flex items-center justify-between rounded-2xl border bg-muted/30 px-5 py-4">
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">
                                Kelola artikel ini
                            </p>
                            <p>
                                Edit konten, ubah status publikasi, atau hapus
                                artikel.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                asChild
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <Link href={`/news/${article.id}/edit`}>
                                    <Edit2 className="mr-1.5 size-3.5" />
                                    Edit Artikel
                                </Link>
                            </Button>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
}

ShowNews.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Berita', href: '/news' },
        { title: 'Detail Artikel', href: '#' },
    ],
};
