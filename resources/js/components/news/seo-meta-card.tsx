import { useState } from 'react';
import { Tag, X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import type { NewsFormData, NewsErrors } from './types';

interface Props {
    data: NewsFormData;
    errors: NewsErrors;
    onDataChange: (key: keyof NewsFormData, value: unknown) => void;
}

export default function SeoMetaCard({ data, errors, onDataChange }: Props) {
    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !data.tags.includes(tag) && data.tags.length < 10) {
            onDataChange('tags', [...data.tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (t: string) =>
        onDataChange('tags', data.tags.filter((x) => x !== t));

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Info className="size-4 text-muted-foreground" />
                    SEO & Metadata
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="meta_description">
                        Meta Description
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(maks 160 karakter)</span>
                    </Label>
                    <Textarea
                        id="meta_description"
                        rows={2}
                        value={data.meta_description}
                        onChange={(e) => onDataChange('meta_description', e.target.value)}
                        placeholder="Deskripsi singkat untuk mesin pencari..."
                        maxLength={160}
                    />
                    <div className="flex justify-between">
                        <InputError message={errors.meta_description} />
                        <span className="ml-auto text-xs text-muted-foreground">{data.meta_description.length}/160</span>
                    </div>
                </div>

                <div className="grid gap-1.5">
                    <Label>Tag Artikel</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Tag className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Ketik tag lalu Enter..."
                                className="pl-8"
                                disabled={data.tags.length >= 10}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addTag}
                            disabled={!tagInput.trim() || data.tags.length >= 10}
                        >
                            Tambah
                        </Button>
                    </div>
                    {data.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {data.tags.map((t) => (
                                <Badge key={t} variant="secondary" className="gap-1 pr-1">
                                    {t}
                                    <button type="button" onClick={() => removeTag(t)} className="ml-0.5 rounded-sm hover:text-destructive">
                                        <X className="size-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
