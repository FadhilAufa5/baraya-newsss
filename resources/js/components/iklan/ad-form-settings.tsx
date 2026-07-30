import { Link } from '@inertiajs/react';
import { Save, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { AdFormData } from './types';

interface Props {
    data: AdFormData;
    processing: boolean;
    onChange: <K extends keyof AdFormData>(key: K, value: AdFormData[K]) => void;
    onSubmit: () => void;
}

export default function AdFormSettings({ data, processing, onChange, onSubmit }: Props) {
    return (
        <Card className="h-fit lg:sticky lg:top-4 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Save className="size-4" />
                    </div>
                    Pengaturan
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
                <div className="grid gap-1.5">
                    <Label className="text-xs font-bold">Tipe Iklan <span className="text-destructive">*</span></Label>
                    <Select value={data.type} onValueChange={(v: 'leaderboard' | 'in-feed' | 'rectangle') => onChange('type', v)}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="leaderboard">Leaderboard</SelectItem>
                            <SelectItem value="in-feed">In-Feed</SelectItem>
                            <SelectItem value="rectangle">Rectangle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-1.5">
                    <Label className="text-xs font-bold">Posisi <span className="text-destructive">*</span></Label>
                    <Select value={data.position} onValueChange={(v: 'top' | 'middle' | 'sidebar') => onChange('position', v)}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="top">Atas</SelectItem>
                            <SelectItem value="middle">Tengah</SelectItem>
                            <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="sort_order" className="text-xs font-bold">Urutan</Label>
                    <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => onChange('sort_order', parseInt(e.target.value) || 0)} className="rounded-xl" />
                    <p className="text-[10px] text-muted-foreground">Semakin kecil, semakin atas.</p>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="starts_at" className="text-xs font-bold">Mulai Tayang</Label>
                    <Input id="starts_at" type="datetime-local" value={data.starts_at} onChange={(e) => onChange('starts_at', e.target.value)} className="rounded-xl" />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="ends_at" className="text-xs font-bold">Berakhir Tayang</Label>
                    <Input id="ends_at" type="datetime-local" value={data.ends_at} onChange={(e) => onChange('ends_at', e.target.value)} className="rounded-xl" />
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                    <input type="checkbox" id="is_active" checked={data.is_active} onChange={(e) => onChange('is_active', e.target.checked)} className="size-4 rounded border-input accent-primary" />
                    <Label htmlFor="is_active" className="text-xs font-bold cursor-pointer">Aktifkan iklan</Label>
                </div>

                <Separator />

                <div className="flex flex-col gap-2.5">
                    <Button type="button" className="w-full gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/25" disabled={processing} onClick={onSubmit}>
                        {processing ? <Spinner /> : <Send className="size-4" />}
                        Simpan Iklan
                    </Button>
                    <Button asChild variant="ghost" className="w-full rounded-xl text-muted-foreground">
                        <Link href="/iklan">Batal</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
