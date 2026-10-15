<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsStoreRequest;
use App\Http\Requests\NewsUpdateRequest;
use App\Models\Ad;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class NewsController extends Controller
{
    const CATEGORIES = [
        'Jawa Barat',
        'Nasional',
        'Internasional',
        'Politik',
        'Ekonomi',
        'Olahraga',
        'Teknologi',
        'Hiburan',
        'Lifestyle',
        'Otomotif',
        'Kesehatan',
        'Pendidikan',
        'Budaya',
        'Lingkungan',
        'Hukum',
        'Wisata',
        'Umum',
    ];

    public function __construct(
        private readonly NewsService $newsService,
    ) {
    }

    public function publicIndex(Request $request)
    {
        $query = News::published()->with('user');

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all' && $request->category !== 'Semua' && $request->category !== 'Indeks') {
            $query->where('category', $request->category);
        }

        if ($request->filled('tag')) {
            $tag = trim($request->tag);
            $query->whereJsonContains('tags', $tag);
        }

        if ($request->filled('date')) {
            $date = $request->date;
            if ($date === 'today' || $date === 'hari-ini') {
                $query->whereDate('published_at', today());
            } elseif ($date === 'week' || $date === 'minggu-ini') {
                $query->where('published_at', '>=', now()->subDays(7));
            } elseif ($date === 'month' || $date === 'bulan-ini') {
                $query->where('published_at', '>=', now()->subDays(30));
            } elseif (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                $query->whereDate('published_at', $date);
            }
        }

        $sort = $request->input('sort', 'terbaru');
        if ($sort === 'terpopuler') {
            $query->orderByDesc('views')->latest('published_at');
        } elseif ($sort === 'terlama') {
            $query->oldest('published_at');
        } else {
            $query->latest('published_at');
        }

        $news = $query->paginate(12)->withQueryString();

        $beritaTerpopuler = News::published()
            ->orderByDesc('views')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at', 'views']);

        $trendingItems = News::published()
            ->orderByDesc('views')
            ->limit(5)
            ->pluck('title')
            ->all();

        $ads = Ad::active()
            ->orderBy('sort_order')
            ->get();

        $allTags = News::published()
            ->whereNotNull('tags')
            ->pluck('tags')
            ->flatten()
            ->filter()
            ->countBy()
            ->sortDesc()
            ->take(12)
            ->keys()
            ->values()
            ->all();

        $categoryCounts = News::published()
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->all();

        return Inertia::render('news/public-index', [
            'news' => $news,
            'filters' => [
                'search' => $request->input('search'),
                'category' => $request->input('category'),
                'sort' => $request->input('sort', 'terbaru'),
                'date' => $request->input('date'),
                'tag' => $request->input('tag'),
            ],
            'categories' => self::CATEGORIES,
            'categoryCounts' => $categoryCounts,
            'popularTags' => $allTags,
            'beritaTerpopuler' => $beritaTerpopuler,
            'trendingItems' => $trendingItems,
            'ads' => $ads,
        ]);
    }

    public function index(Request $request)
    {
        Gate::authorize('view news');

        $query = News::with('user')->latest('published_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $news = $query->paginate(12)->withQueryString();

        return Inertia::render('news/index', [
            'news' => $news,
            'filters' => $request->only(['search', 'category', 'status']),
            'categories' => self::CATEGORIES,
        ]);
    }

    public function create()
    {
        Gate::authorize('create news');

        return Inertia::render('news/create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(NewsStoreRequest $request): RedirectResponse
    {
        Gate::authorize('create news');

        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $this->newsService->store(
            $data,
            $request->file('image'),
            $request->file('short_video'),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil disimpan.']);

        return to_route('news.index');
    }

    public function show(News $news)
    {
        if (!auth()->check() && $news->status !== 'published') {
            abort(404);
        }

        $news->increment('views');

        $related = News::published()
            ->where('category', $news->category)
            ->where('id', '!=', $news->id)
            ->latest('published_at')
            ->limit(4)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at', 'excerpt', 'views']);

        $relatedIds = $related->pluck('id')->push($news->id)->all();
        $others = News::published()
            ->whereNotIn('id', $relatedIds)
            ->latest('published_at')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at', 'excerpt', 'views']);

        $ads = Ad::active()
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('news/public-show', [
            'article' => $news->load(['user', 'comments.user']),
            'related' => $related,
            'others' => $others,
            'ads' => $ads,
            'canManageComments' => auth()->user()?->can('delete news') ?? false,
        ]);
    }

    public function edit(News $news)
    {
        Gate::authorize('edit news');

        return Inertia::render('news/edit', [
            'article' => $news,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(NewsUpdateRequest $request, News $news): RedirectResponse
    {
        Gate::authorize('edit news');

        $data = $request->validated();

        $this->newsService->update(
            $news,
            $data,
            $request->file('image'),
            $request->file('short_video'),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil diperbarui.']);

        return to_route('news.index');
    }

    public function destroy(News $news): RedirectResponse
    {
        Gate::authorize('delete news');

        $this->newsService->delete($news);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil dihapus.']);

        return to_route('news.index');
    }
}
