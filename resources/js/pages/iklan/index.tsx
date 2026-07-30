import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdsHeader from '@/components/iklan/ads-header';
import AdsStatsCards from '@/components/iklan/ads-stats-cards';
import AdsFilterBar from '@/components/iklan/ads-filter-bar';
import AdsEmptyState from '@/components/iklan/ads-empty-state';
import AdsDeleteDialog from '@/components/iklan/ads-delete-dialog';
import AdCard from '@/components/iklan/ad-card';
import AdsPagination from '@/components/iklan/ads-pagination';
import type { Ad, PaginatedData } from '@/components/iklan/types';

interface Props {
    ads: PaginatedData;
    filters: { status?: string; type?: string };
}

export default function AdsIndex({ ads, filters }: Props) {
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [type, setType] = useState(filters.type ?? 'all');
    const [deleteTarget, setDeleteTarget] = useState<Ad | null>(null);
    const [deleting, setDeleting] = useState(false);

    const applyFilter = (nextStatus = status, nextType = type) => {
        router.get('/iklan', {
            ...(nextStatus && nextStatus !== 'all' ? { status: nextStatus } : {}),
            ...(nextType && nextType !== 'all' ? { type: nextType } : {}),
        }, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setStatus('all');
        setType('all');
        router.get('/iklan', {}, { preserveState: false });
    };

    const deleteAd = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/iklan/${deleteTarget.id}`, {
            onFinish: () => setDeleting(false),
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const toggleAd = (ad: Ad) => {
        router.post(`/iklan/${ad.id}/toggle`, {}, { preserveScroll: true });
    };

    const hasFilter = (!!filters.status && filters.status !== 'all') || (!!filters.type && filters.type !== 'all');
    const activeCount = ads.data.filter((a) => a.is_active).length;

    return (
        <>
            <Head title="Manajemen Iklan" />

            <AdsDeleteDialog target={deleteTarget} deleting={deleting} onClose={() => setDeleteTarget(null)} onConfirm={deleteAd} />

            <div className="flex flex-col gap-6 p-4">
                <AdsHeader total={ads.total} />
                <AdsStatsCards total={ads.total} activeCount={activeCount} />

                <AdsFilterBar
                    status={status}
                    type={type}
                    hasFilter={hasFilter}
                    onStatusChange={(v) => { setStatus(v); applyFilter(v, type); }}
                    onTypeChange={(v) => { setType(v); applyFilter(status, v); }}
                    onClear={clearFilters}
                />

                {ads.data.length === 0 ? (
                    <AdsEmptyState />
                ) : (
                    <div className="space-y-3">
                        {ads.data.map((ad) => (
                            <AdCard key={ad.id} ad={ad} onToggle={toggleAd} onDelete={setDeleteTarget} />
                        ))}
                    </div>
                )}

                <AdsPagination ads={ads} />
            </div>
        </>
    );
}

AdsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Iklan', href: '/iklan' },
    ],
};
