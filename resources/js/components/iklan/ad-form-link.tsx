import { ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import type { AdFormData } from './types';

interface Props {
    data: AdFormData;
    errors: Record<string, string | undefined>;
    onChange: <K extends keyof AdFormData>(key: K, value: AdFormData[K]) => void;
}

export default function AdFormLink({ data, errors, onChange }: Props) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <ExternalLink className="size-4" />
                    </div>
                    Link & Tombol
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
                <div className="grid gap-1.5">
                    <Label htmlFor="cta_text" className="text-xs font-bold">Teks Tombol <span className="text-destructive">*</span></Label>
                    <Input id="cta_text" value={data.cta_text} onChange={(e) => onChange('cta_text', e.target.value)} placeholder="Kunjungi, Beli Sekarang, dll..." className="rounded-xl" />
                    <InputError message={errors.cta_text} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="cta_url" className="text-xs font-bold">URL Tujuan <span className="text-destructive">*</span></Label>
                    <Input id="cta_url" value={data.cta_url} onChange={(e) => onChange('cta_url', e.target.value)} placeholder="https://..." className="rounded-xl" />
                    <InputError message={errors.cta_url} />
                </div>
            </CardContent>
        </Card>
    );
}
