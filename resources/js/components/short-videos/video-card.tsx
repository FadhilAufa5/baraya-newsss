import React, { useEffect, useRef, useState } from 'react';
import { Eye, Clock } from 'lucide-react';

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

function formatDate(value: string | null) {
    if (!value) return 'Belum tayang';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

interface VideoCardProps {
    video: ShortVideo;
    onSelect: (video: ShortVideo) => void;
}

export function VideoCard({ video, onSelect }: VideoCardProps) {
    const ref = useRef<HTMLVideoElement>(null);
    const [hovered, setHovered] = useState(false);

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
            className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            style={{ aspectRatio: '9/16' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onSelect(video)}
            role="button"
            aria-label={`Tonton video: ${video.title}`}
        >
            {video.thumbnail ? (
                <img
                    src={mediaUrl(video.thumbnail)}
                    alt={video.title}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
                />
            ) : (
                <div
                    className={`absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-900 transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
                />
            )}

            <video
                ref={ref}
                src={mediaUrl(video.video)}
                muted
                playsInline
                loop
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {!hovered && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/40 transition-transform group-hover:scale-110">
                        <svg className="size-5 fill-white text-white ml-0.5 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            )}

            {hovered && (
                <div className="absolute top-2 left-2 rounded bg-red-600/90 px-2 py-0.5 text-[9px] font-bold text-white flex items-center gap-1">
                    <div className="size-1.5 rounded-full bg-white animate-pulse" />
                    Pratinjau
                </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="line-clamp-2 text-xs font-bold leading-tight text-white drop-shadow-lg mb-1">
                    {video.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[9px] text-gray-300">
                    <Eye className="size-2.5" />
                    <span>{formatViews(video.views ?? 0)}</span>
                    <span className="text-gray-500">·</span>
                    <Clock className="size-2.5" />
                    <span>{formatDate(video.published_at)}</span>
                </div>
            </div>

            <div className="absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-sm">
                Short
            </div>
        </div>
    );
}
