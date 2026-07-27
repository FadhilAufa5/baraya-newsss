<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsStoreRequest;
use App\Http\Requests\NewsUpdateRequest;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    const CATEGORIES = [
        'Nasional',
        'Internasional',
        'Politik',
        'Ekonomi',
        'Olahraga',
        'Teknologi',
        'Hiburan',
        'Kesehatan',
        'Pendidikan',
        'Budaya',
        'Lingkungan',
        'Hukum',
        'Umum',
    ];

    public function __construct(
        private readonly NewsService $newsService,
    ) {
    }

    public function index(Request $request)
    {
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
        return Inertia::render('news/create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(NewsStoreRequest $request): RedirectResponse
    {

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

        return Inertia::render('news/public-show', [
            'article' => $news->load(['user', 'comments.user']),
            'related' => $related,
            'others' => $others,
            'canManageComments' => auth()->user()?->can('delete news') ?? false,
        ]);
    }

    public function edit(News $news)
    {
        return Inertia::render('news/edit', [
            'article' => $news,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(NewsUpdateRequest $request, News $news): RedirectResponse
    {
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
        $this->newsService->delete($news);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil dihapus.']);

        return to_route('news.index');
    }
}
