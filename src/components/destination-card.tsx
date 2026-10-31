"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Star } from "lucide-react";
import { DestinationImage } from "@/components/destination-image";
import {
  displayRating,
  formatPrice,
  type Destination,
} from "@/lib/destinations";

type DestinationCardProps = {
  destination: Destination;
  index: number;
};

function DestinationCard({ destination, index }: DestinationCardProps) {
  const rating = displayRating(destination);
  const price = formatPrice(destination.price);

  return (
    <article className="group flex flex-col border border-gray-100 p-4">
      <div className="relative aspect-video w-full overflow-hidden bg-muted ">
        <DestinationImage
          src={destination.imageUrl}
          alt={destination.destinationName}
          index={index}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-neutral-900 shadow-sm">
          {rating.toFixed(1)}
          <Star className="h-3 w-3 fill-current text-neutral-900" />
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {destination.country ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {destination.country}
          </p>
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium text-foreground md:text-base">
            {destination.destinationName}
          </h3>
          <p className="shrink-0 text-sm font-medium text-foreground md:text-base">
            ${price}
            <span className="text-xs font-normal text-muted-foreground">
              /Person
            </span>
          </p>
        </div>

        {destination.duration ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {destination.duration}
          </p>
        ) : null}

        <Link
          href={`/destinations/${destination._id}`}
          className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-medium tracking-wide text-[#2ba5c9] uppercase transition-colors hover:text-[#2492b3] hover:underline"
        >
          Book Now
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export { DestinationCard };
