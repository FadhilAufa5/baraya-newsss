import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    // Handle Inertia::flash() calls from controllers
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            toast[data.type](data.message);
        });
    }, []);

    // Handle session flash from redirects (e.g., RestrictGmailUsers middleware, OAuthController)
    const { flash } = usePage().props as { flash?: { toast?: FlashToast } };

    useEffect(() => {
        if (!flash?.toast) return;
        toast[flash.toast.type](flash.toast.message);
    }, [flash]);
}
