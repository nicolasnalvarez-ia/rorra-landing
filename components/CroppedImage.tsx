import { CROP_ASPECT, focalStyle, type CroppedPhoto } from "@/lib/content";

/**
 * Renders a CroppedPhoto at the shared 3:4 aspect ratio, honoring its saved
 * crop position and zoom. Needs its own overflow: hidden wrapper (provided
 * here) since zooming in scales the <img> past its own box.
 */
export default function CroppedImage({
  photo,
  alt,
  style,
}: {
  photo: CroppedPhoto;
  alt: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ overflow: "hidden", aspectRatio: CROP_ASPECT, display: "block", ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...focalStyle(photo.focal) }}
      />
    </div>
  );
}
