import React, { useEffect, useRef, useState } from 'react';
import {
    ChevronLeft, ChevronRight, Eye, Clock, X,
    Volume2, VolumeX, Play, Pause, Share2,
    Link2, CheckCheck, User,
} from 'lucide-react';

interface ShortVideo {
    id: number;
    title: string;
    description: string | null;
    video: string;
    thumbnail: string | null;
    status: string;
    published_at: string | null;
    views: number;
    user?: { name: string };
    created_at: string;
}

function mediaUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) {
        return path;
    }
    return `/storage/${path}`;
}

function formatViews(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}Rb`;
    return String(n);
}

function timeAgo(value: string | null) {
    if (!value) return 'Belum tayang';
    const diff = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface VideoModalProps {
    video: ShortVideo;
    videos: ShortVideo[];
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export function VideoModal({ video, videos, onClose, onPrev, onNext }: VideoModalProps) {
    const ref = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const currentIndex = videos.findIndex((v) => v.id === video.id);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === ' ') { e.preventDefault(); togglePlay(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, onPrev, onNext, playing]);

    useEffect(() => {
        if (ref.current) {
            ref.current.currentTime = 0;
            ref.current.play().catch(() => {});
            setPlaying(true);
            setProgress(0);
        }
    }, [video.id]);

    useEffect(() => {
        const vid = ref.current;
        if (!vid) return;
        const onTime = () => {
            if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
        };
        vid.addEventListener('timeupdate', onTime);
        return () => vid.removeEventListener('timeupdate', onTime);
    }, [video.id]);

    const togglePlay = () => {
        if (!ref.current) return;
        if (playing) ref.current.pause();
        else ref.current.play().catch(() => {});
        setPlaying(!playing);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || !ref.current.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        ref.current.currentTime = pct * ref.current.duration;
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
            aria-modal="true"
            role="dialog"
        >
            {/* Blurred ambient background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-700/10 blur-[120px]" />
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all duration-200 border border-white/10"
                aria-label="Tutup"
            >
                <X className="size-5" />
            </button>

            {/* Prev button */}
            <button
                onClick={onPrev}
                disabled={currentIndex <= 0}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Video sebelumnya"
            >
                <ChevronLeft className="size-6" />
            </button>

            {/* Next button */}
            <button
                onClick={onNext}
                disabled={currentIndex >= videos.length - 1}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Video berikutnya"
            >
                <ChevronRight className="size-6" />
            </button>

            {/* Video + Info Container */}
            <div className="relative flex h-[94vh] max-w-sm w-full flex-col overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/8">

                {/* Video Area */}
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

                    {/* Gradient overlays */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    {/* Play/Pause indicator */}
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex size-20 items-center justify-center rounded-full bg-black/40 backdrop-blur-md ring-2 ring-white/20 shadow-2xl animate-in zoom-in-75 duration-200">
                                <Play className="size-9 fill-white text-white ml-1" />
                            </div>
                        </div>
                    )}

                    {/* Top bar: counter + mute */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white border border-white/10">
                            {currentIndex + 1} / {videos.length}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                            className="flex size-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10 transition-colors pointer-events-auto"
                            aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'}
                        >
                            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div
                        className="absolute bottom-0 inset-x-0 h-1 bg-white/20 cursor-pointer pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); seekTo(e); }}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Bottom Info Panel */}
                <div className="bg-gradient-to-b from-gray-950 to-gray-900 border-t border-white/5 px-4 pt-3.5 pb-4 flex flex-col gap-2.5">
                    {/* Author + share row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-full bg-red-600 text-white font-black text-[10px] shrink-0">
                                {(video.user?.name ?? 'B').slice(0, 1).toUpperCase()}
                            </div>
                            <span className="text-[11px] font-bold text-gray-200 truncate max-w-[120px]">
                                {video.user?.name ?? 'Redaksi Baraya'}
                            </span>
                        </div>
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-bold text-gray-200 hover:bg-white/15 transition-colors"
                        >
                            {copied ? <CheckCheck className="size-3 text-green-400" /> : <Link2 className="size-3" />}
                            {copied ? 'Disalin!' : 'Salin Link'}
                        </button>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm font-extrabold leading-snug text-white line-clamp-2">{video.title}</h2>

                    {/* Description */}
                    {video.description && (
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{video.description}</p>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                            <Eye className="size-3 text-gray-400" />
                            <span className="text-gray-300 font-semibold">{formatViews(video.views ?? 0)}</span>
                            <span>views</span>
                        </span>
                        <span className="text-gray-700">·</span>
                        <span className="flex items-center gap-1">
                            <Clock className="size-3 text-gray-400" />
                            <span>{timeAgo(video.published_at)}</span>
                        </span>
                    </div>

                    {/* Keyboard hint */}
                    {/* <div className="flex items-center justify-center gap-3 pt-1">
                        {[['←', 'Prev'], ['Spasi', 'Play/Pause'], ['→', 'Next'], ['Esc', 'Tutup']].map(([key, label]) => (
                            <span key={key} className="flex items-center gap-1 text-[9px] text-gray-600">
                                <kbd className="rounded bg-white/8 border border-white/10 px-1.5 py-0.5 font-mono text-gray-400">{key}</kbd>
                                <span>{label}</span>
                            </span>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    );
}
