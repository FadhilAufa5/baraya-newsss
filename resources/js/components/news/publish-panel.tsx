import { Star, Send, Save } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { NewsFormData } from './types';

interface Props {
    data: NewsFormData;
    processing: boolean;
    onDataChange: (key: keyof NewsFormData, value: unknown) => void;
    onSubmit: (status: 'draft' | 'published' | 'archived') => void;
}

export default function PublishPanel({ data, processing, onDataChange, onSubmit }: Props) {
    return (
        <Card className="sticky top-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Pengaturan Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select value={data.status} onValueChange={(v: 'draft' | 'published' | 'archived') => onDataChange('status', v)}>
                        <SelectTrigger disabled={processing}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">🗒️ Draft</SelectItem>
                            <SelectItem value="published">✅ Tayang</SelectItem>
                            <SelectItem value="archived">📦 Arsip</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="published_at">Tanggal Terbit</Label>
                    <Input
                        id="published_at"
                        type="datetime-local"
                        value={data.published_at}
                        onChange={(e) => onDataChange('published_at', e.target.value)}
                        disabled={processing}
                    />
                    <p className="text-xs text-muted-foreground">Kosongkan untuk auto-set saat tayang</p>
                </div>

                <button
                    type="button"
                    onClick={() => onDataChange('is_featured', !data.is_featured)}
                    disabled={processing}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                        data.is_featured
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-border hover:border-amber-300'
                    }`}
                >
                    <Star className={`size-5 ${data.is_featured ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                        <p className="text-sm font-medium">Artikel Unggulan</p>
                        <p className="text-xs text-muted-foreground">Tampil di posisi hero halaman utama</p>
                    </div>
                </button>

                <Separator />

                <div className="space-y-1.5 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Kategori</span>
                        <span className="font-medium text-foreground">{data.category || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Penulis</span>
                        <span className="font-medium text-foreground">{data.author || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tags</span>
                        <span className="font-medium text-foreground">{data.tags.length} tag</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Gambar</span>
                        <span className="font-medium text-foreground">{data.image ? '✓ Diunggah' : '—'}</span>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                    <Button
                        type="button"
                        className="w-full gap-2 bg-red-600 hover:bg-red-700"
                        disabled={processing}
                        onClick={() => onSubmit('published')}
                    >
                        {processing ? <Spinner /> : <Send className="size-4" />}
                        Terbitkan Sekarang
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        disabled={processing}
                        onClick={() => onSubmit(data.status)}
                    >
                        {processing ? <Spinner /> : <Save className="size-4" />}
                        {data.status === 'published' ? 'Simpan' : data.status === 'archived' ? 'Simpan Arsip' : 'Simpan Draft'}
                    </Button>
                    <Button asChild variant="ghost" className="w-full text-muted-foreground">
                        <Link href="/news">Batal</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
