<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\ShortVideo;
use App\Services\MediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShortVideoController extends Controller
{
    public function __construct(
        private readonly MediaService $mediaService,
    ) {}

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

    public function publicIndex(Request $request)
    {
        $query = ShortVideo::with(['user', 'comments.user'])
            ->where('status', 'published')
            ->latest('published_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return Inertia::render('short-videos/public', [
            'videos' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search']),
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

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        // Extract files before creating model record
        unset($data['video'], $data['thumbnail']);
        $data['video'] = null;
        $data['thumbnail'] = null;

        $shortVideo = ShortVideo::create($data);

        // Upload video via media pipeline
        $this->mediaService->upload(
            $request->file('video'),
            Media::COLLECTION_SHORT_VIDEO,
            $shortVideo,
            $request->user()->id,
        );

        // Upload thumbnail if provided
        if ($request->hasFile('thumbnail')) {
            $this->mediaService->upload(
                $request->file('thumbnail'),
                Media::COLLECTION_SHORT_VIDEO_THUMBNAIL,
                $shortVideo,
                $request->user()->id,
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Short video berhasil diunggah.']);

        return to_route('short-videos.index');
    }

    public function incrementViews(ShortVideo $shortVideo): void
    {
        $shortVideo->increment('views');
    }

    public function destroy(ShortVideo $shortVideo): RedirectResponse
    {
        // Delete all media (video + thumbnail) through the media pipeline
        $this->mediaService->deleteAllForModel($shortVideo);

        $shortVideo->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Short video berhasil dihapus.']);

        return to_route('short-videos.index');
    }
}
