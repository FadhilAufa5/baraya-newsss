<?php

namespace App\Services;

use App\Models\Media;
use App\Models\News;
use Illuminate\Http\UploadedFile;

class NewsService
{
    public function __construct(
        private readonly MediaService $mediaService,
    ) {}

    /**
     * Prepare and persist a new article from validated request data.
     * Handles slug generation, reading-time estimation, auto-excerpt,
     * auto-published_at, and file uploads via the Media pipeline.
     */
    public function store(array $data, ?UploadedFile $image = null, ?UploadedFile $video = null): News
    {
        $data = $this->prepareData($data);

        $news = News::create($data);

        // Upload through the media pipeline (temp → queue → final)
        if ($image) {
            $this->mediaService->upload(
                $image,
                Media::COLLECTION_NEWS_IMAGE,
                $news,
                $data['user_id'] ?? null,
            );
        }

        if ($video) {
            $this->mediaService->upload(
                $video,
                Media::COLLECTION_NEWS_VIDEO,
                $news,
                $data['user_id'] ?? null,
            );
        }

        return $news;
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
            $this->mediaService->replaceForModel(
                $news,
                Media::COLLECTION_NEWS_IMAGE,
                $image,
                auth()->id(),
            );
            // Legacy field will be synced by the job
            unset($data['image']);
        } elseif (!empty($data['remove_image'])) {
            $this->mediaService->clearCollection($news, Media::COLLECTION_NEWS_IMAGE);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        // Handle short video: upload new, remove, or keep existing
        if ($video) {
            $this->mediaService->replaceForModel(
                $news,
                Media::COLLECTION_NEWS_VIDEO,
                $video,
                auth()->id(),
            );
            unset($data['short_video']);
        } elseif (!empty($data['remove_short_video'])) {
            $this->mediaService->clearCollection($news, Media::COLLECTION_NEWS_VIDEO);
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
        $this->mediaService->deleteAllForModel($news);

        $disk = \Illuminate\Support\Facades\Storage::disk(config('media.final_disk', 'public'));
        if ($news->image && $disk->exists($news->image)) {
            $disk->delete($news->image);
        }
        if ($news->short_video && $disk->exists($news->short_video)) {
            $disk->delete($news->short_video);
        }

        $news->delete();
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
