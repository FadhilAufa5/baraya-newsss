import { Megaphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import type { AdFormData } from './types';

interface Props {
    data: AdFormData;
    errors: Record<string, string | undefined>;
    onChange: <K extends keyof AdFormData>(key: K, value: AdFormData[K]) => void;
}

export default function AdFormContent({ data, errors, onChange }: Props) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <Megaphone className="size-4" />
                    </div>
                    Konten Iklan
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
                <div className="grid gap-1.5">
                    <Label htmlFor="title" className="text-xs font-bold">Judul Iklan <span className="text-destructive">*</span></Label>
                    <Input id="title" value={data.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Judul iklan..." className="rounded-xl" />
                    <InputError message={errors.title} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="sponsor_name" className="text-xs font-bold">Nama Sponsor</Label>
                    <Input id="sponsor_name" value={data.sponsor_name} onChange={(e) => onChange('sponsor_name', e.target.value)} placeholder="Nama perusahaan/brand..." className="rounded-xl" />
                    <InputError message={errors.sponsor_name} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="description" className="text-xs font-bold">Deskripsi</Label>
                    <Textarea id="description" rows={3} maxLength={500} value={data.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Deskripsi singkat iklan..." className="rounded-xl resize-none" />
                    <InputError message={errors.description} />
                </div>
            </CardContent>
        </Card>
    );
}
