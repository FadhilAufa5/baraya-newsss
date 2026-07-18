import React, { useEffect, useRef, useState } from 'react';
import { Eye, Clock, Play, TrendingUp } from 'lucide-react';

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

function mediaUrl(path: string) {
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
    if (diff < 60) return `${diff}d lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface VideoCardProps {
    video: ShortVideo;
    onSelect: (video: ShortVideo) => void;
    featured?: boolean;
}

export function VideoCard({ video, onSelect, featured = false }: VideoCardProps) {
    const ref = useRef<HTMLVideoElement>(null);
    const [hovered, setHovered] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (hovered) {
            ref.current?.play().catch(() => {});
        } else {
            ref.current?.pause();
            if (ref.current) ref.current.currentTime = 0;
        }
    }, [hovered]);

    return (
        <div
            className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-gray-900 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30"
            style={{ aspectRatio: '9/16' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onSelect(video)}
            role="button"
            aria-label={`Tonton video: ${video.title}`}
        >
            {/* Thumbnail */}
            {video.thumbnail ? (
                <img
                    src={mediaUrl(video.thumbnail)}
                    alt={video.title}
                    onLoad={() => setLoaded(true)}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`} />
            )}

            {/* Video Preview */}
            <video
                ref={ref}
                src={mediaUrl(video.video)}
                muted
                playsInline
                loop
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 pointer-events-none" />
            <div className={`absolute inset-0 bg-gradient-to-t from-red-950/40 to-transparent pointer-events-none transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

            {/* Top badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                    SHORT
                </span>
                {hovered && (
                    <span className="rounded-full bg-red-600/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-white flex items-center gap-1 animate-pulse">
                        <span className="size-1.5 rounded-full bg-white inline-block" />
                        LIVE PREVIEW
                    </span>
                )}
            </div>

            {/* Play button */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                <div className="flex size-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-2 ring-white/30 shadow-lg group-hover:ring-white/60 transition-all duration-300">
                    <Play className="size-6 fill-white text-white ml-0.5" />
                </div>
            </div>

            {/* Bottom info */}
            <div className="absolute inset-x-0 bottom-0 p-3.5">
                <h3 className="line-clamp-2 text-xs font-extrabold leading-tight text-white drop-shadow-lg mb-2">
                    {video.title}
                </h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] text-gray-300/90">
                        <span className="flex items-center gap-0.5">
                            <Eye className="size-2.5" />
                            {formatViews(video.views ?? 0)}
                        </span>
                        <span className="text-gray-500">·</span>
                        <span className="flex items-center gap-0.5">
                            <Clock className="size-2.5" />
                            {timeAgo(video.published_at)}
                        </span>
                    </div>
                    {video.user && (
                        <span className="text-[8px] text-gray-400 font-semibold truncate max-w-[60px]">
                            {video.user.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Hover border glow */}
            <div className={`absolute inset-0 rounded-2xl ring-2 pointer-events-none transition-all duration-300 ${hovered ? 'ring-red-500/60 shadow-inner' : 'ring-white/5'}`} />
        </div>
    );
}
