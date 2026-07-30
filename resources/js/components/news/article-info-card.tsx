import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { NewsFormData, NewsErrors } from './types';

interface Props {
    data: NewsFormData;
    errors: NewsErrors;
    categories: string[];
    onDataChange: (key: keyof NewsFormData, value: unknown) => void;
    onTitleChange: (val: string) => void;
}

export default function ArticleInfoCard({ data, errors, categories, onDataChange, onTitleChange }: Props) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="size-4 text-muted-foreground" />
                    Informasi Artikel
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="title">
                        Judul Artikel <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Masukkan judul artikel yang menarik..."
                        className="text-base font-medium"
                    />
                    <InputError message={errors.title} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="slug">
                        Slug URL
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(auto-generated)</span>
                    </Label>
                    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                        <span className="shrink-0 text-muted-foreground">/news/</span>
                        <input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => onDataChange('slug', e.target.value)}
                            className="flex-1 bg-transparent text-foreground outline-none"
                            placeholder="artikel-slug-url"
                        />
                    </div>
                    <InputError message={errors.slug} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="category">
                            Kategori <span className="text-destructive">*</span>
                        </Label>
                        <Select value={data.category} onValueChange={(v) => onDataChange('category', v)}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Pilih kategori..." />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="author">Nama Penulis</Label>
                        <Input
                            id="author"
                            value={data.author}
                            onChange={(e) => onDataChange('author', e.target.value)}
                            placeholder="Nama reporter / editor"
                        />
                        <InputError message={errors.author} />
                    </div>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="excerpt">
                        Ringkasan
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(maks 500 karakter)</span>
                    </Label>
                    <Textarea
                        id="excerpt"
                        rows={3}
                        value={data.excerpt}
                        onChange={(e) => onDataChange('excerpt', e.target.value)}
                        placeholder="Tulis ringkasan singkat artikel yang tampil di halaman daftar berita..."
                        maxLength={500}
                    />
                    <div className="flex justify-between">
                        <InputError message={errors.excerpt} />
                        <span className="ml-auto text-xs text-muted-foreground">{data.excerpt.length}/500</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
