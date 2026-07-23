<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::with(['user', 'news'])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('body', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('news', fn ($q) => $q->where('title', 'like', "%{$search}%"));
            });
        }

        $stats = [
            'total'     => Comment::count(),
            'today'     => Comment::whereDate('created_at', today())->count(),
            'this_week' => Comment::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        return Inertia::render('comments/index', [
            'comments' => $query->paginate(20)->withQueryString(),
            'filters'  => $request->only(['search']),
            'stats'    => $stats,
        ]);
    }

    public function store(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'min:3', 'max:1000'],
        ], [
            'body.required' => 'Komentar wajib diisi.',
            'body.min'      => 'Komentar minimal 3 karakter.',
            'body.max'      => 'Komentar maksimal 1000 karakter.',
        ]);

        $news->comments()->create([
            'user_id' => $request->user()->id,
            'body'    => $validated['body'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Komentar berhasil ditambahkan.']);

        return back();
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        abort_unless($comment->user_id === auth()->id() || auth()->user()?->can('delete news'), 403);

        $comment->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Komentar berhasil dihapus.']);

        return back();
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['integer', 'exists:comments,id'],
        ]);

        $comments = Comment::whereIn('id', $request->ids)->get();

        abort_unless(
            $comments->every(fn ($c) =>
                $c->user_id === auth()->id() || auth()->user()?->can('delete news')
            ),
            403
        );

        $comments->each->delete();

        Inertia::flash('toast', [
            'type'    => 'success',
            'message' => count($request->ids) . ' komentar berhasil dihapus.',
        ]);

        return back();
    }
}
