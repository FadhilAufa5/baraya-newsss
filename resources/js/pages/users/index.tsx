import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    MoreHorizontal,
    Pencil,
    Plus,
    Save,
    Search,
    Shield,
    Trash2,
    User,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

const ROLE_DESC: Record<string, string> = {
    'Super Admin': 'Akses penuh ke seluruh sistem.',
    Editor:        'Kelola & publikasikan semua berita.',
    Writer:        'Buat & edit berita sendiri saja.',
    Subscriber:    'Hanya dapat melihat konten.',
};
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Auth } from '@/types';

interface Role {
    id: number;
    name: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: Role[];
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface PageProps {
    auth: Auth;
    users: PaginatedUsers;
    roles: Role[];
    filters: { search?: string; role?: string };
    flash?: { success?: string; error?: string };
    [key: string]: any;
}

const ROLE_COLORS: Record<string, string> = {
    'Super Admin': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    Editor:        'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    Writer:        'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
    Subscriber:    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
};

function RoleBadge({ name }: { name: string }) {
    const cls = ROLE_COLORS[name] ?? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
            <Shield className="size-2.5" />{name}
        </span>
    );
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarColor(name: string) {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[name.charCodeAt(0) % colors.length];
}

export default function UsersIndex({ users, roles, filters, flash }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? 'all');
    const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
    });

    const toggleRole = (name: string) => {
        setData('roles', data.roles.includes(name)
            ? data.roles.filter(r => r !== name)
            : [...data.roles, name]
        );
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                setCreateOpen(false);
                reset();
                clearErrors();
            },
        });
    };

    const applyFilter = (s = search, r = role) => {
        router.get('/users', { search: s || undefined, role: r !== 'all' ? r : undefined }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/users/${deleteTarget.id}`, { onSuccess: () => setDeleteTarget(null) });
    };

    const isSelf = (user: UserItem) => user.id === auth.user.id;

    return (
        <>
            <Head title="Manajemen User" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen User</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola pengguna dan hak akses mereka dalam sistem.
                        </p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
                        <Plus className="size-4" /> Tambah User
                    </Button>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <UserCheck className="size-4 shrink-0" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <AlertTriangle className="size-4 shrink-0" />
                        {flash.error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Total User', value: users.total, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                        { label: 'Total Role', value: roles.length, icon: Shield, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="relative overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-lg p-2 ${stat.bg}`}>
                                            <Icon className={`size-5 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold">{stat.value}</p>
                                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-48">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                    className="pl-9 h-10"
                                />
                            </div>
                            <Select value={role} onValueChange={(v) => { setRole(v); applyFilter(search, v); }}>
                                <SelectTrigger className="w-40 h-10">
                                    <SelectValue placeholder="Semua Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    {roles.map((r) => (
                                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={() => applyFilter()} className="h-10 px-5">
                                <Search className="size-4 mr-2" />Cari
                            </Button>
                            {(search || role !== 'all') && (
                                <Button variant="ghost" className="h-10 gap-1.5 text-muted-foreground" onClick={() => { setSearch(''); setRole('all'); applyFilter('', 'all'); }}>
                                    <X className="size-3.5" /> Reset
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Daftar Pengguna
                            <span className="ml-2 text-sm font-normal text-muted-foreground">({users.from ?? 0}–{users.to ?? 0} dari {users.total})</span>
                        </CardTitle>
                        <CardDescription>Klik menu aksi untuk mengedit atau menghapus pengguna.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                                    <Users className="size-8 text-muted-foreground/40" />
                                </div>
                                <div>
                                    <p className="font-semibold">Tidak ada user ditemukan</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Coba ubah filter pencarian Anda.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/30">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pengguna</th>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Email</th>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Role</th>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Bergabung</th>
                                            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="group transition-colors hover:bg-muted/30">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(user.name)}`}>
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold leading-tight">
                                                                {user.name}
                                                                {isSelf(user) && <span className="ml-2 text-[10px] font-normal text-muted-foreground">(Anda)</span>}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{user.email}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.length > 0
                                                            ? user.roles.map((r) => <RoleBadge key={r.id} name={r.name} />)
                                                            : <span className="text-xs text-muted-foreground">—</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/users/${user.id}/edit`} className="flex items-center gap-2">
                                                                    <Pencil className="size-3.5" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                disabled={isSelf(user)}
                                                                onClick={() => !isSelf(user) && setDeleteTarget(user)}
                                                            >
                                                                <Trash2 className="size-3.5 mr-2" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-4 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Halaman {users.current_page} dari {users.last_page}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled={users.current_page === 1}
                                        onClick={() => router.get('/users', { ...filters, page: users.current_page - 1 })}>
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" disabled={users.current_page === users.last_page}
                                        onClick={() => router.get('/users', { ...filters, page: users.current_page + 1 })}>
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="size-5 text-destructive" />
                            Hapus User
                        </DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus user <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="size-4 mr-2" /> Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={(open) => {
                if (!open) {
                    setCreateOpen(false);
                    reset();
                    clearErrors();
                }
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Tambah User Baru
                        </DialogTitle>
                        <DialogDescription>
                            Masukkan informasi identitas pengguna baru dan pilih peran/hak aksesnya.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    placeholder="Nama lengkap"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    autoComplete="off"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contoh@email.com"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="off"
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Min. 8 karakter"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/85" onClick={() => setShowPass(v => !v)}>
                                        {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password_confirmation">Konfirmasi Password <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/85" onClick={() => setShowConfirm(v => !v)}>
                                        {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Hak Akses (Role) <span className="text-destructive">*</span></Label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-h-48 overflow-y-auto p-1.5 border rounded-xl bg-muted/10">
                                {roles.map((r) => {
                                    const selected = data.roles.includes(r.name);
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => toggleRole(r.name)}
                                            className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-left transition-all bg-card ${selected
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'}`}
                                        >
                                            <div className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${selected ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                                                {selected && <span className="text-[9px] font-black text-primary-foreground">✓</span>}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold">{r.name}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{ROLE_DESC[r.name] ?? 'Role kustom'}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.roles} />
                        </div>

                        <DialogFooter className="pt-2 border-t mt-4">
                            <Button type="button" variant="outline" onClick={() => {
                                setCreateOpen(false);
                                reset();
                                clearErrors();
                            }}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="gap-1.5">
                                <Save className="size-4" />
                                {processing ? 'Menyimpan...' : 'Simpan User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Manajemen User', href: '/users' }],
};
