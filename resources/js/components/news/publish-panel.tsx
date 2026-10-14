import { useState, useEffect } from 'react';
import { Star, Send, Save, Clock, Calendar, Globe, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { NewsFormData } from './types';

type Timezone = 'WIB' | 'WITA' | 'WIT';

const TZ_OFFSETS: Record<Timezone, number> = {
    WIB: 7,
    WITA: 8,
    WIT: 9,
};

const TZ_CONFIG: Record<Timezone, { label: string; full: string; region: string }> = {
    WIB: { label: 'WIB', full: 'Waktu Indonesia Barat (UTC+7)', region: 'Jawa, Sumatra, Kalbar, Kalteng' },
    WITA: { label: 'WITA', full: 'Waktu Indonesia Tengah (UTC+8)', region: 'Bali, NTB, NTT, Kalsel, Kaltim, Sulawesi' },
    WIT: { label: 'WIT', full: 'Waktu Indonesia Timur (UTC+9)', region: 'Maluku, Papua' },
};

const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const INDONESIAN_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function pad(n: number): string {
    return String(n).padStart(2, '0');
}

/**
 * Convert user input (Date + 24h Time + Timezone) into WIB datetime string (YYYY-MM-DDTHH:mm)
 */
function localInputToWibString(dateStr: string, timeStr: string, tz: Timezone): string {
    if (!dateStr || !timeStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(hh) || isNaN(mm)) return '';

    const diffHours = TZ_OFFSETS[tz] - 7;
    const utcDate = new Date(Date.UTC(y, m - 1, d, hh - diffHours, mm));

    return `${utcDate.getUTCFullYear()}-${pad(utcDate.getUTCMonth() + 1)}-${pad(utcDate.getUTCDate())}T${pad(utcDate.getUTCHours())}:${pad(utcDate.getUTCMinutes())}`;
}

/**
 * Convert WIB datetime string into local date and 24h time for the given timezone
 */
function wibStringToLocalInput(wibStr: string, tz: Timezone): { date: string; time: string } {
    if (!wibStr) return { date: '', time: '' };
    const [dPart, tPart] = wibStr.split('T');
    if (!dPart || !tPart) return { date: '', time: '' };
    const [y, m, d] = dPart.split('-').map(Number);
    const [hh, mm] = tPart.split(':').map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(hh) || isNaN(mm)) return { date: '', time: '' };

    const diffHours = TZ_OFFSETS[tz] - 7;
    const utcDate = new Date(Date.UTC(y, m - 1, d, hh + diffHours, mm));

    return {
        date: `${utcDate.getUTCFullYear()}-${pad(utcDate.getUTCMonth() + 1)}-${pad(utcDate.getUTCDate())}`,
        time: `${pad(utcDate.getUTCHours())}:${pad(utcDate.getUTCMinutes())}`,
    };
}

/**
 * Format WIB datetime string into full Indonesian text representation
 */
function formatIndonesianFull(wibStr: string, activeTz: Timezone): string {
    if (!wibStr) return '';
    const [dPart, tPart] = wibStr.split('T');
    if (!dPart || !tPart) return '';
    const [y, m, d] = dPart.split('-').map(Number);
    const [hh, mm] = tPart.split(':').map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(hh) || isNaN(mm)) return '';

    const diffHours = TZ_OFFSETS[activeTz] - 7;
    const targetDate = new Date(Date.UTC(y, m - 1, d, hh + diffHours, mm));

    const dayName = INDONESIAN_DAYS[targetDate.getUTCDay()];
    const dateNum = targetDate.getUTCDate();
    const monthName = INDONESIAN_MONTHS[targetDate.getUTCMonth()];
    const yearNum = targetDate.getUTCFullYear();
    const timeFormatted = `${pad(targetDate.getUTCHours())}:${pad(targetDate.getUTCMinutes())}`;

    return `${dayName}, ${dateNum} ${monthName} ${yearNum} pukul ${timeFormatted} ${activeTz}`;
}

/**
 * Get time string for a specific timezone given the WIB datetime string
 */
function getTimeForTz(wibStr: string, tz: Timezone): string {
    if (!wibStr) return '';
    const { time } = wibStringToLocalInput(wibStr, tz);
    return `${time} ${tz}`;
}

interface Props {
    data: NewsFormData;
    processing: boolean;
    onDataChange: (key: keyof NewsFormData, value: unknown) => void;
    onSubmit: (status: 'draft' | 'published' | 'archived') => void;
}

export default function PublishPanel({ data, processing, onDataChange, onSubmit }: Props) {
    const [activeTimezone, setActiveTimezone] = useState<Timezone>('WIB');
    const [dateInput, setDateInput] = useState('');
    const [timeInput, setTimeInput] = useState('');

    // Sync input fields when data.published_at or activeTimezone changes
    useEffect(() => {
        if (data.published_at) {
            const { date, time } = wibStringToLocalInput(data.published_at, activeTimezone);
            setDateInput(date);
            setTimeInput(time);
        } else {
            setDateInput('');
            setTimeInput('');
        }
    }, [data.published_at, activeTimezone]);

    const handleDateChange = (newDate: string) => {
        setDateInput(newDate);
        const timeToUse = timeInput || '12:00';
        if (!timeInput) setTimeInput('12:00');
        if (newDate) {
            const wibStr = localInputToWibString(newDate, timeToUse, activeTimezone);
            onDataChange('published_at', wibStr);
        } else {
            onDataChange('published_at', '');
        }
    };

    const handleTimeChange = (newTime: string) => {
        setTimeInput(newTime);
        if (dateInput && newTime) {
            const wibStr = localInputToWibString(dateInput, newTime, activeTimezone);
            onDataChange('published_at', wibStr);
        }
    };

    const handleTimezoneChange = (newTz: Timezone) => {
        setActiveTimezone(newTz);
        // If there's already a published_at value, re-calculate local date and time inputs for the new timezone
        if (data.published_at) {
            const { date, time } = wibStringToLocalInput(data.published_at, newTz);
            setDateInput(date);
            setTimeInput(time);
        }
    };

    const setNow = () => {
        const now = new Date();
        // Get current UTC time and convert to selected Indonesian timezone
        const utcEpoch = now.getTime() + now.getTimezoneOffset() * 60000;
        const targetEpoch = utcEpoch + TZ_OFFSETS[activeTimezone] * 3600000;
        const targetDate = new Date(targetEpoch);

        const dStr = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(targetDate.getDate())}`;
        const tStr = `${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;

        setDateInput(dStr);
        setTimeInput(tStr);
        const wibStr = localInputToWibString(dStr, tStr, activeTimezone);
        onDataChange('published_at', wibStr);
    };

    const addHours = (hours: number) => {
        const baseDate = data.published_at
            ? (() => {
                const [dPart, tPart] = data.published_at.split('T');
                const [y, m, d] = dPart.split('-').map(Number);
                const [hh, mm] = tPart.split(':').map(Number);
                return new Date(Date.UTC(y, m - 1, d, hh, mm));
            })()
            : new Date();

        baseDate.setHours(baseDate.getHours() + hours);
        const y = baseDate.getFullYear();
        const m = pad(baseDate.getMonth() + 1);
        const d = pad(baseDate.getDate());
        const hh = pad(baseDate.getHours());
        const mm = pad(baseDate.getMinutes());
        const newWibStr = `${y}-${m}-${d}T${hh}:${mm}`;

        onDataChange('published_at', newWibStr);
    };

    const clearPublishedAt = () => {
        setDateInput('');
        setTimeInput('');
        onDataChange('published_at', '');
    };

    const formattedIndonesianDate = data.published_at ? formatIndonesianFull(data.published_at, activeTimezone) : '';

    return (
        <Card className="sticky top-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Pengaturan Publikasi</span>
                    <Badge variant="outline" className="text-[10px] font-mono tracking-wider font-semibold text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400">
                        24 JAM • {activeTimezone}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* ── Status ────────────────────────────────────────────── */}
                <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold">Status Artikel</Label>
                    <Select value={data.status} onValueChange={(v: 'draft' | 'published' | 'archived') => onDataChange('status', v)}>
                        <SelectTrigger disabled={processing} className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">🗒️ Draft (Belum Tayang)</SelectItem>
                            <SelectItem value="published">✅ Tayang (Publik)</SelectItem>
                            <SelectItem value="archived">📦 Arsip (Disembunyikan)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* ── Waktu & Jam Tayang (Indonesian Timezone & 24H) ─────── */}
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold flex items-center gap-1.5">
                            <Clock className="size-3.5 text-red-600" />
                            Jadwal & Jam Tayang
                        </Label>
                        {data.published_at && (
                            <button
                                type="button"
                                onClick={clearPublishedAt}
                                className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                            >
                                <RotateCcw className="size-3" />
                                Reset Otomatis
                            </button>
                        )}
                    </div>

                    {/* Timezone Selector Pills */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Pilih Zona Waktu:</span>
                            <span className="font-semibold text-foreground">{TZ_CONFIG[activeTimezone].full}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-background border">
                            {(['WIB', 'WITA', 'WIT'] as Timezone[]).map((tz) => (
                                <button
                                    key={tz}
                                    type="button"
                                    onClick={() => handleTimezoneChange(tz)}
                                    disabled={processing}
                                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                                        activeTimezone === tz
                                            ? 'bg-red-600 text-white shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                                >
                                    {tz}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & 24h Time Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="grid gap-1">
                            <Label htmlFor="pub_date" className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="size-3" /> Tanggal
                            </Label>
                            <Input
                                id="pub_date"
                                type="date"
                                value={dateInput}
                                onChange={(e) => handleDateChange(e.target.value)}
                                disabled={processing}
                                className="h-9 text-xs"
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="pub_time" className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock className="size-3" /> Jam (24 Jam)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="pub_time"
                                    type="time"
                                    step="60"
                                    value={timeInput}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    disabled={processing}
                                    className="h-9 text-xs pr-12 font-mono"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground pointer-events-none">
                                    {activeTimezone}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={setNow}
                            disabled={processing}
                            className="h-7 text-[10px] gap-1 px-2 font-medium"
                        >
                            <Sparkles className="size-3 text-amber-500" />
                            Waktu Sekarang
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addHours(1)}
                            disabled={processing}
                            className="h-7 text-[10px] px-2 font-medium"
                        >
                            +1 Jam
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addHours(3)}
                            disabled={processing}
                            className="h-7 text-[10px] px-2 font-medium"
                        >
                            +3 Jam
                        </Button>
                    </div>

                    {/* Live Preview / Zone Comparison */}
                    {data.published_at ? (
                        <div className="rounded-lg bg-background/80 border p-2.5 space-y-1.5">
                            <p className="text-[11px] font-semibold text-foreground leading-snug">
                                📅 {formattedIndonesianDate}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 border-t border-border/50 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-red-500"></span>
                                    WIB: <strong className="text-foreground">{getTimeForTz(data.published_at, 'WIB')}</strong>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                    WITA: <strong className="text-foreground">{getTimeForTz(data.published_at, 'WITA')}</strong>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-blue-500"></span>
                                    WIT: <strong className="text-foreground">{getTimeForTz(data.published_at, 'WIT')}</strong>
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[11px] text-muted-foreground italic">
                            💡 Waktu tayang akan diatur otomatis ke waktu saat ini saat artikel diterbitkan.
                        </p>
                    )}
                </div>

                {/* ── Artikel Unggulan ──────────────────────────────────── */}
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

                {/* ── Ringkasan Metadata ────────────────────────────────── */}
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

                {/* ── Submit Action Buttons ─────────────────────────────── */}
                <div className="flex flex-col gap-2">
                    <Button
                        type="button"
                        className="w-full gap-2 bg-red-600 hover:bg-red-700 font-semibold"
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
