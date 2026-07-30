<?php

namespace App\Concerns;

use App\Models\Media;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Provides polymorphic media relationships to any Eloquent model.
 *
 * Usage:
 *   use HasMedia;
 *
 *   $model->media                           // all media
 *   $model->getMedia('avatars')             // collection-scoped
 *   $model->getFirstMediaUrl('avatars')     // best URL
 */
trait HasMedia
{
    /**
     * All media attached to this model.
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Get all ready media for a specific collection.
     */
    public function getMedia(string $collection): Collection
    {
        return $this->media()
            ->forCollection($collection)
            ->ready()
            ->get();
    }

    /**
     * Get the first ready media record for a collection.
     */
    public function getFirstMedia(string $collection): ?Media
    {
        return $this->media()
            ->forCollection($collection)
            ->ready()
            ->first();
    }

    /**
     * Get the best URL (WebP if available) for the first media in a collection.
     */
    public function getFirstMediaUrl(string $collection, string $conversion = ''): ?string
    {
        $media = $this->getFirstMedia($collection);

        if (! $media) {
            return null;
        }

        return $conversion
            ? $media->getConversionUrl($conversion)
            : $media->getBestUrl();
    }

    /**
     * Delete all media in a specific collection (files + DB records).
     */
    public function clearMediaCollection(string $collection): void
    {
        $this->media()
            ->forCollection($collection)
            ->each(function (Media $media) {
                $media->deleteFiles();
                $media->delete();
            });
    }
}
