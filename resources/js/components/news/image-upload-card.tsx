import { useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import type { NewsFormData, NewsErrors } from './types';

interface Props {
    data: NewsFormData;
    errors: NewsErrors;
    imagePreview: string | null;
    processing?: boolean;
    onDataChange: (key: keyof NewsFormData, value: unknown) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export default function ImageUploadCard({ data, errors, imagePreview, processing, onDataChange, onImageChange, onRemoveImage }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <ImageIcon className="size-4 text-muted-foreground" />
                    Gambar Utama
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="relative">
                    {imagePreview ? (
                        <div className="relative overflow-hidden rounded-xl border">
                            <img src={imagePreview} alt="Preview" className="h-56 w-full object-cover" />
                            <button
                                type="button"
                                onClick={onRemoveImage}
                                disabled={processing}
                                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={processing}
                            className="flex h-44 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 hover:text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Upload className="size-8 opacity-50" />
                            <div className="text-center">
                                <p className="text-sm font-medium">Klik untuk upload gambar</p>
                                <p className="text-xs">JPG, PNG, WebP — maks 4MB</p>
                            </div>
                        </button>
                    )}

                    {processing && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="size-8 animate-spin text-white" />
                                <span className="text-xs font-semibold text-white drop-shadow-lg">Mengunggah...</span>
                            </div>
                        </div>
                    )}
                </div>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageChange}
                    disabled={processing}
                />

                {imagePreview && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileRef.current?.click()}
                        disabled={processing}
                        className="gap-2"
                    >
                        {processing ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                        Ganti Gambar
                    </Button>
                )}

                <div className="grid gap-1.5">
                    <Label htmlFor="image_caption">Keterangan Gambar</Label>
                    <Input
                        id="image_caption"
                        value={data.image_caption}
                        onChange={(e) => onDataChange('image_caption', e.target.value)}
                        placeholder="Sumber / deskripsi gambar..."
                        disabled={processing}
                    />
                </div>

                <InputError message={errors.image} />
            </CardContent>
        </Card>
    );
}
