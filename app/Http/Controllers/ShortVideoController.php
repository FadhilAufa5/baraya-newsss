<?php

namespace App\Http\Controllers;

use App\Models\ShortVideo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ShortVideoController extends Controller
{
    public function index(Request $request)
    {
        $query = ShortVideo::with('user')->latest('created_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('short-videos/index', [
            'shortVideos' => $query->paginate(12)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('short-videos/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'video' => ['required', 'file', 'mimes:mp4,webm,mov', 'max:51200'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'status' => ['required', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
        ], [
            'title.required' => 'Judul short video wajib diisi.',
            'video.required' => 'File video wajib diunggah.',
            'video.mimes' => 'Video harus berformat MP4, WebM, atau MOV.',
            'video.max' => 'Ukuran video maksimal 50MB.',
            'thumbnail.image' => 'Thumbnail harus berupa gambar.',
            'thumbnail.max' => 'Ukuran thumbnail maksimal 4MB.',
        ]);

        $data['user_id'] = $request->user()->id;
        $data['video'] = $request->file('video')->store('short-videos', 'public');

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('short-videos/thumbnails', 'public');
        }

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        ShortVideo::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Short video berhasil diunggah.']);

        return to_route('short-videos.index');
    }

    public function destroy(ShortVideo $shortVideo): RedirectResponse
    {
        Storage::disk('public')->delete($shortVideo->video);

        if ($shortVideo->thumbnail) {
            Storage::disk('public')->delete($shortVideo->thumbnail);
        }

        $shortVideo->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Short video berhasil dihapus.']);

        return to_route('short-videos.index');
    }
}
