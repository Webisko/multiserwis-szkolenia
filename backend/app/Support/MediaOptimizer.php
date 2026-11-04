<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class MediaOptimizer
{
    public static function ensureWebp(?string $path, int $maxWidth = 1600, int $quality = 82): ?string
    {
        if (! $path || str_starts_with($path, 'http') || str_starts_with($path, '/') || str_ends_with(strtolower($path), '.webp') || str_ends_with(strtolower($path), '.svg')) {
            return $path;
        }

        if (! function_exists('imagewebp') || ! Storage::disk('public')->exists($path)) {
            return $path;
        }

        try {
            $fullPath = Storage::disk('public')->path($path);
            $info = @getimagesize($fullPath);
            if (! $info) {
                return $path;
            }

            [$width, $height, $type] = $info;
            $src = match ($type) {
                IMAGETYPE_JPEG => @imagecreatefromjpeg($fullPath),
                IMAGETYPE_PNG => @imagecreatefrompng($fullPath),
                default => null,
            };

            if (! $src) {
                return $path;
            }

            if ($width > $maxWidth && $width > 0) {
                $newWidth = $maxWidth;
                $newHeight = (int) round(($height / $width) * $newWidth);
                $dst = imagecreatetruecolor($newWidth, $newHeight);
                imagepalettetotruecolor($dst);
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($src);
                $src = $dst;
            } else {
                imagepalettetotruecolor($src);
                imagealphablending($src, true);
                imagesavealpha($src, true);
            }

            $webpRelPath = preg_replace('/\.(jpe?g|png)$/i', '.webp', $path);
            $webpFullPath = Storage::disk('public')->path($webpRelPath);

            if (@imagewebp($src, $webpFullPath, $quality)) {
                imagedestroy($src);
                if ($webpRelPath !== $path) {
                    Storage::disk('public')->delete($path);
                }

                return $webpRelPath;
            }

            imagedestroy($src);
        } catch (\Throwable) {
            return $path;
        }

        return $path;
    }

    public static function publicUrl(?string $path, string $fallback = '/operator-wozki-widlowe.webp'): string
    {
        if (! $path) {
            return $fallback;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
