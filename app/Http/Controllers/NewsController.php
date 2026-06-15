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
            'news'       => $news,
            'filters'    => $request->only(['search', 'category', 'status']),
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

        News::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil disimpan.']);

        return to_route('news.index');
    }

    public function show(News $news)
    {
        // Increment views
        $news->increment('views');

        return Inertia::render('news/show', [
            'article'    => $news->load('user'),
            'categories' => self::CATEGORIES,
        ]);
    }

    public function edit(News $news)
    {
        return Inertia::render('news/edit', [
            'article'    => $news,
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
        if ($data['status'] === 'published' && empty($data['published_at']) && !$news->published_at) {
            $data['published_at'] = now();
        }

        // Image upload — replace old
        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $data['image'] = $request->file('image')->store('news', 'public');
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

        $news->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil dihapus.']);

        return to_route('news.index');
    }
}
