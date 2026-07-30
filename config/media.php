<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Storage Disks
    |--------------------------------------------------------------------------
    |
    | The disk used for temporary uploads (before processing) and the disk
    | used for final, publicly-accessible storage.
    |
    */

    'temp_disk'  => env('MEDIA_TEMP_DISK', 'temp'),
    'final_disk' => env('MEDIA_FINAL_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Image Processing
    |--------------------------------------------------------------------------
    */

    'webp_quality'    => (int) env('MEDIA_WEBP_QUALITY', 80),
    'max_image_width' => (int) env('MEDIA_MAX_IMAGE_WIDTH', 1920),

    /*
    |--------------------------------------------------------------------------
    | Video Thumbnail
    |--------------------------------------------------------------------------
    */

    'thumbnail' => [
        'width'  => 640,
        'height' => 360,
    ],

    /*
    |--------------------------------------------------------------------------
    | FFmpeg Binary Path (null = auto-detect from $PATH)
    |--------------------------------------------------------------------------
    */

    'ffmpeg_path' => env('FFMPEG_PATH'),

    /*
    |--------------------------------------------------------------------------
    | Media Collections
    |--------------------------------------------------------------------------
    |
    | Each collection defines where processed files are stored and which
    | conversions to run.  Supported conversions: "webp", "thumbnail".
    |
    */

    'collections' => [
        'news-images' => [
            'path'        => 'news',
            'conversions' => ['webp'],
        ],
        'news-videos' => [
            'path'        => 'news/videos',
            'conversions' => [],
        ],
        'short-videos' => [
            'path'        => 'short-videos',
            'conversions' => ['thumbnail'],
        ],
        'short-video-thumbnails' => [
            'path'        => 'short-videos/thumbnails',
            'conversions' => ['webp'],
        ],
        'avatars' => [
            'path'        => 'avatars',
            'conversions' => ['webp'],
        ],
        'covers' => [
            'path'        => 'covers',
            'conversions' => ['webp'],
        ],
    ],

];
