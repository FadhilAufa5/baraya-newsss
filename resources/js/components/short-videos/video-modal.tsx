import React, { useEffect, useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    ChevronLeft, ChevronRight, Eye, Clock, X,
    Volume2, VolumeX, Play, Pause, Share2,
    Link2, CheckCheck, User, Heart, MessageCircle, Flag,
    Send, Trash2
} from 'lucide-react';

interface Comment {
    id: number;
    body: string;
    created_at: string;
    user: { name: string };
}

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
    comments?: Comment[];
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
    auth?: { user: { id: number; name: string; roles?: string[] } | null };
}

export function VideoModal({ video, videos, onClose, onPrev, onNext, auth }: VideoModalProps) {
    const ref = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const currentIndex = videos.findIndex((v) => v.id === video.id);

    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/short-videos/${video.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset('body'),
        });
    };

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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            aria-modal="true"
            role="dialog"
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute right-4 top-4 md:right-8 md:top-8 z-[110] flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all duration-200"
                aria-label="Tutup"
            >
                <X className="size-6" />
            </button>

            {/* Prev button */}
            <button
                onClick={onPrev}
                disabled={currentIndex <= 0}
                className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 flex size-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
                aria-label="Video sebelumnya"
            >
                <ChevronLeft className="size-8" />
            </button>

            {/* Next button */}
            <button
                onClick={onNext}
                disabled={currentIndex >= videos.length - 1}
                className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 flex size-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
                aria-label="Video berikutnya"
            >
                <ChevronRight className="size-8" />
            </button>

            {/* Modal Container */}
            <div className="relative flex h-[100dvh] md:h-[85vh] w-full max-w-[1000px] flex-col overflow-hidden md:rounded-[2rem] bg-black shadow-2xl md:flex-row md:border md:border-white/10 z-50">
                
                {/* Left: Video Area */}
                <div className="relative flex-1 bg-black flex items-center justify-center group overflow-hidden" onClick={togglePlay}>
                    <video
                        ref={ref}
                        key={video.id}
                        src={mediaUrl(video.video) || ''}
                        muted={muted}
                        playsInline
                        loop
                        autoPlay
                        className="h-full w-full object-contain"
                    />

                    {/* Gradient overlays */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play/Pause indicator */}
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex size-24 items-center justify-center rounded-full bg-black/40 backdrop-blur-md ring-2 ring-white/20 shadow-2xl animate-in zoom-in-75 duration-200">
                                <Play className="size-10 fill-white text-white ml-2" />
                            </div>
                        </div>
                    )}

                    {/* Mobile Prev/Next Areas (invisible) */}
                    <div className="absolute inset-y-0 left-0 w-1/4 md:hidden" onClick={(e) => { e.stopPropagation(); onPrev(); }} />
                    <div className="absolute inset-y-0 right-0 w-1/4 md:hidden" onClick={(e) => { e.stopPropagation(); onNext(); }} />

                    {/* Controls Bar */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Mute button */}
                        <div className="flex items-center justify-between">
                            <span className="rounded-full bg-black/50 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white border border-white/10 shadow-lg">
                                {currentIndex + 1} / {videos.length}
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                                className="flex size-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10 transition-colors pointer-events-auto shadow-lg"
                                aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'}
                            >
                                {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div
                        className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 cursor-pointer pointer-events-auto group-hover:h-2 transition-all"
                        onClick={(e) => { e.stopPropagation(); seekTo(e); }}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="flex w-full flex-col bg-white dark:bg-gray-950 md:w-[400px] shrink-0 overflow-y-auto">
                    {/* Header: Author Info */}
                    <div className="flex items-center gap-3 p-5 pb-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold text-lg shrink-0">
                            {(video.user?.name ?? 'K').slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">
                                    {video.user?.name ?? 'kumparanNEWS'}
                                </span>
                                <CheckCheck className="size-3.5 text-blue-500" />
                            </div>
                            <div className="text-xs text-gray-500 font-medium mt-0.5">
                                {video.published_at ? new Date(video.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '22 Jul 2026'}
                            </div>
                        </div>
                    </div>

                    {/* Content: Title & Desc */}
                    <div className="px-5 pb-3">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                            {video.title}
                        </h1>
                        {video.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {video.description}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-5 px-5 py-3 border-y border-gray-100 dark:border-gray-800">
                        <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors">
                            <Heart className="size-5" /> <span className="text-sm font-semibold">1</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                            <MessageCircle className="size-5" /> <span className="text-sm font-semibold">{video.comments?.length || 0}</span>
                        </button>
                        <button onClick={copyLink} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-500 transition-colors">
                            <Share2 className="size-5" /> <span className="text-sm font-semibold">{copied ? 'Disalin' : 'Bagikan'}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ml-auto">
                            <Flag className="size-4" />
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="flex-1 p-5 bg-gray-50/50 dark:bg-gray-950">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
                            <span className="w-1.5 h-5 bg-red-600 rounded-sm"></span>
                            Komentar ({video.comments?.length || 0})
                        </h3>

                        {/* Comment Form */}
                        {auth?.user ? (
                            <form onSubmit={submitComment} className="mb-6 space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-black text-xs">
                                        {auth.user.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Tulis komentar..."
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 shadow-sm transition-all"
                                            rows={2}
                                            maxLength={500}
                                        />
                                        {errors.body && (
                                            <p className="mt-1 text-xs text-red-500">{errors.body}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing || data.body.trim().length < 3}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="size-3.5" />
                                        Kirim
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mb-6 rounded-xl border border-dashed border-gray-200 p-4 text-center dark:border-gray-800 bg-white dark:bg-gray-900">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                    Silakan masuk untuk mengirim komentar.
                                </p>
                                <a
                                    href="/auth/google/redirect"
                                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <User className="size-3.5" />
                                    Masuk
                                </a>
                            </div>
                        )}

                        {/* Actual Comments List */}
                        {video.comments && video.comments.length > 0 ? (
                            video.comments.map(comment => (
                                <div key={comment.id} className="flex gap-3 mb-5">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-[#8b5cf6] text-white font-semibold text-sm shrink-0">
                                        {(comment.user?.name || '?').slice(0, 1).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{comment.user?.name || 'Anonim'}</div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-1.5 leading-snug">
                                            {comment.body}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 font-semibold">
                                            <span>{timeAgo(comment.created_at)}</span>
                                            <span className="hidden sm:inline">·</span>
                                            <button className="hover:text-gray-900 dark:hover:text-white transition-colors">Suka</button>
                                            <span className="hidden sm:inline">·</span>
                                            <button className="hover:text-gray-900 dark:hover:text-white transition-colors">Balas</button>
                                            <span className="hidden sm:inline">·</span>
                                            <button className="hover:text-gray-900 dark:hover:text-white transition-colors">Laporkan</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-sm text-gray-500 my-8">
                                Belum ada komentar. Jadilah yang pertama!
                            </div>
                        )}

                        {/* End of comments indicator */}
                        <div className="flex items-center justify-center gap-2 text-gray-400 py-6">
                            <CheckCheck className="size-4 text-green-500" />
                            <span className="text-xs font-medium">Sudah ditampilkan semua</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

