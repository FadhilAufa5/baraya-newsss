<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\ShortVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('access dashboard');

        $type = $request->query('type', 'all');

        $mediaItems = collect();

        // Gambar dari News
        if ($type === 'all' || $type === 'news_images') {
            $newsImages = News::whereNotNull('image')
                ->where('image', '!=', '')
                ->latest('created_at')
                ->get()
                ->map(fn ($news) => [
                    'id' => 'news_img_' . $news->id,
                    'type' => 'news_image',
                    'type_label' => 'Gambar News',
                    'title' => $news->title,
                    'caption' => $news->image_caption,
                    'file_path' => $news->image,
                    'file_name' => basename($news->image),
                    'related_id' => $news->id,
                    'related_url' => route('news.edit', $news),
                    'created_at' => $news->created_at->toISOString(),
                ]);
            $mediaItems = $mediaItems->concat($newsImages);
        }

        // Short Video dari News (field short_video)
        if ($type === 'all' || $type === 'short_videos') {
            $newsVideos = News::whereNotNull('short_video')
                ->where('short_video', '!=', '')
                ->latest('created_at')
                ->get()
                ->map(fn ($news) => [
                    'id' => 'news_vid_' . $news->id,
                    'type' => 'short_video',
                    'type_label' => 'Short Video',
                    'title' => $news->title,
                    'caption' => $news->short_video_caption,
                    'file_path' => $news->short_video,
                    'file_name' => basename($news->short_video),
                    'related_id' => $news->id,
                    'related_url' => route('news.edit', $news),
                    'created_at' => $news->created_at->toISOString(),
                ]);
            $mediaItems = $mediaItems->concat($newsVideos);
        }

        // Thumbnail dari ShortVideo
        if ($type === 'all' || $type === 'thumbnails') {
            $shortVideoThumbs = ShortVideo::whereNotNull('thumbnail')
                ->where('thumbnail', '!=', '')
                ->latest('created_at')
                ->get()
                ->map(fn ($sv) => [
                    'id' => 'thumb_' . $sv->id,
                    'type' => 'thumbnail',
                    'type_label' => 'Thumbnail',
                    'title' => $sv->title,
                    'caption' => null,
                    'file_path' => $sv->thumbnail,
                    'file_name' => basename($sv->thumbnail),
                    'related_id' => $sv->id,
                    'related_url' => null,
                    'created_at' => $sv->created_at->toISOString(),
                ]);
            $mediaItems = $mediaItems->concat($shortVideoThumbs);
        }

        // Video dari ShortVideo
        if ($type === 'all' || $type === 'short_videos') {
            $shortVideos = ShortVideo::whereNotNull('video')
                ->where('video', '!=', '')
                ->latest('created_at')
                ->get()
                ->map(fn ($sv) => [
                    'id' => 'sv_vid_' . $sv->id,
                    'type' => 'short_video',
                    'type_label' => 'Short Video',
                    'title' => $sv->title,
                    'caption' => null,
                    'file_path' => $sv->video,
                    'file_name' => basename($sv->video),
                    'related_id' => $sv->id,
                    'related_url' => null,
                    'created_at' => $sv->created_at->toISOString(),
                ]);
            $mediaItems = $mediaItems->concat($shortVideos);
        }

        // Sort by created_at desc
        $mediaItems = $mediaItems->sortByDesc('created_at')->values();

        // Manual pagination
        $perPage = 15;
        $page = max(1, (int) $request->query('page', 1));
        $total = $mediaItems->count();
        $items = $mediaItems->forPage($page, $perPage)->values();

        $lastPage = max(1, (int) ceil($total / $perPage));

        return Inertia::render('gallery/index', [
            'media' => [
                'data' => $items,
                'current_page' => $page,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'total' => $total,
                'from' => ($page - 1) * $perPage + 1,
                'to' => min($page * $perPage, $total),
            ],
            'type' => $type,
        ]);
    }

    public function destroy(string $id)
    {
        Gate::authorize('access dashboard');

        $disk = \Illuminate\Support\Facades\Storage::disk(config('media.final_disk', 'public'));

        if (str_starts_with($id, 'news_img_')) {
            $modelId = str_replace('news_img_', '', $id);
            $news = News::find($modelId);
            if ($news) {
                if ($news->image && $disk->exists($news->image)) {
                    $disk->delete($news->image);
                }
                $news->update(['image' => null]);
            }
        } elseif (str_starts_with($id, 'news_vid_')) {
            $modelId = str_replace('news_vid_', '', $id);
            $news = News::find($modelId);
            if ($news) {
                if ($news->short_video && $disk->exists($news->short_video)) {
                    $disk->delete($news->short_video);
                }
                $news->update(['short_video' => null]);
            }
        } elseif (str_starts_with($id, 'thumb_')) {
            $modelId = str_replace('thumb_', '', $id);
            $sv = ShortVideo::find($modelId);
            if ($sv) {
                if ($sv->thumbnail && $disk->exists($sv->thumbnail)) {
                    $disk->delete($sv->thumbnail);
                }
                $sv->update(['thumbnail' => null]);
            }
        } elseif (str_starts_with($id, 'sv_vid_')) {
            $modelId = str_replace('sv_vid_', '', $id);
            $sv = ShortVideo::find($modelId);
            if ($sv) {
                if ($sv->video && $disk->exists($sv->video)) {
                    $disk->delete($sv->video);
                }
                $sv->update(['video' => null]);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Media berhasil dihapus.']);

        return back();
    }
}
