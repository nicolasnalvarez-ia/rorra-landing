"use client";

/**
 * Shrinks a photo in the browser before uploading it. Phone photos are
 * routinely 4-8MB, far more than the landing ever renders, and the free
 * Supabase tier is ~1GB — so the goal is a big size win with no visible
 * quality loss, not the smallest possible file.
 */

/** Longest side after resizing. The biggest on-screen photo is ~700px CSS, so this still covers 3x displays. */
const MAX_DIMENSION = 2400;
const QUALITY = 0.92;
/** Animated GIFs would lose their animation through a canvas, so they pass through untouched. */
const PASSTHROUGH_TYPES = ["image/gif"];

export type CompressionResult = {
  file: File;
  originalSize: number;
  size: number;
};

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Halving repeatedly before the final draw: a single large downscale in one
 * step makes fine detail (hair, fabric texture) look aliased, because the
 * browser samples too few source pixels per destination pixel.
 */
function drawScaled(source: ImageBitmap, targetWidth: number, targetHeight: number): HTMLCanvasElement {
  let currentWidth = source.width;
  let currentHeight = source.height;
  let current: HTMLCanvasElement | ImageBitmap = source;

  while (currentWidth > targetWidth * 2 && currentHeight > targetHeight * 2) {
    currentWidth = Math.round(currentWidth / 2);
    currentHeight = Math.round(currentHeight / 2);
    const step = document.createElement("canvas");
    step.width = currentWidth;
    step.height = currentHeight;
    const stepCtx = step.getContext("2d");
    if (!stepCtx) break;
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.drawImage(current, 0, 0, currentWidth, currentHeight);
    current = step;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(current, 0, 0, targetWidth, targetHeight);
  return canvas;
}

export async function compressImage(file: File): Promise<CompressionResult> {
  const originalSize = file.size;
  const unchanged = { file, originalSize, size: originalSize };

  if (PASSTHROUGH_TYPES.includes(file.type)) return unchanged;
  if (typeof createImageBitmap !== "function") return unchanged;

  let bitmap: ImageBitmap;
  try {
    // "from-image" applies the EXIF orientation, so portrait phone photos
    // don't come out sideways.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return unchanged;
  }

  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = drawScaled(bitmap, width, height);
    const blob = await canvasToBlob(canvas, "image/webp", QUALITY);

    // Already-small or already-efficient files can come out bigger; keep the original then.
    if (!blob || blob.type !== "image/webp" || blob.size >= originalSize) return unchanged;

    const name = `${file.name.replace(/\.[a-z0-9]+$/i, "")}.webp`;
    return {
      file: new File([blob], name, { type: "image/webp", lastModified: file.lastModified }),
      originalSize,
      size: blob.size,
    };
  } catch {
    return unchanged;
  } finally {
    bitmap.close();
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
