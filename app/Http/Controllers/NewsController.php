<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsStoreRequest;
use App\Http\Requests\NewsUpdateRequest;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsController extends Controller
{
    const CATEGORIES = [
        'Nasional', 'Internasional', 'Politik', 'Ekonomi',
        'Olahraga', 'Teknologi', 'Hiburan', 'Kesehatan',
        'Pendidikan', 'Budaya', 'Lingkungan', 'Hukum', 'Umum',
    ];

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

        // Slug
        if (empty($data['slug'])) {
            $data['slug'] = News::generateSlug($data['title']);
        }

        // Reading time
        $data['reading_time'] = News::estimateReadingTime($data['content']);

        // Auto excerpt if empty
        if (empty($data['excerpt'])) {
            $data['excerpt'] = mb_substr(strip_tags($data['content']), 0, 200);
        }

        // Auto published_at if publishing now
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        // Image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        if ($request->hasFile('short_video')) {
            $data['short_video'] = $request->file('short_video')->store('news/videos', 'public');
        }

        News::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil disimpan.']);

        return to_route('news.index');
    }

    public function show(News $news)
    {
        // Only show published articles to the public (non-authenticated)
        if (! auth()->check() && $news->status !== 'published') {
            abort(404);
        }

        // Increment views
        $news->increment('views');

        // Related articles (same category, latest, excluding current)
        $related = News::published()
            ->where('category', $news->category)
            ->where('id', '!=', $news->id)
            ->latest('published_at')
            ->limit(4)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at', 'excerpt', 'views']);

        // Other latest articles (excluding current and related articles)
        $relatedIds = $related->pluck('id')->push($news->id)->all();
        $others = News::published()
            ->whereNotIn('id', $relatedIds)
            ->latest('published_at')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at', 'excerpt', 'views']);

        return Inertia::render('news/public-show', [
            'article'  => $news->load(['user', 'comments.user']),
            'related'  => $related,
            'others'   => $others,
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

        // Slug
        if (empty($data['slug'])) {
            $data['slug'] = News::generateSlug($data['title'], $news->id);
        }

        // Reading time
        $data['reading_time'] = News::estimateReadingTime($data['content']);

        // Auto excerpt
        if (empty($data['excerpt'])) {
            $data['excerpt'] = mb_substr(strip_tags($data['content']), 0, 200);
        }

        // Auto published_at if changing to published
        if ($data['status'] === 'published' && empty($data['published_at']) && ! $news->published_at) {
            $data['published_at'] = now();
        }

        // Image upload — replace old
        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        if ($request->hasFile('short_video')) {
            if ($news->short_video) {
                Storage::disk('public')->delete($news->short_video);
            }
            $data['short_video'] = $request->file('short_video')->store('news/videos', 'public');
        }

        $news->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil diperbarui.']);

        return to_route('news.index');
    }

    public function destroy(News $news): RedirectResponse
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        if ($news->short_video) {
            Storage::disk('public')->delete($news->short_video);
        }

        $news->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil dihapus.']);

        return to_route('news.index');
    }
}
