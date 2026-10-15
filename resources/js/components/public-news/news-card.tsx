import React from 'react';
import { Check, Clock, Eye, Share2 } from 'lucide-react';
import { CategoryBadge } from '@/components/welcome/category-badge';
import { GradientPlaceholder } from '@/components/welcome/gradient-placeholder';
import { imageUrl } from '@/lib/utils';
import { Article, formatDate, formatDateShort } from './types';

interface NewsCardProps {
    article: Article;
    viewMode: 'grid' | 'list';
    copiedId: number | null;
    onShare: (slug: string, id: number) => void;
}

export function NewsCard({
    article,
    viewMode,
    copiedId,
    onShare,
}: NewsCardProps) {
    const img = imageUrl(article.image);
    const authorName = article.author ?? article.user?.name ?? 'Redaksi';
    const isCopied = copiedId === article.id;

    if (viewMode === 'list') {
        return (
            <article className="group flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl bg-white dark:bg-gray-800 p-4 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs hover:shadow-md transition-all duration-300">
                {/* Thumbnail */}
                <a
                    href={`/news/${article.slug}`}
                    className="relative aspect-video sm:aspect-square w-full sm:w-48 sm:h-36 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
                >
                    {img ? (
                        <img
                            src={img}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <GradientPlaceholder
                            category={article.category}
                            className="h-full w-full"
                        />
                    )}
                    <div className="absolute top-2 left-2 z-10">
                        <CategoryBadge category={article.category} size="xs" />
                    </div>
                </a>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                        <h2 className="text-base sm:text-lg font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                            <a href={`/news/${article.slug}`}>
                                {article.title}
                            </a>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {authorName}
                            </span>
                            <span>•</span>
                            <span>{formatDate(article.published_at)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs">
                                <Eye className="size-3.5 text-gray-400" />
                                {article.views.toLocaleString('id-ID')}
                            </span>
                            {article.reading_time > 0 && (
                                <span>{article.reading_time} mnt baca</span>
                            )}
                            <button
                                onClick={() => onShare(article.slug, article.id)}
                                className="hover:text-red-600 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                title="Salin Tautan Berita"
                                aria-label="Salin tautan berita"
                            >
                                {isCopied ? (
                                    <Check className="size-3.5 text-emerald-600" />
                                ) : (
                                    <Share2 className="size-3.5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // Grid View Card
    return (
        <article className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div>
                {/* Thumbnail Container */}
                <a
                    href={`/news/${article.slug}`}
                    className="relative block aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-700"
                >
                    {img ? (
                        <img
                            src={img}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <GradientPlaceholder
                            category={article.category}
                            className="h-full w-full"
                        />
                    )}
                    <div className="absolute top-2.5 left-2.5 z-10">
                        <CategoryBadge category={article.category} size="xs" />
                    </div>
                    {article.reading_time > 0 && (
                        <div className="absolute top-2.5 right-2.5 z-10 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-white">
                            {article.reading_time} mnt baca
                        </div>
                    )}
                </a>

                {/* Content Info */}
                <div className="p-4 space-y-2">
                    <h2 className="text-sm sm:text-base font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                        <a href={`/news/${article.slug}`}>
                            {article.title}
                        </a>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                    </p>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                        {authorName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 shrink-0">
                        <Clock className="size-2.5" />
                        {formatDateShort(article.published_at)}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-[10px]">
                        <Eye className="size-3 text-gray-400" />
                        {article.views.toLocaleString('id-ID')}
                    </span>
                    <button
                        onClick={() => onShare(article.slug, article.id)}
                        className="hover:text-red-600 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        title="Salin Tautan Berita"
                        aria-label="Salin tautan berita"
                    >
                        {isCopied ? (
                            <Check className="size-3 text-emerald-600" />
                        ) : (
                            <Share2 className="size-3" />
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}
