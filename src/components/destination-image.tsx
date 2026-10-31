"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fallbackImageFor, isValidRemoteImage } from "@/lib/destinations";

type DestinationImageProps = {
  src?: string;
  alt: string;
  /** Position of the destination in the list — picks the local fallback asset. */
  index: number;
  sizes: string;
  className?: string;
};

/**
 * Renders a destination image from the API, silently falling back to a local
 * asset when the URL is missing, malformed, or fails to load.
 */
function DestinationImage({ src, alt, index, sizes, className }: DestinationImageProps) {
  const fallback = fallbackImageFor(index);
  const [imageSrc, setImageSrc] = useState(isValidRemoteImage(src) ? src! : fallback);
  // Remote API images load directly in the browser (no optimizer request), so
  // an unreachable URL can't produce server 500s — onError swaps in the fallback.
  const isRemote = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={false}
      unoptimized={isRemote}
      className={cn("object-cover", className)}
      onError={() => {
        if (imageSrc !== fallback) setImageSrc(fallback);
      }}
    />
  );
}

export { DestinationImage };
