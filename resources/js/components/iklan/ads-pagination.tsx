import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginatedData } from './types';

interface Props {
    ads: PaginatedData;
}

export default function AdsPagination({ ads }: Props) {
    if (ads.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2">
            {ads.links.map((link, i) => {
                if (!link.url) return null;
                const label = link.label.replace('&laquo;', '‹').replace('&raquo;', '›');
                return (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => link.url && router.get(link.url)}
                        className="min-w-9 rounded-lg px-2 text-xs"
                    >
                        {label}
                    </Button>
                );
            })}
        </div>
    );
}
