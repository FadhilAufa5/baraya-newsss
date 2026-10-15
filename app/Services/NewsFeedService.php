<?php

namespace App\Services;

use App\Models\Ad;
use App\Models\News;
use App\Models\ShortVideo;
use Illuminate\Support\Collection;

class NewsFeedService
{
    /**
     * Get all data needed for the public welcome/homepage feed.
     */
    public function getFeedData(string $search, string $category, int $perPage = 8): array
    {
        // ── Base published query ──────────────────────────────────────────
        $base = News::published()->with('user');

        if ($search) {
            $base->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($category && $category !== 'Home' && $category !== 'Indeks') {
            $base->where('category', $category);
        }

        $isFiltering = (bool) ($search || ($category && $category !== 'Home' && $category !== 'Indeks'));

        if ($isFiltering) {
            $filteredArticles = (clone $base)
                ->latest('published_at')
                ->paginate($perPage)
                ->withQueryString();

            $heroArticle = null;
            $sideArticles = collect();
            $beritaTerbaru = collect();
            $pilihanRedaksi = null;
        } else {
            $filteredArticles = null;

            // ── Hero: 1 featured article (or most recent) ────────────────────
            $heroArticle = (clone $base)
                ->where('is_featured', true)
                ->latest('published_at')
                ->first()
                ?? (clone $base)->latest('published_at')->first();

            // ── Side: 4 articles after hero ───────────────────────────────────
            $sideArticles = (clone $base)
                ->latest('published_at')
                ->when($heroArticle, fn ($q) => $q->where('id', '!=', $heroArticle->id))
                ->limit(4)
                ->get();

            // ── Berita Terbaru: next 3 (exclude hero + side) ──────────────────
            $excludeIds = collect([$heroArticle?->id])
                ->merge($sideArticles->pluck('id'))
                ->filter()
                ->values()
                ->all();

            $beritaTerbaru = (clone $base)
                ->latest('published_at')
                ->whereNotIn('id', $excludeIds)
                ->limit(3)
                ->get();

            // ── Pilihan Redaksi: featured or most recent ──────────────────────
            $pilihanRedaksi = News::published()
                ->where('is_featured', true)
                ->when($heroArticle, fn ($q) => $q->where('id', '!=', $heroArticle?->id))
                ->latest('published_at')
                ->first()
                ?? News::published()
                ->when($heroArticle, fn ($q) => $q->where('id', '!=', $heroArticle?->id))
                ->latest('published_at')
                ->first();
        }

        // ── Berita Terpopuler: top 5 by views ─────────────────────────────
        $beritaTerpopuler = News::published()
            ->orderByDesc('views')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'published_at', 'views']);

        // ── Trending: top 3 titles by views ───────────────────────────────
        $trendingItems = News::published()
            ->orderByDesc('views')
            ->limit(3)
            ->pluck('title')
            ->all();

        // ── Short Videos for Video Story section ───────────────────────────
        $shortVideos = ShortVideo::with('user')->where('status', 'published')
            ->latest('published_at')
            ->limit(4)
            ->get();

        // ── Active Ads ────────────────────────────────────────────────────
        $ads = Ad::active()
            ->orderBy('sort_order')
            ->get();

        return compact(
            'heroArticle',
            'sideArticles',
            'beritaTerbaru',
            'pilihanRedaksi',
            'beritaTerpopuler',
            'trendingItems',
            'shortVideos',
            'filteredArticles',
            'ads',
        );
    }

    /**
     * Get trending article titles.
     */
    public function getTrendingTitles(int $limit = 5): array
    {
        return News::published()
            ->orderByDesc('views')
            ->limit($limit)
            ->pluck('title')
            ->all();
    }

    /**
     * Get the most popular articles by views.
     */
    public function getPopularArticles(int $limit = 5): Collection
    {
        return News::published()
            ->orderByDesc('views')
            ->limit($limit)
            ->get(['id', 'title', 'slug', 'published_at', 'views']);
    }
}
