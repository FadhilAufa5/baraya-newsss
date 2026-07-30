<?php

namespace App\Jobs;

use App\Models\Media;
use App\Services\Media\ImageProcessor;
use App\Services\Media\VideoProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProcessMediaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Number of retry attempts.
     */
    public int $tries = 3;

    /**
     * Backoff intervals in seconds between retries.
     *
     * @var array<int>
     */
    public array $backoff = [10, 30, 60];

    public function __construct(
        public Media $media,
    ) {}

    public function handle(ImageProcessor $imageProcessor, VideoProcessor $videoProcessor): void
    {
        $this->media->update(['status' => Media::STATUS_PROCESSING]);

        try {
            if ($this->media->isImage()) {
                $this->processImage($imageProcessor);
            } elseif ($this->media->isVideo()) {
                $this->processVideo($videoProcessor, $imageProcessor);
            } else {
                // Non-image/video files: just move to final storage
                $this->moveToFinalStorage();
            }

            $this->cleanupTemp();

            Log::info('ProcessMediaJob: Completed.', [
                'media_id'   => $this->media->id,
                'collection' => $this->media->collection,
                'status'     => $this->media->status,
            ]);
        } catch (\Throwable $e) {
            $this->media->update(['status' => Media::STATUS_FAILED]);

            Log::error('ProcessMediaJob: Failed.', [
                'media_id' => $this->media->id,
                'error'    => $e->getMessage(),
            ]);

            throw $e; // Re-throw so Laravel can handle retries
        }
    }

    /**
     * Process an image: resize → move original → convert to WebP → update record.
     */
    private function processImage(ImageProcessor $imageProcessor): void
    {
        $tempDisk    = config('media.temp_disk', 'temp');
        $finalDisk   = config('media.final_disk', 'public');
        $maxWidth    = config('media.max_image_width', 1920);
        $webpQuality = config('media.webp_quality', 80);
        $collection  = config("media.collections.{$this->media->collection}", []);
        $basePath    = $collection['path'] ?? $this->media->collection;
        $conversions = $collection['conversions'] ?? [];

        $tempAbsolute = Storage::disk($tempDisk)->path($this->media->path);

        // 1. Resize if needed
        $dimensions = $imageProcessor->resize($tempAbsolute, $maxWidth);

        // 2. Move original to final storage
        $finalPath = "{$basePath}/{$this->media->filename}";
        $this->moveFile($tempDisk, $this->media->path, $finalDisk, $finalPath);

        $finalAbsolute = Storage::disk($finalDisk)->path($finalPath);

        // 3. Convert to WebP if configured
        $conversionPaths = [];
        if (in_array('webp', $conversions)) {
            $webpFilename = pathinfo($this->media->filename, PATHINFO_FILENAME) . '.webp';
            $webpPath     = "{$basePath}/{$webpFilename}";
            $webpAbsolute = Storage::disk($finalDisk)->path($webpPath);

            // Ensure directory exists
            $webpDir = dirname($webpAbsolute);
            if (! is_dir($webpDir)) {
                mkdir($webpDir, 0755, true);
            }

            $webpInfo = $imageProcessor->convertToWebp($finalAbsolute, $webpAbsolute, $webpQuality);
            $conversionPaths['webp'] = $webpPath;

            // Use WebP dimensions and size as primary
            $dimensions = [
                'width'  => $webpInfo['width'],
                'height' => $webpInfo['height'],
            ];
        }

        // 4. Update Media record
        $this->media->update([
            'disk'        => $finalDisk,
            'path'        => $finalPath,
            'size'        => filesize($finalAbsolute),
            'width'       => $dimensions['width'],
            'height'      => $dimensions['height'],
            'conversions' => ! empty($conversionPaths) ? $conversionPaths : null,
            'status'      => Media::STATUS_READY,
        ]);

        // 5. Sync legacy fields on the parent model
        $this->syncLegacyFields();
    }

    /**
     * Process a video: move to final → generate thumbnail → update record.
     */
    private function processVideo(VideoProcessor $videoProcessor, ImageProcessor $imageProcessor): void
    {
        $tempDisk   = config('media.temp_disk', 'temp');
        $finalDisk  = config('media.final_disk', 'public');
        $collection = config("media.collections.{$this->media->collection}", []);
        $basePath   = $collection['path'] ?? $this->media->collection;
        $conversions = $collection['conversions'] ?? [];
        $thumbWidth  = config('media.thumbnail.width', 640);
        $thumbHeight = config('media.thumbnail.height', 360);

        // 1. Move video to final storage
        $finalPath = "{$basePath}/{$this->media->filename}";
        $this->moveFile($tempDisk, $this->media->path, $finalDisk, $finalPath);

        $finalAbsolute = Storage::disk($finalDisk)->path($finalPath);

        // 2. Generate thumbnail if configured
        $conversionPaths = [];
        if (in_array('thumbnail', $conversions)) {
            $thumbFilename = pathinfo($this->media->filename, PATHINFO_FILENAME) . '_thumb.jpg';
            $thumbDir      = str_replace($basePath, "{$basePath}/thumbnails", $basePath);
            $thumbPath     = "{$thumbDir}/{$thumbFilename}";
            $thumbAbsolute = Storage::disk($finalDisk)->path($thumbPath);

            // Ensure thumbnail directory exists
            $dir = dirname($thumbAbsolute);
            if (! is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            if ($videoProcessor->generateThumbnail($finalAbsolute, $thumbAbsolute, $thumbWidth, $thumbHeight)) {
                $conversionPaths['thumbnail'] = $thumbPath;

                // Also convert thumbnail to WebP
                $thumbWebpName     = pathinfo($thumbFilename, PATHINFO_FILENAME) . '.webp';
                $thumbWebpPath     = "{$thumbDir}/{$thumbWebpName}";
                $thumbWebpAbsolute = Storage::disk($finalDisk)->path($thumbWebpPath);

                try {
                    $imageProcessor->convertToWebp($thumbAbsolute, $thumbWebpAbsolute, config('media.webp_quality', 80));
                    $conversionPaths['thumbnail_webp'] = $thumbWebpPath;
                } catch (\Throwable $e) {
                    Log::warning('ProcessMediaJob: Thumbnail WebP conversion failed.', [
                        'media_id' => $this->media->id,
                        'error'    => $e->getMessage(),
                    ]);
                }
            }
        }

        // 3. Update Media record
        $this->media->update([
            'disk'        => $finalDisk,
            'path'        => $finalPath,
            'size'        => filesize($finalAbsolute),
            'conversions' => ! empty($conversionPaths) ? $conversionPaths : null,
            'status'      => Media::STATUS_READY,
        ]);

        // 4. Sync legacy fields
        $this->syncLegacyFields();
    }

    /**
     * For non-media files, simply move from temp to final.
     */
    private function moveToFinalStorage(): void
    {
        $tempDisk   = config('media.temp_disk', 'temp');
        $finalDisk  = config('media.final_disk', 'public');
        $collection = config("media.collections.{$this->media->collection}", []);
        $basePath   = $collection['path'] ?? $this->media->collection;

        $finalPath = "{$basePath}/{$this->media->filename}";
        $this->moveFile($tempDisk, $this->media->path, $finalDisk, $finalPath);

        $finalAbsolute = Storage::disk($finalDisk)->path($finalPath);

        $this->media->update([
            'disk'   => $finalDisk,
            'path'   => $finalPath,
            'size'   => filesize($finalAbsolute),
            'status' => Media::STATUS_READY,
        ]);

        $this->syncLegacyFields();
    }

    /**
     * Move a file from one disk to another using streams (memory efficient).
     */
    private function moveFile(string $fromDisk, string $fromPath, string $toDisk, string $toPath): void
    {
        $fromStorage = Storage::disk($fromDisk);
        $toStorage   = Storage::disk($toDisk);

        // Ensure target directory exists
        $targetAbsolute = $toStorage->path($toPath);
        $dir            = dirname($targetAbsolute);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        // Stream from source to target (avoids loading entire file into memory)
        $stream = $fromStorage->readStream($fromPath);
        $toStorage->writeStream($toPath, $stream);

        if (is_resource($stream)) {
            fclose($stream);
        }
    }

    /**
     * Clean up temporary files.
     */
    private function cleanupTemp(): void
    {
        $tempDisk = config('media.temp_disk', 'temp');
        $tempStorage = Storage::disk($tempDisk);

        // Delete the temp file (use original path stored before update)
        $tempPath = "pending/" . (config("media.collections.{$this->media->collection}.path") ?? $this->media->collection) . "/{$this->media->filename}";

        if ($tempStorage->exists($tempPath)) {
            $tempStorage->delete($tempPath);
        }
    }

    /**
     * Update legacy fields on the parent model for backward compatibility.
     *
     * This ensures existing Blade/Inertia views continue to work even
     * though the canonical data now lives in the media table.
     */
    private function syncLegacyFields(): void
    {
        $mediable = $this->media->mediable;

        if (! $mediable) {
            return;
        }

        $bestPath = $this->media->conversions['webp'] ?? $this->media->path;

        $updates = match ($this->media->collection) {
            Media::COLLECTION_NEWS_IMAGE => ['image' => $bestPath],
            Media::COLLECTION_NEWS_VIDEO => ['short_video' => $this->media->path],
            Media::COLLECTION_SHORT_VIDEO => ['video' => $this->media->path],
            Media::COLLECTION_SHORT_VIDEO_THUMBNAIL => ['thumbnail' => $bestPath],
            Media::COLLECTION_AVATAR => ['avatar' => $bestPath],
            Media::COLLECTION_COVER  => ['cover_image' => $bestPath],
            default => [],
        };

        if (! empty($updates)) {
            $mediable->updateQuietly($updates);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(?\Throwable $exception): void
    {
        $this->media->update(['status' => Media::STATUS_FAILED]);

        Log::error('ProcessMediaJob: Permanently failed.', [
            'media_id' => $this->media->id,
            'error'    => $exception?->getMessage(),
        ]);
    }
}
