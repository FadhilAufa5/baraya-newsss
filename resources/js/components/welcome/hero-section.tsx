import React from 'react';
import { Clock, Eye } from 'lucide-react';
import { CategoryBadge } from './category-badge';
import { GradientPlaceholder } from './gradient-placeholder';

interface Article {
    id: number;
    category: string;
    title: string;
    excerpt?: string;
    author?: string;
    published_at: string;
    views?: number;
    reading_time?: number;
    image?: string | null;
    slug?: string;
}

interface HeroSectionProps {
    heroArticle: Article;
    sideArticles: Article[];
}

export function HeroSection({ heroArticle, sideArticles }: HeroSectionProps) {
    return (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Hero Article */}
            <div className="lg:col-span-2 group relative overflow-hidden rounded-xl shadow-md cursor-pointer">
                <div className="aspect-video w-full">
                    <GradientPlaceholder category={heroArticle.category} className="w-full h-full" />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <CategoryBadge category={heroArticle.category} />
                    <h2 className="mt-2 text-2xl font-extrabold leading-tight text-white group-hover:text-red-200 transition-colors sm:text-3xl line-clamp-3">
                        {heroArticle.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-300 line-clamp-2 hidden sm:block">
                        {heroArticle.excerpt}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {heroArticle.published_at}
                        </span>
                        {heroArticle.views !== undefined && (
                            <span className="flex items-center gap-1">
                                <Eye className="size-3" />
                                {heroArticle.views.toLocaleString('id-ID')} views
                            </span>
                        )}
                        {heroArticle.reading_time !== undefined && (
                            <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {heroArticle.reading_time} mnt baca
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Articles */}
            <div className="flex flex-col gap-3">
                {sideArticles.map((art) => (
                    <div key={art.id} className="group flex gap-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-24 shrink-0 sm:w-28">
                            <GradientPlaceholder category={art.category} className="w-full h-full min-h-[80px]" />
                        </div>
                        <div className="flex flex-col justify-center py-3 pr-3 gap-1.5">
                            <CategoryBadge category={art.category} size="xs" />
                            <h3 className="text-sm font-bold leading-tight text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 transition-colors">
                                {art.title}
                            </h3>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="size-2.5" />
                                {art.published_at}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
