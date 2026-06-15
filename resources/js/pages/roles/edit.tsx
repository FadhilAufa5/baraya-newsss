import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Shield } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Permission {
    id: number;
    name: string;
}

interface RoleData {
    id: number;
    name: string;
    permissions: string[];
}

interface PageProps {
    role: RoleData;
    permissions: Permission[];
}

const PERM_GROUPS: Record<string, string[]> = {
    'Manajemen User & Akses': ['manage users', 'manage roles'],
    'Manajemen Berita': ['create news', 'edit news', 'delete news', 'publish news', 'view news'],
};

const PERM_LABELS: Record<string, string> = {
    'manage users':  'Kelola User (Lihat, Tambah, Edit, Hapus User)',
    'manage roles':  'Kelola Role & Hak Akses (Lihat, Tambah, Edit, Hapus Role)',
    'create news':   'Buat Berita Baru',
    'edit news':     'Edit Berita',
    'delete news':   'Hapus Berita',
    'publish news':  'Publikasikan Berita (Ubah Status Tayang)',
    'view news':     'Lihat Berita',
};

const PERM_DESCS: Record<string, string> = {
    'manage users':  'Mengizinkan pengguna membuat, mengubah, dan menghapus akun pengguna lain.',
    'manage roles':  'Mengizinkan membuat role baru dan memodifikasi izin hak akses sistem.',
    'create news':   'Mengizinkan membuat draf berita baru.',
    'edit news':     'Mengizinkan memperbarui tulisan berita yang sudah ada.',
    'delete news':   'Mengizinkan menghapus artikel berita secara permanen.',
    'publish news':  'Mengizinkan mempublikasikan draf berita agar tayang di publik.',
    'view news':     'Mengizinkan melihat daftar dan detail tulisan berita.',
};

export default function RoleEdit({ role, permissions }: PageProps) {
    const isSuperAdmin = role.name === 'Super Admin';

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions,
    });

    const togglePermission = (name: string) => {
        if (isSuperAdmin) return; // Super admin has all permissions and should not be editable

        setData('permissions', data.permissions.includes(name)
            ? data.permissions.filter(p => p !== name)
            : [...data.permissions, name]
        );
    };

    const toggleGroup = (groupPerms: string[]) => {
        if (isSuperAdmin) return;

        const allSelected = groupPerms.every(p => data.permissions.includes(p));
        if (allSelected) {
            setData('permissions', data.permissions.filter(p => !groupPerms.includes(p)));
        } else {
            const otherPerms = data.permissions.filter(p => !groupPerms.includes(p));
            setData('permissions', [...otherPerms, ...groupPerms]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    const getGroupedPermissions = () => {
        const result: { title: string; perms: Permission[]; keys: string[] }[] = [];
        for (const [groupTitle, list] of Object.entries(PERM_GROUPS)) {
            const matched = permissions.filter(p => list.includes(p.name));
            if (matched.length) {
                result.push({
                    title: groupTitle,
                    perms: matched,
                    keys: list,
                });
            }
        }

        const groupedNames = Object.values(PERM_GROUPS).flat();
        const ungrouped = permissions.filter(p => !groupedNames.includes(p.name));
        if (ungrouped.length) {
            result.push({
                title: 'Lainnya',
                perms: ungrouped,
                keys: ungrouped.map(p => p.name),
            });
        }

        return result;
    };

    const groupedPermissions = getGroupedPermissions();

    return (
        <>
            <Head title={`Edit Role: ${role.name}`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/roles"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Role</h1>
                        <p className="text-sm text-muted-foreground">Sesuaikan nama role dan hak akses sistem.</p>
                    </div>
                </div>

                {isSuperAdmin && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
                        <strong>Perhatian:</strong> Role <strong>Super Admin</strong> memiliki semua hak akses secara absolut dan bawaan dari sistem. Anda tidak disarankan mengubah hak akses role ini.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Role Identity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Shield className="size-4 text-primary" /> Identitas Role
                            </CardTitle>
                            <CardDescription>Nama unik untuk mendefinisikan role/peran pengguna.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Role <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: Editor Senior, Moderator, dll."
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    autoComplete="off"
                                    className="max-w-md"
                                    disabled={isSuperAdmin}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions Grid */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Hak Akses & Izin (Permissions)</CardTitle>
                            <CardDescription>Pilih tindakan apa saja yang diizinkan untuk role ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {groupedPermissions.map((group) => {
                                const allChecked = group.perms.every(p => data.permissions.includes(p.name));

                                return (
                                    <div key={group.title} className="rounded-xl border border-muted bg-muted/20 p-4 space-y-4">
                                        {/* Group Header */}
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <h3 className="font-semibold text-sm text-foreground">{group.title}</h3>
                                            {!isSuperAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup(group.keys)}
                                                    className="text-xs font-semibold text-primary hover:underline"
                                                >
                                                    {allChecked ? 'Hapus Semua' : 'Pilih Semua'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Grid items */}
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {group.perms.map((p) => {
                                                const checked = isSuperAdmin || data.permissions.includes(p.name);
                                                return (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        disabled={isSuperAdmin}
                                                        onClick={() => togglePermission(p.name)}
                                                        className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                                                            checked
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                                                : 'border-border bg-card hover:border-primary/30 hover:bg-muted/40'
                                                        } ${isSuperAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                                            checked ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                                                        }`}>
                                                            {checked && <span className="text-[9px] font-black text-primary-foreground">✓</span>}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold">{PERM_LABELS[p.name] ?? p.name}</p>
                                                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                                                                {PERM_DESCS[p.name] ?? 'Izin kustom sistem.'}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            <InputError message={errors.permissions} />
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="size-4" />
                            {processing ? 'Menyimpan...' : 'Perbarui Role'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/roles">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RoleEdit.layout = {
    breadcrumbs: [
        { title: 'Role & Permission', href: '/roles' },
        { title: 'Edit Role', href: '/roles' }, // can just point to /roles or dynamic breadcrumb if wanted
    ],
};
