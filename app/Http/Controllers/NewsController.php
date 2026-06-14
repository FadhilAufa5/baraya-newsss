<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsStoreRequest;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::latest()->paginate(10);

        return Inertia::render('news/index', [
            'news' => $news,
        ]);
    }

    public function create()
    {
        return Inertia::render('news/create');
    }

    public function store(NewsStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        News::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('News created.')]);

        return to_route('news.index');
    }
}
