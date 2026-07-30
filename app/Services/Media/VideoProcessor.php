<?php

namespace App\Services\Media;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class VideoProcessor
{
    /**
     * Generate a thumbnail image from a video file.
     *
     * Captures a single frame at 00:00:01 and saves it as JPEG.
     * Returns false gracefully if FFmpeg is not available.
     *
     * @param  string  $videoPath   Absolute path to the video file
     * @param  string  $outputPath  Absolute path for the output thumbnail (JPEG)
     * @param  int     $width       Thumbnail width
     * @param  int     $height      Thumbnail height
     * @return bool    Whether the thumbnail was successfully generated
     */
    public function generateThumbnail(
        string $videoPath,
        string $outputPath,
        int $width = 640,
        int $height = 360,
    ): bool {
        $ffmpeg = $this->getFfmpegPath();

        if (! $ffmpeg) {
            Log::warning('VideoProcessor: FFmpeg not found. Skipping thumbnail generation.', [
                'video' => $videoPath,
            ]);

            return false;
        }

        try {
            $scale = "{$width}:{$height}:force_original_aspect_ratio=decrease";

            $result = Process::timeout(60)->run([
                $ffmpeg,
                '-i', $videoPath,
                '-ss', '00:00:01',
                '-vframes', '1',
                '-vf', "scale={$scale}",
                '-y',
                $outputPath,
            ]);

            if ($result->successful() && file_exists($outputPath)) {
                return true;
            }

            Log::warning('VideoProcessor: FFmpeg thumbnail generation failed.', [
                'video'    => $videoPath,
                'exitCode' => $result->exitCode(),
                'stderr'   => $result->errorOutput(),
            ]);

            return false;
        } catch (\Throwable $e) {
            Log::warning('VideoProcessor: Exception during thumbnail generation.', [
                'video'   => $videoPath,
                'message' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Resolve the FFmpeg binary path.
     */
    private function getFfmpegPath(): ?string
    {
        // Allow explicit config override
        $configured = config('media.ffmpeg_path');

        if ($configured && file_exists($configured)) {
            return $configured;
        }

        // Auto-detect from PATH
        try {
            $command = PHP_OS_FAMILY === 'Windows' ? 'where ffmpeg' : 'which ffmpeg';
            $result  = Process::timeout(5)->run($command);

            if ($result->successful()) {
                $path = trim(explode("\n", $result->output())[0]);

                if ($path && file_exists($path)) {
                    return $path;
                }
            }
        } catch (\Throwable) {
            // Silently fail — FFmpeg not available
        }

        return null;
    }
}
