const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type Destination = {
  _id: string;
  destinationName: string;
  country?: string;
  category?: string;
  price: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
};
// fallback

const FALLBACK_IMAGES = [
  "/assets/destinations/image1.png",
  "/assets/destinations/image2.png",
  "/assets/destinations/image3.png",
  "/assets/destinations/image4.png",
  "/assets/destinations/image5.png",
  "/assets/destinations/image6.png",
];

/** Per-URL probe results so a dead link is only ever checked once per server run. */
const imageUrlChecks = new Map<string, Promise<boolean>>();

const IMAGE_EXTENSION = /\.(png|jpe?g|webp|gif|avif|svg)(?:$|\?)/i;

function isImageResponse(url: string, res: Response): boolean {
  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
  if (contentType.startsWith("image/")) return true;
  // Some CDNs omit/mislabel the type — trust a real image extension instead.
  return contentType === "" || contentType.includes("octet-stream")
    ? IMAGE_EXTENSION.test(url)
    : false;
}

/**
 * Checks that an imageUrl actually points to a reachable image before the
 * browser requests it. Dead/invalid URLs would otherwise fail in the Next
 * image optimizer (500s in the console + terminal stack traces).
 */
async function isRenderableImage(url: string): Promise<boolean> {
  const cached = imageUrlChecks.get(url);
  if (cached) return cached;

  const probe = (async () => {
    try {
      const head = await fetch(url, {
        method: "HEAD",
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(3000),
      });
      if (head.ok && isImageResponse(url, head)) return true;

      // Some image hosts reject or mishandle HEAD — retry with a 1-byte ranged GET.
      const get = await fetch(url, {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
        headers: { Range: "bytes=0-0" },
        signal: AbortSignal.timeout(3000),
      });
      const usable = get.ok || get.status === 206;
      const looksLikeImage = isImageResponse(url, get);
      await get.body?.cancel().catch(() => {});
      return usable && looksLikeImage;
    } catch {
      // Unreachable host, timeout, DNS failure, etc.
      return false;
    }
  })();

  imageUrlChecks.set(url, probe);
  return probe;
}

//function
function isDynamicUsageError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("Dynamic server usage");
}

/** Strips imageUrls that would only produce broken-image errors client-side. */
async function withValidImageUrl(item: Destination): Promise<Destination> {
  if (!item.imageUrl) return item;
  if (!isValidRemoteImage(item.imageUrl)) return { ...item, imageUrl: undefined };
  const reachable = await isRenderableImage(item.imageUrl);
  return reachable ? item : { ...item, imageUrl: undefined };
}

async function getDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch destinations: ${res.status}`);
      return [];
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return await Promise.all((data as Destination[]).map(withValidImageUrl));
  } catch (error) {
    // Let Next's static-render probe propagate so the route stays dynamic.
    if (isDynamicUsageError(error)) throw error;
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

/** Fetches a single destination from the real API (GET /destination/:id). */
async function getDestination(id: string): Promise<Destination | null> {
  if (!id) return null;

  try {
    const res = await fetch(
      `${API_BASE_URL}/destination/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );

    if (res.ok) {
      const data: unknown = await res.json();
      if (data && typeof data === "object" && !Array.isArray(data)) {
        // Return API data as-is — the page renders the real imageUrl directly.
        return data as Destination;
      }
      return null;
    }

    if (res.status >= 500) {
      console.error(`Failed to fetch destination ${id}: ${res.status}`);
    }
    // 404 = unknown id (or route not deployed) — fall through to the list.
  } catch (error) {
    if (isDynamicUsageError(error)) throw error;
    console.error(`Failed to fetch destination ${id}:`, error);
  }

  const items = await getDestinations();
  return items.find((item) => item._id === id) ?? null;
}

function isValidRemoteImage(src?: string): boolean {
  if (!src) return false;
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function fallbackImageFor(index: number): string {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]!;
}

function formatPrice(price: string | number): string {
  const value = Number(price);
  return Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "0";
}

/** Stable placeholder rating (4.0–5.0) until the API provides a real one. */
function displayRating(destination: Destination): number {
  if (typeof destination.rating === "number" && Number.isFinite(destination.rating)) {
    return destination.rating;
  }

  let hash = 0;
  for (const char of destination._id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return 4 + (hash % 11) / 10;
}

export type { Destination };
export {
  API_BASE_URL,
  getDestinations,
  getDestination,
  isValidRemoteImage,
  fallbackImageFor,
  formatPrice,
  displayRating,
};
