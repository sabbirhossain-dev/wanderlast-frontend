import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  MapPin,
  Star,
  Tag,
} from "lucide-react";
import { DestinationActions } from "@/components/destination-actions";
import { DestinationImage } from "@/components/destination-image";
import { formatPrice, getDestination } from "@/lib/destinations";

function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[destinationId]">) {
  const { destinationId } = await params;
  const destination = await getDestination(destinationId);

  return {
    title: destination
      ? `${destination.destinationName} | Wanderlust`
      : "Destination Not Found | Wanderlust",
  };
}

const DestinationsDetailsPage = async ({
  params,
}: PageProps<"/destinations/[destinationId]">) => {
  const { destinationId } = await params;
  const destination = await getDestination(destinationId);

  if (!destination) {
    return (
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f6fb] text-[#2ba5c9]">
            <MapPin className="h-7 w-7" />
          </span>
          <h1 className="mt-6 text-3xl font-light tracking-tight text-foreground md:text-4xl">
            Destination not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            The destination you&apos;re looking for doesn&apos;t exist or may
            have been removed.
          </p>
          <Link
            href="/destinations"
            className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-[#2ba5c9] px-5 text-xs font-medium tracking-wide text-white uppercase transition-colors hover:bg-[#2492b3]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to destinations
          </Link>
        </div>
      </section>
    );
  }

  const price = formatPrice(destination.price);
  const departure = formatDate(destination.departureDate);
  const imageIndex = [...destination._id].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  // Only show a rating when the API actually provides one.
  const rating =
    typeof destination.rating === "number" && Number.isFinite(destination.rating)
      ? destination.rating
      : null;

  const meta = [
    { icon: CalendarDays, label: "Duration", value: destination.duration },
    { icon: CalendarClock, label: "Departure", value: departure },
    { icon: Tag, label: "Category", value: destination.category },
  ];

  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-[#2ba5c9]/40 hover:text-[#2ba5c9]"
        >
          <ArrowLeft className="h-4 w-4" />
          All destinations
        </Link>

        {/* Hero */}
        <div className="relative mt-6 aspect-[16/11] w-full overflow-hidden rounded-3xl bg-muted shadow-lg sm:aspect-[16/9] lg:aspect-[21/9]">
          <DestinationImage
            src={destination.imageUrl}
            alt={destination.destinationName}
            index={imageIndex}
            sizes="(min-width: 1024px) 90vw, 100vw"
            className="transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 md:p-8">
            <div className="min-w-0">
              {destination.category ? (
                <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#2ba5c9] uppercase backdrop-blur-sm">
                  {destination.category}
                </span>
              ) : null}
              <h1 className="mt-2 text-2xl font-light tracking-tight break-words text-white drop-shadow-sm sm:text-3xl md:text-4xl">
                {destination.destinationName}
              </h1>
              {destination.country ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/85">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {destination.country}
                </p>
              ) : null}
            </div>

            {rating !== null ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-sm">
                {rating.toFixed(1)}
                <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              </span>
            ) : null}
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3 lg:gap-10">
          <aside className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:order-2">
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
              Price per person
            </p>
            <p className="mt-1.5 text-4xl font-light tracking-tight text-foreground">
              ${price}
            </p>

            {rating !== null ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-amber-500" />
                {rating.toFixed(1)} guest rating
              </p>
            ) : null}

            <div className="my-5 h-px bg-border/70" />

            <DestinationActions destinationId={destinationId} layout="stack" />
          </aside>

          <div className="lg:order-1 lg:col-span-2">
            <h2 className="text-xl font-light tracking-tight text-foreground md:text-2xl">
              About this destination
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {destination.description?.trim() ||
                "No description has been added for this destination yet."}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              {meta.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-[#2ba5c9]/40"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f6fb] text-[#2ba5c9]">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <dt className="mt-3 text-[11px] tracking-wide text-muted-foreground uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm break-words font-medium text-foreground">
                    {item.value?.trim() || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsDetailsPage;
