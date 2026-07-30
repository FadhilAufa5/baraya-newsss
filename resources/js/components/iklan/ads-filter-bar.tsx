import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    status: string;
    type: string;
    hasFilter: boolean;
    onStatusChange: (v: string) => void;
    onTypeChange: (v: string) => void;
    onClear: () => void;
}

export default function AdsFilterBar({ status, type, hasFilter, onStatusChange, onTypeChange, onClear }: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full sm:w-44 rounded-xl">
                    <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
            </Select>
            <Select value={type} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full sm:w-44 rounded-xl">
                    <SelectValue placeholder="Semua Tipe" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="leaderboard">Leaderboard</SelectItem>
                    <SelectItem value="in-feed">In-Feed</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                </SelectContent>
            </Select>
            {hasFilter && (
                <Button variant="ghost" onClick={onClear} className="gap-2 rounded-xl">
                    <X className="size-4" />
                    Reset
                </Button>
            )}
        </div>
    );
}
