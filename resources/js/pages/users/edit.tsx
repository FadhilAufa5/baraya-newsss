import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Save, Shield, User } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Role {
    id: number;
    name: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

interface PageProps {
    user: UserData;
    roles: Role[];
}

const ROLE_DESC: Record<string, string> = {
    'Super Admin': 'Akses penuh ke seluruh sistem.',
    Editor:        'Kelola & publikasikan semua berita.',
    Writer:        'Buat & edit berita sendiri saja.',
    Subscriber:    'Hanya dapat melihat konten.',
};

export default function UserEdit({ user, roles }: PageProps) {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: user.roles ?? [] as string[],
    });

    const toggleRole = (name: string) => {
        setData('roles', data.roles.includes(name)
            ? data.roles.filter(r => r !== name)
            : [...data.roles, name]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    function getInitials(name: string) {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    return (
        <>
            <Head title={`Edit User — ${user.name}`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/users"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
                        <p className="text-sm text-muted-foreground">Perbarui informasi dan hak akses pengguna.</p>
                    </div>
                </div>

                {/* User Card */}
                <Card className="border-dashed">
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                            {getInitials(user.name)}
                        </div>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="ml-auto flex flex-wrap gap-1">
                            {user.roles.map(r => (
                                <span key={r} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">{r}</span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={submit} className="space-y-6">
                    {/* Informasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="size-4" /> Informasi Pengguna
                            </CardTitle>
                            <CardDescription>Kosongkan password jika tidak ingin menggantinya.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    placeholder="Nama lengkap"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contoh@email.com"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        Password Baru <span className="ml-1 text-[10px] font-normal text-muted-foreground">(opsional)</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Biarkan kosong jika tidak diubah"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                        />
                                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPass(v => !v)}>
                                            {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Ulangi password baru"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                        />
                                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirm(v => !v)}>
                                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Shield className="size-4" /> Hak Akses (Role)
                            </CardTitle>
                            <CardDescription>Ubah role pengguna sesuai kebutuhan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {roles.map((r) => {
                                    const selected = data.roles.includes(r.name);
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => toggleRole(r.name)}
                                            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${selected
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'}`}
                                        >
                                            <div className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${selected ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                                                {selected && <span className="text-[9px] font-black text-primary-foreground">✓</span>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{r.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{ROLE_DESC[r.name] ?? 'Role kustom'}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.roles} className="mt-2" />
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="size-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/users">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

UserEdit.layout = {
    breadcrumbs: [
        { title: 'Manajemen User', href: '/users' },
        { title: 'Edit User', href: '#' },
    ],
};
