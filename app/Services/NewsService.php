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
     * Replaces old files when new uploads are provided,
     * or removes them when remove flags are set.
     */
    public function update(News $news, array $data, ?UploadedFile $image = null, ?UploadedFile $video = null): News
    {
        $data = $this->prepareData($data, $news);

        // Handle image: upload new, remove, or keep existing
        if ($image) {
            $this->deleteFile($news->image);
            $data['image'] = $image->store('news', 'public');
        } elseif (!empty($data['remove_image'])) {
            $this->deleteFile($news->image);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        // Handle short video: upload new, remove, or keep existing
        if ($video) {
            $this->deleteFile($news->short_video);
            $data['short_video'] = $video->store('news/videos', 'public');
        } elseif (!empty($data['remove_short_video'])) {
            $this->deleteFile($news->short_video);
            $data['short_video'] = null;
        } else {
            unset($data['short_video']);
        }

        unset($data['remove_image'], $data['remove_short_video']);

        $news->update($data);

        return $news->fresh();
    }

    /**
     * Delete an article and its associated media files.
     */
    public function delete(News $news): void
    {
        $this->deleteFile($news->image);
        $this->deleteFile($news->short_video);

        $news->delete();
    }

    /**
     * Safely delete a file from the public disk.
     * Skips legacy base64 data URLs and non-existent paths.
     */
    private function deleteFile(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Resolve slug, reading time, excerpt, and published_at from raw data.
     */
    private function prepareData(array $data, ?News $existing = null): array
    {
        if (empty($data['slug'])) {
            $data['slug'] = News::generateSlug($data['title'], $existing?->id);
        }

        $data['reading_time'] = News::estimateReadingTime($data['content']);

        if (empty($data['excerpt'])) {
            $data['excerpt'] = mb_substr(strip_tags($data['content']), 0, 200);
        }

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
