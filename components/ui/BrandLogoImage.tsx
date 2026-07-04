import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

/** SVG — как есть; растр — через оптимизатор Next (AVIF/WebP). */
export default function BrandLogoImage({
  src,
  alt,
  className = "object-contain opacity-85 transition-opacity group-hover:opacity-100",
  sizes = "120px",
  width,
  height,
}: Props) {
  const isSvg = src.endsWith(".svg") || src.includes(".svg?");

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`h-full w-full ${className}`}
        loading="lazy"
      />
    );
  }

  if (width != null && height != null) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading="lazy"
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
    />
  );
}
