import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Clock, X, Volume2, VolumeX, Play } from 'lucide-react';

interface ShortVideo {
    id: number;
    title: string;
    description: string | null;
    video: string;
    thumbnail: string | null;
    status: string;
    published_at: string | null;
    views: number;
    // user?: { name: string };
    created_at: string;
}

function mediaUrl(path: string) {
    return `/storage/${path}`;
}

function formatViews(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}Rb`;
    return String(n);
}

function formatDate(value: string | null) {
    if (!value) return 'Belum tayang';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

interface VideoModalProps {
    video: ShortVideo;
    videos: ShortVideo[];
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export function VideoModal({
    video,
    videos,
    onClose,
    onPrev,
    onNext,
}: VideoModalProps) {
    const ref = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(false);
    const [playing, setPlaying] = useState(true);
    const currentIndex = videos.findIndex((v) => v.id === video.id);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, onPrev, onNext]);

    useEffect(() => {
        if (ref.current) {
            ref.current.currentTime = 0;
            ref.current.play().catch(() => {});
            setPlaying(true);
        }
    }, [video.id]);

    const togglePlay = () => {
        if (!ref.current) return;
        if (playing) {
            ref.current.pause();
        } else {
            ref.current.play().catch(() => {});
        }
        setPlaying(!playing);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            aria-modal="true"
            role="dialog"
        >
            <button onClick={onClose} className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors" aria-label="Tutup">
                <X className="size-5" />
            </button>
            <button onClick={onPrev} disabled={currentIndex <= 0} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Sebelumnya">
                <ChevronLeft className="size-6" />
            </button>
            <button onClick={onNext} disabled={currentIndex >= videos.length - 1} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Selanjutnya">
                <ChevronRight className="size-6" />
            </button>

            <div className="relative flex h-[92vh] max-w-sm w-full flex-col overflow-hidden rounded-xl shadow-2xl">
                <div className="relative flex-1 bg-black cursor-pointer overflow-hidden" onClick={togglePlay}>
                    <video
                        ref={ref}
                        key={video.id}
                        src={mediaUrl(video.video)}
                        muted={muted}
                        playsInline
                        loop
                        autoPlay
                        className="h-full w-full object-contain"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex size-16 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
                                <Play className="size-8 fill-white text-white ml-1" />
                            </div>
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <button onClick={(e) => { e.stopPropagation(); setMuted(!muted); }} className="flex size-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors" aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'}>
                            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                        </button>
                    </div>
                    <div className="absolute top-3 left-3 rounded bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {currentIndex + 1} / {videos.length}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 flex flex-col gap-2">
                    <h2 className="text-base font-bold leading-snug text-gray-800 dark:text-white line-clamp-2">{video.title}</h2>
                    {video.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{video.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="size-3" />{formatViews(video.views ?? 0)} views</span>
                        <span className="flex items-center gap-1"><Clock className="size-3" />{formatDate(video.published_at)}</span>
                        {/* <span className="ml-auto">{video.user?.name ?? 'Redaksi'}</span> */}
                    </div>
                    <p className="text-[9px] text-gray-400 text-center">ESC untuk tutup</p>
                </div>
            </div>
        </div>
    );
}
