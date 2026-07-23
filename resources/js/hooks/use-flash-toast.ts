import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
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
    const flashRef = useRef(flash);

    useEffect(() => {
        if (!flash?.toast || flash === flashRef.current) return;
        flashRef.current = flash;
        toast[flash.toast.type](flash.toast.message);
    }, [flash]);
}
