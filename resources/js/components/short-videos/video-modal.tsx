import React, { useEffect, useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    ChevronLeft, ChevronRight, Eye, Clock, X,
    Volume2, VolumeX, Play, Pause, Share2,
    Link2, CheckCheck, User, Heart, MessageCircle, Flag,
    Send, Trash2, ChevronDown, Music
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
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(false);
    const currentIndex = videos.findIndex((v) => v.id === video.id);

    const [viewCount, setViewCount] = useState(video.views);
    const viewedRef = useRef<Set<number>>(new Set());

    const touchStartY = useRef<number | null>(null);
    const lastWheelTime = useRef<number>(0);

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

    // Touch Swipe Gesture for Mobile (TikTok / Reels style)
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY.current === null || showComments) return;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY.current - touchEndY;

        // Minimum swipe threshold: 40px
        if (deltaY > 40) {
            onNext(); // Swiped UP -> Next video
        } else if (deltaY < -40) {
            onPrev(); // Swiped DOWN -> Previous video
        }
        touchStartY.current = null;
    };

    // Mouse / Trackpad Wheel Scroll Gesture (TikTok / Reels style)
    const handleWheel = (e: React.WheelEvent) => {
        if (showComments) return;
        const now = Date.now();
        if (now - lastWheelTime.current < 450) return; // 450ms cooldown to prevent rapid skipping

        if (e.deltaY > 25) {
            lastWheelTime.current = now;
            onNext(); // Scrolled DOWN -> Next video
        } else if (e.deltaY < -25) {
            lastWheelTime.current = now;
            onPrev(); // Scrolled UP -> Previous video
        }
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showComments) {
                    setShowComments(false);
                } else {
                    onClose();
                }
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') onPrev();
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') onNext();
            if (e.key === ' ') { e.preventDefault(); togglePlay(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, onPrev, onNext, playing, showComments]);

    useEffect(() => {
        if (ref.current) {
            ref.current.currentTime = 0;
            ref.current.play().catch(() => {});
            setPlaying(true);
            setProgress(0);
        }
        setShowComments(false);
        setViewCount(video.views);

        if (!viewedRef.current.has(video.id)) {
            viewedRef.current.add(video.id);
            setViewCount((prev) => prev + 1);
            router.post(`/short-videos/${video.id}/views`, {}, {
                preserveState: true,
                preserveScroll: true,
            });
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

    const commentCount = video.comments?.length || 0;

    // ─── COMMENT LIST (reused in mobile bottom sheet + desktop sidebar) ───
    const CommentList = () => (
        <>
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
                                <span>·</span>
                                <button className="hover:text-gray-900 dark:hover:text-white transition-colors">Suka</button>
                                <span>·</span>
                                <button className="hover:text-gray-900 dark:hover:text-white transition-colors">Balas</button>
                                <span>·</span>
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
        </>
    );

    const CommentForm = () => (
        <>
            {auth?.user ? (
                <form onSubmit={submitComment} className="space-y-3">
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
                <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center dark:border-gray-800 bg-white dark:bg-gray-900">
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
        </>
    );

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm md:p-4 touch-none"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            aria-modal="true"
            role="dialog"
        >
            {/* Close button — top-left on mobile, top-right on desktop */}
            <button
                onClick={onClose}
                className="absolute left-3 top-3 md:right-8 md:top-8 md:left-auto z-[110] flex size-10 md:size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all duration-200"
                aria-label="Tutup"
            >
                <X className="size-5 md:size-6" />
            </button>

            {/* Prev button — desktop only */}
            <button
                onClick={onPrev}
                disabled={currentIndex <= 0}
                className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 flex size-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
                aria-label="Video sebelumnya"
            >
                <ChevronLeft className="size-8" />
            </button>

            {/* Next button — desktop only */}
            <button
                onClick={onNext}
                disabled={currentIndex >= videos.length - 1}
                className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 flex size-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
                aria-label="Video berikutnya"
            >
                <ChevronRight className="size-8" />
            </button>

            {/* ─── MODAL CONTAINER ─────────────────────────────────── */}
            <div
                className="relative flex h-[100dvh] md:h-[85vh] w-full max-w-[1000px] flex-col overflow-hidden md:rounded-[2rem] bg-black shadow-2xl md:flex-row md:border md:border-white/10 z-50"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
            >
                
                {/* ─── LEFT: VIDEO AREA ─────────────────────────────── */}
                <div className="relative flex-1 bg-black flex items-center justify-center group overflow-hidden" onClick={togglePlay}>
                    <video
                        ref={ref}
                        key={video.id}
                        src={mediaUrl(video.video) || ''}
                        muted={muted}
                        playsInline
                        loop
                        autoPlay
                        className="h-full w-full object-contain pointer-events-none"
                    />

                    {/* Gradient overlays — always visible on mobile, hover on desktop */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 md:from-black/60 md:via-transparent md:to-black/20 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play/Pause indicator */}
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex size-20 md:size-24 items-center justify-center rounded-full bg-black/40 backdrop-blur-md ring-2 ring-white/20 shadow-2xl animate-in zoom-in-75 duration-200">
                                <Play className="size-8 md:size-10 fill-white text-white ml-1.5" />
                            </div>
                        </div>
                    )}

                    {/* ─── MOBILE: TikTok-style Action Buttons (right side) ─── */}
                    <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 md:hidden z-20" onClick={(e) => e.stopPropagation()}>
                        {/* Author Avatar */}
                        <div className="relative mb-2">
                            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold text-lg ring-2 ring-white shadow-lg">
                                {(video.user?.name ?? 'B').slice(0, 1).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex size-5 items-center justify-center rounded-full bg-red-600 ring-2 ring-black">
                                <span className="text-white text-[10px] font-black">+</span>
                            </div>
                        </div>

                        {/* Like */}
                        <button
                            onClick={() => setLiked(!liked)}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className={`flex size-11 items-center justify-center rounded-full transition-all duration-300 ${liked ? 'bg-red-500/20 scale-110' : 'bg-white/10 backdrop-blur-sm'}`}>
                                <Heart className={`size-6 transition-all duration-300 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />
                            </div>
                            <span className="text-[11px] font-bold text-white drop-shadow-lg">
                                {liked ? formatViews((viewCount ?? 0) + 1) : formatViews(viewCount ?? 0)}
                            </span>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={() => setShowComments(true)}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="flex size-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm active:scale-90 transition-transform">
                                <MessageCircle className="size-6 text-white" />
                            </div>
                            <span className="text-[11px] font-bold text-white drop-shadow-lg">{commentCount}</span>
                        </button>

                        {/* Share */}
                        <button
                            onClick={() => copyLink()}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className={`flex size-11 items-center justify-center rounded-full backdrop-blur-sm active:scale-90 transition-all ${copied ? 'bg-green-500/30' : 'bg-white/10'}`}>
                                {copied ? <CheckCheck className="size-5 text-green-400" /> : <Share2 className="size-6 text-white" />}
                            </div>
                            <span className="text-[11px] font-bold text-white drop-shadow-lg">
                                {copied ? 'Disalin!' : 'Bagikan'}
                            </span>
                        </button>

                        {/* Mute */}
                        <button
                            onClick={() => setMuted(!muted)}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="flex size-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm active:scale-90 transition-transform">
                                {muted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
                            </div>
                        </button>
                    </div>

                    {/* ─── MOBILE: Video Info Overlay (bottom left) ─── */}
                    <div className="absolute left-0 right-16 bottom-6 px-4 md:hidden z-10" onClick={(e) => e.stopPropagation()}>
                        {/* Author */}
                        <div className="flex items-center gap-2 mb-2.5">
                            <span className="font-extrabold text-white text-sm drop-shadow-lg">
                                @{(video.user?.name ?? 'barayanews').toLowerCase().replace(/\s+/g, '')}
                            </span>
                            <CheckCheck className="size-3.5 text-blue-400" />
                            <span className="text-[10px] text-white/60 font-medium">
                                · {timeAgo(video.published_at)}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-white text-sm font-bold leading-snug drop-shadow-lg mb-1.5 line-clamp-2">
                            {video.title}
                        </h2>

                        {/* Description */}
                        {video.description && (
                            <p className="text-white/80 text-xs leading-relaxed drop-shadow-md line-clamp-2 mb-2">
                                {video.description}
                            </p>
                        )}

                        {/* Views + Music ticker */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-semibold">
                                <Eye className="size-3" />
                                <span>{formatViews(viewCount ?? 0)} tayangan</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
                                <Music className="size-3" />
                                <span className="truncate max-w-[140px]">Baraya News — Original</span>
                            </div>
                        </div>
                    </div>

                    {/* ─── MOBILE: Navigation indicator & Swipe Hint ─── */}
                    <div className="absolute top-3 right-3 md:hidden z-10 flex items-center gap-2">
                        <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white/80">
                            {currentIndex + 1} / {videos.length}
                        </span>
                    </div>

                    {/* Desktop Controls Bar */}
                    <div className="absolute bottom-6 left-6 right-6 flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
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
                        className="absolute bottom-0 inset-x-0 h-1 md:h-1.5 bg-white/20 cursor-pointer pointer-events-auto md:group-hover:h-2 transition-all z-30"
                        onClick={(e) => { e.stopPropagation(); seekTo(e); }}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* ─── RIGHT: DESKTOP SIDEBAR (hidden on mobile) ─────── */}
                <div className="hidden md:flex w-full flex-col bg-white dark:bg-gray-950 md:w-[400px] shrink-0 overflow-y-auto">
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
                            <MessageCircle className="size-5" /> <span className="text-sm font-semibold">{commentCount}</span>
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
                            Komentar ({commentCount})
                        </h3>

                        {/* Comment Form */}
                        <div className="mb-6">
                            <CommentForm />
                        </div>

                        {/* Actual Comments List */}
                        <CommentList />

                        {/* End of comments indicator */}
                        <div className="flex items-center justify-center gap-2 text-gray-400 py-6">
                            <CheckCheck className="size-4 text-green-500" />
                            <span className="text-xs font-medium">Sudah ditampilkan semua</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MOBILE: COMMENT BOTTOM SHEET ─────────────────── */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[200] md:hidden transition-opacity duration-300 ${
                    showComments ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setShowComments(false)}
            />

            {/* Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[210] md:hidden transition-transform duration-300 ease-out ${
                    showComments ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ maxHeight: '70dvh' }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
            >
                <div className="bg-white dark:bg-gray-950 rounded-t-[1.5rem] shadow-2xl flex flex-col overflow-hidden" style={{ height: '70dvh' }}>
                    {/* Drag Handle + Header */}
                    <div className="pt-3 pb-2 px-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        {/* Drag handle */}
                        <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-3" />

                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-1 h-4 bg-red-600 rounded-sm"></span>
                                Komentar ({commentCount})
                            </h3>
                            <button
                                onClick={() => setShowComments(false)}
                                className="flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable comments */}
                    <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
                        <CommentList />

                        {/* End of comments */}
                        <div className="flex items-center justify-center gap-2 text-gray-400 py-4">
                            <CheckCheck className="size-4 text-green-500" />
                            <span className="text-xs font-medium">Sudah ditampilkan semua</span>
                        </div>
                    </div>

                    {/* Fixed comment input at bottom */}
                    <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
                        {auth?.user ? (
                            <form onSubmit={submitComment} className="flex items-center gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-black text-xs">
                                    {auth.user.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder="Tulis komentar..."
                                        className="w-full rounded-full border border-gray-200 bg-gray-50 pl-4 pr-12 py-2.5 text-sm text-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 transition-all"
                                        maxLength={500}
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing || data.body.trim().length < 3}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Send className="size-3.5" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <a
                                href="/auth/google/redirect"
                                className="flex items-center justify-center gap-2 w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            >
                                <User className="size-4" />
                                Masuk untuk berkomentar
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
