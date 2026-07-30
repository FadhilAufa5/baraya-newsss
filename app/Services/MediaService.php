<?php

namespace App\Services;

use App\Jobs\ProcessMediaJob;
use App\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    /**
     * Upload a file to temporary storage, create a Media record,
     * and dispatch the processing job.
     *
     * @param  UploadedFile  $file        The uploaded file
     * @param  string        $collection  Media collection name (e.g. 'news-images')
     * @param  Model|null    $mediable    The owning model (can be null if created later)
     * @param  int|null      $uploadedBy  The user ID who uploaded
     * @return Media         The newly created Media record (status = pending)
     */
    public function upload(
        UploadedFile $file,
        string $collection,
        ?Model $mediable = null,
        ?int $uploadedBy = null,
    ): Media {
        $tempDisk = config('media.temp_disk', 'temp');
        $collectionConfig = config("media.collections.{$collection}", []);
        $basePath = $collectionConfig['path'] ?? $collection;

        // Generate a unique filename preserving the original extension
        $extension = $file->getClientOriginalExtension();
        $hashedName = Str::uuid() . '.' . $extension;

        // Store to temp disk
        $tempPath = $file->storeAs(
            "pending/{$basePath}",
            $hashedName,
            $tempDisk,
        );

        // Create metadata record
        $media = Media::create([
            'collection'    => $collection,
            'original_name' => $file->getClientOriginalName(),
            'filename'      => $hashedName,
            'disk'          => config('media.final_disk', 'public'),
            'path'          => $tempPath, // Temporarily points to temp; job updates to final
            'mime_type'     => $file->getMimeType(),
            'size'          => $file->getSize(),
            'status'        => Media::STATUS_PENDING,
            'mediable_type' => $mediable ? get_class($mediable) : null,
            'mediable_id'   => $mediable?->getKey(),
            'uploaded_by'   => $uploadedBy,
        ]);

        // Dispatch async processing
        ProcessMediaJob::dispatch($media);

        return $media;
    }

    /**
     * Attach an existing Media record to a model.
     * Useful when the model is created after the upload.
     */
    public function attachToModel(Media $media, Model $model): void
    {
        $media->update([
            'mediable_type' => get_class($model),
            'mediable_id'   => $model->getKey(),
        ]);
    }

    /**
     * Replace existing media for a model in a given collection.
     * Deletes old media, uploads new file.
     */
    public function replaceForModel(
        Model $model,
        string $collection,
        UploadedFile $file,
        ?int $uploadedBy = null,
    ): Media {
        // Delete all existing media in this collection for this model
        $this->clearCollection($model, $collection);

        // Upload the replacement
        return $this->upload($file, $collection, $model, $uploadedBy);
    }

    /**
     * Delete a single Media record and its physical files.
     */
    public function delete(Media $media): void
    {
        $media->deleteFiles();
        $media->delete();
    }

    /**
     * Remove all media in a collection for a given model.
     */
    public function clearCollection(Model $model, string $collection): void
    {
        $model->media()
            ->forCollection($collection)
            ->each(function (Media $media) {
                $media->deleteFiles();
                $media->delete();
            });
    }

    /**
     * Delete all media attached to a model (all collections).
     */
    public function deleteAllForModel(Model $model): void
    {
        $model->media->each(function (Media $media) {
            $media->deleteFiles();
            $media->delete();
        });
    }
}
