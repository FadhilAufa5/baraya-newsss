<?php

namespace App\Services;

use App\Models\News;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class NewsService
{
    /**
     * Prepare and persist a new article from validated request data.
     * Handles slug generation, reading-time estimation, auto-excerpt,
     * auto-published_at, and file uploads.
     */
    public function store(array $data, ?UploadedFile $image = null, ?UploadedFile $video = null): News
    {
        $data = $this->prepareData($data);

        if ($image) {
            $data['image'] = $image->store('news', 'public');
        }

        if ($video) {
            $data['short_video'] = $video->store('news/videos', 'public');
        }

        return News::create($data);
    }

    /**
     * Update an existing article.
     * Replaces old files when new uploads are provided.
     */
    public function update(News $news, array $data, ?UploadedFile $image = null, ?UploadedFile $video = null): News
    {
        $data = $this->prepareData($data, $news);

        if ($image) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $data['image'] = $image->store('news', 'public');
        }

        if ($video) {
            if ($news->short_video) {
                Storage::disk('public')->delete($news->short_video);
            }
            $data['short_video'] = $video->store('news/videos', 'public');
        }

        $news->update($data);

        return $news->fresh();
    }

    /**
     * Delete an article and its associated media files.
     */
    public function delete(News $news): void
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        if ($news->short_video) {
            Storage::disk('public')->delete($news->short_video);
        }

        $news->delete();
    }

    /**
     * Resolve slug, reading time, excerpt, and published_at from raw data.
     */
    private function prepareData(array $data, ?News $existing = null): array
    {
        // Slug
        if (empty($data['slug'])) {
            $data['slug'] = News::generateSlug($data['title'], $existing?->id);
        }

        // Reading time
        $data['reading_time'] = News::estimateReadingTime($data['content']);

        // Auto excerpt
        if (empty($data['excerpt'])) {
            $data['excerpt'] = mb_substr(strip_tags($data['content']), 0, 200);
        }

        // Auto published_at when first publishing
        if (
            isset($data['status']) &&
            $data['status'] === 'published' &&
            empty($data['published_at']) &&
            !$existing?->published_at
        ) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
