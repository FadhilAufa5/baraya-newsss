<?php

namespace App\Services\Media;

class ImageProcessor
{
    private bool $hasIntervention;

    public function __construct()
    {
        $this->hasIntervention = class_exists(\Intervention\Image\ImageManager::class);
    }

    /**
     * Resize the image if it exceeds the maximum width.
     * Maintains aspect ratio. Modifies the file in-place.
     *
     * @return array{width: int, height: int}  Final dimensions
     */
    public function resize(string $absolutePath, int $maxWidth): array
    {
        if ($this->hasIntervention) {
            return $this->resizeWithIntervention($absolutePath, $maxWidth);
        }

        return $this->resizeWithGd($absolutePath, $maxWidth);
    }

    /**
     * Convert an image to WebP format.
     *
     * @return array{width: int, height: int, size: int}  Output file info
     */
    public function convertToWebp(string $sourcePath, string $destPath, int $quality = 80): array
    {
        if ($this->hasIntervention) {
            return $this->convertToWebpWithIntervention($sourcePath, $destPath, $quality);
        }

        return $this->convertToWebpWithGd($sourcePath, $destPath, $quality);
    }

    /**
     * Compress an image at the given quality.
     */
    public function compress(string $sourcePath, string $destPath, int $quality = 80): void
    {
        if ($this->hasIntervention) {
            $this->compressWithIntervention($sourcePath, $destPath, $quality);

            return;
        }

        $this->compressWithGd($sourcePath, $destPath, $quality);
    }

    /**
     * Get dimensions of an image file.
     *
     * @return array{width: int, height: int}|null
     */
    public function getDimensions(string $absolutePath): ?array
    {
        $info = @getimagesize($absolutePath);

        if ($info === false) {
            return null;
        }

        return [
            'width' => $info[0],
            'height' => $info[1],
        ];
    }

    // ─── Intervention Image Implementations ────────────────────────

    private function resizeWithIntervention(string $absolutePath, int $maxWidth): array
    {
        $manager = new \Intervention\Image\ImageManager(
            new \Intervention\Image\Drivers\Gd\Driver()
        );

        $image = $manager->decodePath($absolutePath);

        if ($image->width() > $maxWidth) {
            $image->scaleDown(width: $maxWidth);
        }

        $image->save($absolutePath);

        return [
            'width' => $image->width(),
            'height' => $image->height(),
        ];
    }

    private function convertToWebpWithIntervention(string $sourcePath, string $destPath, int $quality): array
    {
        $manager = new \Intervention\Image\ImageManager(
            new \Intervention\Image\Drivers\Gd\Driver()
        );

        $image = $manager->decodePath($sourcePath);
        $encoded = $image->encode(new \Intervention\Image\Encoders\WebpEncoder(quality: $quality));
        $encoded->save($destPath);

        return [
            'width' => $image->width(),
            'height' => $image->height(),
            'size' => filesize($destPath),
        ];
    }

    private function compressWithIntervention(string $sourcePath, string $destPath, int $quality): void
    {
        $manager = new \Intervention\Image\ImageManager(
            new \Intervention\Image\Drivers\Gd\Driver()
        );

        $image = $manager->decodePath($sourcePath);
        $image->save($destPath, quality: $quality);
    }

    // ─── Pure GD Fallback Implementations ──────────────────────────

    private function resizeWithGd(string $absolutePath, int $maxWidth): array
    {
        $info = getimagesize($absolutePath);

        if ($info === false) {
            return ['width' => 0, 'height' => 0];
        }

        [$origWidth, $origHeight] = $info;

        if ($origWidth <= $maxWidth) {
            return ['width' => $origWidth, 'height' => $origHeight];
        }

        $ratio = $maxWidth / $origWidth;
        $newWidth = (int) round($origWidth * $ratio);
        $newHeight = (int) round($origHeight * $ratio);

        $source = $this->createImageFromFile($absolutePath, $info[2]);

        if (!$source) {
            return ['width' => $origWidth, 'height' => $origHeight];
        }

        $dest = imagecreatetruecolor($newWidth, $newHeight);
        $this->preserveTransparency($dest, $info[2]);

        imagecopyresampled($dest, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

        $this->saveImage($dest, $absolutePath, $info[2]);

        imagedestroy($source);
        imagedestroy($dest);

        return ['width' => $newWidth, 'height' => $newHeight];
    }

    private function convertToWebpWithGd(string $sourcePath, string $destPath, int $quality): array
    {
        $info = getimagesize($sourcePath);

        if ($info === false) {
            // Copy as-is if we can't read
            copy($sourcePath, $destPath);

            return ['width' => 0, 'height' => 0, 'size' => filesize($destPath)];
        }

        $source = $this->createImageFromFile($sourcePath, $info[2]);

        if (!$source) {
            copy($sourcePath, $destPath);

            return ['width' => $info[0], 'height' => $info[1], 'size' => filesize($destPath)];
        }

        imagewebp($source, $destPath, $quality);
        imagedestroy($source);

        return [
            'width' => $info[0],
            'height' => $info[1],
            'size' => filesize($destPath),
        ];
    }

    private function compressWithGd(string $sourcePath, string $destPath, int $quality): void
    {
        $info = getimagesize($sourcePath);

        if ($info === false) {
            copy($sourcePath, $destPath);

            return;
        }

        $source = $this->createImageFromFile($sourcePath, $info[2]);

        if (!$source) {
            copy($sourcePath, $destPath);

            return;
        }

        $this->saveImage($source, $destPath, $info[2], $quality);
        imagedestroy($source);
    }

    // ─── GD Helpers ────────────────────────────────────────────────

    /**
     * Create a GD image resource from a file path.
     *
     * @return \GdImage|false
     */
    private function createImageFromFile(string $path, int $type): \GdImage|false
    {
        return match ($type) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($path),
            IMAGETYPE_PNG => imagecreatefrompng($path),
            IMAGETYPE_GIF => imagecreatefromgif($path),
            IMAGETYPE_WEBP => imagecreatefromwebp($path),
            IMAGETYPE_BMP => imagecreatefrombmp($path),
            default => false,
        };
    }

    /**
     * Save a GD image resource to a file.
     */
    private function saveImage(\GdImage $image, string $path, int $type, int $quality = 80): void
    {
        match ($type) {
            IMAGETYPE_JPEG => imagejpeg($image, $path, $quality),
            IMAGETYPE_PNG => imagepng($image, $path, (int) round(9 * (100 - $quality) / 100)),
            IMAGETYPE_GIF => imagegif($image, $path),
            IMAGETYPE_WEBP => imagewebp($image, $path, $quality),
            IMAGETYPE_BMP => imagebmp($image, $path),
            default => imagepng($image, $path),
        };
    }

    /**
     * Preserve transparency for PNG/GIF/WebP formats.
     */
    private function preserveTransparency(\GdImage $image, int $type): void
    {
        if (in_array($type, [IMAGETYPE_PNG, IMAGETYPE_GIF, IMAGETYPE_WEBP])) {
            imagealphablending($image, false);
            imagesavealpha($image, true);
            $transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);
            imagefilledrectangle($image, 0, 0, imagesx($image), imagesy($image), $transparent);
        }
    }
}
