<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Media extends Model
{
    use HasFactory;

    // ─── Collection Constants ──────────────────────────────────────
    public const COLLECTION_NEWS_IMAGE           = 'news-images';
    public const COLLECTION_NEWS_VIDEO           = 'news-videos';
    public const COLLECTION_SHORT_VIDEO          = 'short-videos';
    public const COLLECTION_SHORT_VIDEO_THUMBNAIL = 'short-video-thumbnails';
    public const COLLECTION_AVATAR               = 'avatars';
    public const COLLECTION_COVER                = 'covers';

    // ─── Status Constants ──────────────────────────────────────────
    public const STATUS_PENDING    = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_READY      = 'ready';
    public const STATUS_FAILED     = 'failed';

    protected $fillable = [
        'uuid',
        'collection',
        'original_name',
        'filename',
        'disk',
        'path',
        'mime_type',
        'size',
        'width',
        'height',
        'status',
        'mediable_type',
        'mediable_id',
        'uploaded_by',
        'conversions',
        'metadata',
    ];

    protected $casts = [
        'size'        => 'integer',
        'width'       => 'integer',
        'height'      => 'integer',
        'conversions' => 'array',
        'metadata'    => 'array',
    ];

    // ─── Boot ──────────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (Media $media) {
            if (empty($media->uuid)) {
                $media->uuid = (string) Str::uuid();
            }
        });
    }

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * The owning model (News, ShortVideo, UserProfile, …).
     */
    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The user who uploaded the file.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // ─── Scopes ────────────────────────────────────────────────────

    public function scopeReady($query)
    {
        return $query->where('status', self::STATUS_READY);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeForCollection($query, string $collection)
    {
        return $query->where('collection', $collection);
    }

    // ─── URL Helpers ───────────────────────────────────────────────

    /**
     * Get the public URL of the processed file.
     * Easy to swap to CDN later — just change this method.
     */
    public function getUrl(): ?string
    {
        if ($this->status !== self::STATUS_READY) {
            return null;
        }

        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Get the URL for a specific conversion (e.g. 'webp', 'thumbnail').
     */
    public function getConversionUrl(string $conversion): ?string
    {
        $conversions = $this->conversions ?? [];

        if (! isset($conversions[$conversion])) {
            return $this->getUrl(); // fallback to original
        }

        return Storage::disk($this->disk)->url($conversions[$conversion]);
    }

    /**
     * Return the best available URL: WebP conversion if exists, otherwise original.
     */
    public function getBestUrl(): ?string
    {
        return $this->getConversionUrl('webp') ?? $this->getUrl();
    }

    // ─── Type Checks ───────────────────────────────────────────────

    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    public function isVideo(): bool
    {
        return str_starts_with($this->mime_type, 'video/');
    }

    // ─── File Management ───────────────────────────────────────────

    /**
     * Delete the physical files (original + conversions) from storage.
     */
    public function deleteFiles(): void
    {
        $disk = Storage::disk($this->disk);

        // Delete main file
        if ($this->path && $disk->exists($this->path)) {
            $disk->delete($this->path);
        }

        // Delete conversion files
        foreach ($this->conversions ?? [] as $conversionPath) {
            if ($conversionPath && $disk->exists($conversionPath)) {
                $disk->delete($conversionPath);
            }
        }
    }
}
