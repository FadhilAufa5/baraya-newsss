import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Pencil,
    Plus,
    Shield,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
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

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    users_count: number;
    permissions: Permission[];
}

interface PageProps {
    roles: Role[];
    flash?: { success?: string; error?: string };
}

const ROLE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
    'Super Admin': { bg: 'bg-red-100 dark:bg-red-900/20',    text: 'text-red-700 dark:text-red-400',    ring: 'ring-red-200 dark:ring-red-800' },
    Editor:        { bg: 'bg-blue-100 dark:bg-blue-900/20',   text: 'text-blue-700 dark:text-blue-400',   ring: 'ring-blue-200 dark:ring-blue-800' },
    Writer:        { bg: 'bg-violet-100 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', ring: 'ring-violet-200 dark:ring-violet-800' },
    Subscriber:    { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800' },
};

const PERM_GROUPS: Record<string, string[]> = {
    'User':  ['manage users', 'manage roles'],
    'Berita': ['create news', 'edit news', 'delete news', 'publish news', 'view news'],
};

function groupPermissions(permissions: Permission[]) {
    const names = permissions.map(p => p.name);
    const result: { group: string; perms: string[] }[] = [];
    for (const [group, list] of Object.entries(PERM_GROUPS)) {
        const matched = list.filter(p => names.includes(p));
        if (matched.length) result.push({ group, perms: matched });
    }
    // ungrouped
    const grouped = Object.values(PERM_GROUPS).flat();
    const ungrouped = names.filter(p => !grouped.includes(p));
    if (ungrouped.length) result.push({ group: 'Lainnya', perms: ungrouped });
    return result;
}

const PERM_LABELS: Record<string, string> = {
    'manage users':  'Kelola User',
    'manage roles':  'Kelola Role',
    'create news':   'Buat Berita',
    'edit news':     'Edit Berita',
    'delete news':   'Hapus Berita',
    'publish news':  'Publikasi Berita',
    'view news':     'Lihat Berita',
};

export default function RolesIndex({ roles, flash }: PageProps) {
    const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/roles/${deleteTarget.id}`, { onSuccess: () => setDeleteTarget(null) });
    };

    return (
        <>
            <Head title="Role & Permission" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Role & Permission</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola role dan hak akses yang tersedia dalam sistem.
                        </p>
                    </div>
                    <Button asChild className="gap-2 shrink-0">
                        <Link href="/roles/create">
                            <Plus className="size-4" /> Buat Role Baru
                        </Link>
                    </Button>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <CheckCircle2 className="size-4 shrink-0" />{flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <AlertTriangle className="size-4 shrink-0" />{flash.error}
                    </div>
                )}

                {/* Roles Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
                    {roles.map((role) => {
                        const color = ROLE_COLORS[role.name];
                        const grouped = groupPermissions(role.permissions);
                        const isSuperAdmin = role.name === 'Super Admin';

                        return (
                            <Card key={role.id} className={`relative overflow-hidden ring-1 ${color?.ring ?? 'ring-border'}`}>
                                {/* Decorative top bar */}
                                <div className={`h-1 w-full ${isSuperAdmin ? 'bg-red-500' : 'bg-primary'}`} />

                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex size-10 items-center justify-center rounded-xl ${color?.bg ?? 'bg-muted'}`}>
                                                <Shield className={`size-5 ${color?.text ?? 'text-muted-foreground'}`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{role.name}</CardTitle>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Users className="size-3" />
                                                    {role.users_count} pengguna
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button variant="ghost" size="icon" className="size-8" asChild>
                                                <Link href={`/roles/${role.id}/edit`}>
                                                    <Pencil className="size-3.5" />
                                                </Link>
                                            </Button>
                                            {!isSuperAdmin && (
                                                <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeleteTarget(role)}>
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    {role.permissions.length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic">Tidak ada permission yang ditetapkan.</p>
                                    ) : (
                                        grouped.map(({ group, perms }) => (
                                            <div key={group}>
                                                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{group}</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {perms.map((p) => (
                                                        <span key={p} className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                            <CheckCircle2 className="size-2.5 text-emerald-500" />
                                                            {PERM_LABELS[p] ?? p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="size-5 text-destructive" />
                            Hapus Role
                        </DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus role <strong>{deleteTarget?.name}</strong>? Pengguna yang memiliki role ini akan kehilangan hak aksesnya.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="size-4 mr-2" /> Hapus Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [{ title: 'Role & Permission', href: '/roles' }],
};
