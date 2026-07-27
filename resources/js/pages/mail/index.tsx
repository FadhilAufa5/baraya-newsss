import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Inbox,
    Send,
    FileText,
    Star,
    Trash2,
    Search,
    RefreshCw,
    Reply,
    Forward,
    ChevronLeft,
    ChevronRight,
    Mail,
    MailOpen,
    RotateCcw,
    Loader2,
    Pencil,
    X,
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Email', href: '/email' },
];

interface EmailItem {
    id: number;
    to_email: string;
    to_name: string | null;
    subject: string;
    body: string;
    status: 'draft' | 'sent' | 'failed';
    folder: string;
    is_read: boolean;
    is_starred: boolean;
    cc: string | null;
    bcc: string | null;
    sent_at: string | null;
    created_at: string;
}

interface PaginatedEmails {
    data: EmailItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Counts {
    inbox: number;
    sent: number;
    draft: number;
    starred: number;
    trash: number;
    unread: number;
}

interface Props {
    emails: PaginatedEmails;
    counts: Counts;
    folder: string;
    filters: { search: string; folder: string };
    users: { id: number; name: string; email: string }[];
}

const FOLDERS = [
    { key: 'inbox', label: 'Kotak Masuk', icon: Inbox, countKey: 'inbox' },
    { key: 'sent', label: 'Terkirim', icon: Send, countKey: 'sent' },
    { key: 'draft', label: 'Draf', icon: FileText, countKey: 'draft' },
    { key: 'starred', label: 'Berbintang', icon: Star, countKey: 'starred' },
    { key: 'trash', label: 'Sampah', icon: Trash2, countKey: 'trash' },
] as const;

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    sent: { label: 'Terkirim', variant: 'default' },
    draft: { label: 'Draf', variant: 'secondary' },
    failed: { label: 'Gagal', variant: 'destructive' },
};

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function getInitials(name: string | null, email: string) {
    if (name) {
        const parts = name.trim().split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
    'bg-rose-600',
    'bg-blue-600',
    'bg-emerald-600',
    'bg-violet-600',
    'bg-amber-600',
    'bg-pink-600',
    'bg-cyan-600',
    'bg-indigo-600',
    'bg-teal-600',
    'bg-orange-600',
];

function avatarColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function EmailIndex({ emails, counts, folder, filters }: Props) {
    const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
    const [composeOpen, setComposeOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, processing, reset, errors } = useForm({
        to_email: '',
        to_name: '',
        subject: '',
        body: '',
        cc: '',
        bcc: '',
        action: 'send' as 'send' | 'draft',
    });

    const switchFolder = (f: string) => {
        setSelectedEmail(null);
        router.get('/email', { folder: f }, { preserveState: false });
    };

    const handleSearch = () => {
        router.get('/email', { folder, search }, { preserveState: true });
    };

    const handleMarkRead = (email: EmailItem) => {
        if (!email.is_read) {
            router.post(`/email/${email.id}/read`, {}, { preserveState: true });
        }
        setSelectedEmail(email);
    };

    const handleStar = (e: React.MouseEvent, email: EmailItem) => {
        e.stopPropagation();
        router.post(`/email/${email.id}/star`, {}, { preserveState: true });
    };

    const handleDelete = (e: React.MouseEvent | null, id: number) => {
        e?.stopPropagation();
        if (confirm('Pindahkan email ke sampah?')) {
            if (selectedEmail?.id === id) setSelectedEmail(null);
            router.delete(`/email/${id}`, { preserveState: true });
        }
    };

    const handleForceDelete = (id: number) => {
        if (confirm('Hapus permanen? Tindakan ini tidak dapat dibatalkan.')) {
            setSelectedEmail(null);
            router.delete(`/email/${id}/force`, { preserveState: true });
        }
    };

    const handleRestore = (e: React.MouseEvent | null, id: number) => {
        e?.stopPropagation();
        router.post(`/email/${id}/restore`, {}, { preserveState: true });
    };

    const submitCompose = (action: 'send' | 'draft') => {
        setData('action', action);
        post('/email', {
            onSuccess: () => {
                reset();
                setComposeOpen(false);
            },
        });
    };

    const currentFolder = FOLDERS.find((f) => f.key === folder) || FOLDERS[0];

    return (
        <>
            <Head title="Email" />

            <TooltipProvider>
                <div className="flex flex-1 flex-col p-4 md:p-6">
                    {/* Main Content Card */}
                    <Card className="flex-1 overflow-hidden">
                        <div className="flex h-[calc(100vh-8.5rem)] min-h-[500px]">

                            {/* ── Folder Sidebar ─────────────────────────────── */}
                            <div className="hidden w-56 shrink-0 flex-col border-r md:flex">
                                <div className="p-3">
                                    <Button
                                        onClick={() => setComposeOpen(true)}
                                        className="w-full gap-2 bg-red-600 text-white shadow-sm hover:bg-red-700"
                                    >
                                        <Pencil className="size-4" />
                                        Tulis Email
                                    </Button>
                                </div>

                                <nav className="flex-1 space-y-0.5 px-2">
                                    {FOLDERS.map(({ key, label, icon: Icon, countKey }) => {
                                        const count = counts[countKey as keyof Counts];
                                        const isActive = folder === key;

                                        return (
                                            <button
                                                key={key}
                                                onClick={() => switchFolder(key)}
                                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                                                    isActive
                                                        ? 'bg-accent font-semibold text-accent-foreground'
                                                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <Icon className="size-4" />
                                                    {label}
                                                </span>

                                                {count > 0 && (
                                                    <Badge
                                                        variant={key === 'inbox' && counts.unread > 0 ? 'default' : 'secondary'}
                                                        className={`min-w-[22px] justify-center px-1.5 text-[10px] font-bold ${
                                                            key === 'inbox' && counts.unread > 0
                                                                ? 'bg-red-600 hover:bg-red-600'
                                                                : ''
                                                        }`}
                                                    >
                                                        {key === 'inbox' && counts.unread > 0 ? counts.unread : count}
                                                    </Badge>
                                                )}
                                            </button>
                                        );
                                    })}
                                </nav>

                                <Separator />

                                <div className="p-4">
                                    <p className="text-[11px] text-muted-foreground">
                                        {counts.unread} belum dibaca dari {counts.inbox} pesan
                                    </p>
                                </div>
                            </div>

                            {/* ── Email List Panel ───────────────────────────── */}
                            <div className="flex w-full flex-col border-r md:w-80 md:shrink-0">
                                {/* List Header */}
                                <div className="flex items-center justify-between px-4 py-3">
                                    <div>
                                        <h2 className="text-sm font-semibold">{currentFolder.label}</h2>
                                        <p className="text-[11px] text-muted-foreground">{emails.total} pesan</p>
                                    </div>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() => router.reload()}
                                            >
                                                <RefreshCw className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Refresh</TooltipContent>
                                    </Tooltip>
                                </div>

                                <Separator />

                                {/* Search Input */}
                                <div className="px-3 py-2.5">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="Cari email..."
                                            className="h-8 pl-8 text-xs"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Scrollable Emails */}
                                <ScrollArea className="flex-1">
                                    {emails.data.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                                            <div className="rounded-full bg-muted p-4">
                                                <Mail className="size-8 text-muted-foreground/50" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Tidak ada email</p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Folder {currentFolder.label.toLowerCase()} kosong
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {emails.data.map((email) => (
                                                <button
                                                    key={email.id}
                                                    onClick={() => handleMarkRead(email)}
                                                    className={`group relative flex w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60 ${
                                                        selectedEmail?.id === email.id ? 'bg-accent' : ''
                                                    } ${!email.is_read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''}`}
                                                >
                                                    {!email.is_read && (
                                                        <span className="absolute left-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-blue-500" />
                                                    )}

                                                    {/* Avatar */}
                                                    <div
                                                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(
                                                            email.to_email
                                                        )}`}
                                                    >
                                                        {getInitials(email.to_name, email.to_email)}
                                                    </div>

                                                    {/* Summary Content */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p
                                                                className={`truncate text-sm ${
                                                                    !email.is_read
                                                                        ? 'font-semibold'
                                                                        : 'font-medium text-muted-foreground'
                                                                }`}
                                                            >
                                                                {email.to_name || email.to_email}
                                                            </p>

                                                            <span className="shrink-0 text-[10px] text-muted-foreground">
                                                                {email.created_at?.split(',')[0]}
                                                            </span>
                                                        </div>

                                                        <p
                                                            className={`mt-0.5 truncate text-xs ${
                                                                !email.is_read ? 'font-medium' : 'text-muted-foreground'
                                                            }`}
                                                        >
                                                            {email.subject || '(Tanpa subjek)'}
                                                        </p>

                                                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground/60">
                                                            {stripHtml(email.body).substring(0, 70)}
                                                        </p>
                                                    </div>

                                                    {/* Quick Actions on Hover */}
                                                    <div className="absolute right-2 top-2 hidden items-center gap-0.5 rounded-md border bg-background p-0.5 shadow-sm group-hover:flex">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={(e) => handleStar(e, email)}
                                                                    className="rounded p-1 hover:bg-muted"
                                                                >
                                                                    <Star
                                                                        className={`size-3.5 ${
                                                                            email.is_starred
                                                                                ? 'fill-amber-400 text-amber-400'
                                                                                : 'text-muted-foreground'
                                                                        }`}
                                                                    />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom">
                                                                {email.is_starred ? 'Hapus bintang' : 'Beri bintang'}
                                                            </TooltipContent>
                                                        </Tooltip>

                                                        {folder === 'trash' ? (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={(e) => handleRestore(e, email.id)}
                                                                        className="rounded p-1 hover:bg-muted"
                                                                    >
                                                                        <RotateCcw className="size-3.5 text-emerald-600" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom">Pulihkan</TooltipContent>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={(e) => handleDelete(e, email.id)}
                                                                        className="rounded p-1 hover:bg-muted"
                                                                    >
                                                                        <Trash2 className="size-3.5 text-destructive" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom">Hapus</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* Pagination */}
                                {emails.last_page > 1 && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center justify-between px-4 py-2">
                                            <span className="text-[11px] text-muted-foreground">
                                                Hal {emails.current_page}/{emails.last_page}
                                            </span>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-7"
                                                    disabled={emails.current_page === 1}
                                                    onClick={() =>
                                                        router.get('/email', { folder, page: emails.current_page - 1 })
                                                    }
                                                >
                                                    <ChevronLeft className="size-3.5" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-7"
                                                    disabled={emails.current_page === emails.last_page}
                                                    onClick={() =>
                                                        router.get('/email', { folder, page: emails.current_page + 1 })
                                                    }
                                                >
                                                    <ChevronRight className="size-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* ── Email Detail View ──────────────────────────── */}
                            <div className="hidden flex-1 flex-col md:flex">
                                {selectedEmail ? (
                                    <>
                                        {/* Detail Header Toolbar */}
                                        <div className="flex items-center gap-1.5 px-4 py-2.5">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1.5 text-xs"
                                                onClick={() => setSelectedEmail(null)}
                                            >
                                                <ChevronLeft className="size-3.5" />
                                                Kembali
                                            </Button>

                                            <div className="flex-1" />

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <Reply className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Balas</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <Forward className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Teruskan</TooltipContent>
                                            </Tooltip>

                                            <Separator orientation="vertical" className="mx-1 h-5" />

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={(e) => handleStar(e, selectedEmail)}
                                                    >
                                                        <Star
                                                            className={`size-4 ${
                                                                selectedEmail.is_starred ? 'fill-amber-400 text-amber-400' : ''
                                                            }`}
                                                        />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {selectedEmail.is_starred ? 'Hapus bintang' : 'Beri bintang'}
                                                </TooltipContent>
                                            </Tooltip>

                                            {folder === 'trash' ? (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-emerald-600"
                                                                onClick={() => handleRestore(null, selectedEmail.id)}
                                                            >
                                                                <RotateCcw className="size-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Pulihkan</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-destructive"
                                                                onClick={() => handleForceDelete(selectedEmail.id)}
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Hapus permanen</TooltipContent>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive"
                                                            onClick={(e) => handleDelete(e, selectedEmail.id)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Hapus</TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>

                                        <Separator />

                                        {/* Body Reader */}
                                        <ScrollArea className="flex-1">
                                            <div className="mx-auto max-w-3xl px-6 py-6">
                                                <h1 className="text-xl font-bold tracking-tight">
                                                    {selectedEmail.subject || '(Tanpa subjek)'}
                                                </h1>

                                                <div className="mt-5 flex items-start gap-3">
                                                    <div
                                                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(
                                                            selectedEmail.to_email
                                                        )}`}
                                                    >
                                                        {getInitials(selectedEmail.to_name, selectedEmail.to_email)}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-baseline gap-2">
                                                            <p className="text-sm font-semibold">
                                                                {selectedEmail.to_name || selectedEmail.to_email}
                                                            </p>
                                                            <Badge
                                                                variant={
                                                                    STATUS_MAP[selectedEmail.status]?.variant ||
                                                                    'secondary'
                                                                }
                                                                className="text-[10px]"
                                                            >
                                                                {STATUS_MAP[selectedEmail.status]?.label ||
                                                                    selectedEmail.status}
                                                            </Badge>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground">
                                                            Ke: {selectedEmail.to_email}
                                                        </p>
                                                        {selectedEmail.cc && (
                                                            <p className="text-xs text-muted-foreground">
                                                                CC: {selectedEmail.cc}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <p className="shrink-0 text-xs text-muted-foreground">
                                                        {selectedEmail.created_at}
                                                    </p>
                                                </div>

                                                <Separator className="my-5" />

                                                <div
                                                    className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap"
                                                    dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                                                />
                                            </div>
                                        </ScrollArea>
                                    </>
                                ) : (
                                    <div className="flex flex-1 flex-col items-center justify-center gap-4">
                                        <div className="rounded-full bg-muted p-5">
                                            <MailOpen className="size-10 text-muted-foreground/40" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-sm font-semibold">Pilih email untuk dibaca</h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Pilih email dari daftar di sebelah kiri untuk melihat isinya
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => setComposeOpen(true)}
                                        >
                                            <Pencil className="size-3.5" />
                                            Tulis Email Baru
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </TooltipProvider>

            {/* ── Compose Modal Dialog ──────────────────────────────────────── */}
            <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
                <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
                    <DialogHeader className="border-b px-6 py-4">
                        <DialogTitle>Tulis Email Baru</DialogTitle>
                        <DialogDescription>
                            Kirim email atau simpan sebagai draf untuk nanti
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-0 divide-y">
                        <div className="flex items-center gap-3 px-6 py-3">
                            <Label className="w-12 shrink-0 text-xs text-muted-foreground">Kepada</Label>
                            <Input
                                type="email"
                                value={data.to_email}
                                onChange={(e) => setData('to_email', e.target.value)}
                                placeholder="email@contoh.com"
                                className="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </div>
                        {errors.to_email && (
                            <p className="px-6 py-1 text-xs text-destructive">{errors.to_email}</p>
                        )}

                        <div className="flex items-center gap-3 px-6 py-3">
                            <Label className="w-12 shrink-0 text-xs text-muted-foreground">Nama</Label>
                            <Input
                                type="text"
                                value={data.to_name}
                                onChange={(e) => setData('to_name', e.target.value)}
                                placeholder="Nama penerima (opsional)"
                                className="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3">
                            <Label className="w-12 shrink-0 text-xs text-muted-foreground">CC</Label>
                            <Input
                                type="text"
                                value={data.cc}
                                onChange={(e) => setData('cc', e.target.value)}
                                placeholder="cc@contoh.com (opsional)"
                                className="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3">
                            <Label className="w-12 shrink-0 text-xs text-muted-foreground">Subjek</Label>
                            <Input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Subjek email"
                                className="h-8 border-0 bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0"
                            />
                        </div>
                        {errors.subject && (
                            <p className="px-6 py-1 text-xs text-destructive">{errors.subject}</p>
                        )}

                        <div className="px-6 py-4">
                            <Textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                placeholder="Tulis isi email di sini..."
                                rows={12}
                                className="resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                            {errors.body && (
                                <p className="mt-1 text-xs text-destructive">{errors.body}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex-row items-center justify-between border-t bg-muted/40 px-6 py-3">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => submitCompose('send')}
                                disabled={processing}
                                className="gap-2 bg-red-600 text-white hover:bg-red-700"
                            >
                                {processing ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Send className="size-4" />
                                )}
                                Kirim
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => submitCompose('draft')}
                                disabled={processing}
                                className="gap-2"
                            >
                                <FileText className="size-4" />
                                Simpan Draf
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => {
                                reset();
                                setComposeOpen(false);
                            }}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EmailIndex.layout = {
    breadcrumbs: [
        { title: 'Email', href: '/email' },
    ],
};
