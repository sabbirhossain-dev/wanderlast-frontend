"use client";

import { useState } from "react";
import { DestinationCard } from "@/components/destination-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { displayRating, type Destination } from "@/lib/destinations";

const BASE_CATEGORIES = ["Beach", "Mountain", "City", "Adventure", "Cultural"];

const PRICE_RANGES = [
  { value: "all", label: "All Prices", matches: () => true },
  { value: "under-500", label: "Under $500", matches: (p: number) => p < 500 },
  {
    value: "500-1000",
    label: "$500 – $1000",
    matches: (p: number) => p >= 500 && p < 1000,
  },
  {
    value: "1000-2000",
    label: "$1000 – $2000",
    matches: (p: number) => p >= 1000 && p < 2000,
  },
  {
    value: "over-2000",
    label: "$2000 & Above",
    matches: (p: number) => p >= 2000,
  },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const filterTriggerClass =
  "h-9 w-full rounded-md border-border bg-background px-3 text-xs uppercase tracking-wide text-foreground shadow-none";

type DestinationsExplorerProps = {
  destinations: Destination[];
};

function DestinationsExplorer({ destinations }: DestinationsExplorerProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const categories = [
    ...new Set([
      ...BASE_CATEGORIES,
      ...destinations
        .map((item) => item.category)
        .filter((item): item is string => Boolean(item)),
    ]),
  ];

  const visibleDestinations = destinations.filter((item) => {
    if (category && category !== "all") {
      if ((item.category ?? "").toLowerCase() !== category.toLowerCase())
        return false;
    }

    if (priceRange && priceRange !== "all") {
      const range = PRICE_RANGES.find((option) => option.value === priceRange);
      if (range && !range.matches(Number(item.price))) return false;
    }

    return true;
  });

  if (sortBy === "price-asc") {
    visibleDestinations.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "price-desc") {
    visibleDestinations.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === "rating-desc") {
    visibleDestinations.sort((a, b) => displayRating(b) - displayRating(a));
  } else if (sortBy === "name-asc") {
    visibleDestinations.sort((a, b) =>
      a.destinationName.localeCompare(b.destinationName),
    );
  }

  const hasActiveFilters = Boolean(category || priceRange || sortBy);

  const clearFilters = () => {
    setCategory(null);
    setPriceRange(null);
    setSortBy(null);
  };

  return (
    <section className="px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-light tracking-tight text-foreground md:text-5xl">
          Explore All Destinations
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Find your perfect travel experience from our curated collection
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger size="default" className={filterTriggerClass}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item.toLowerCase()}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger size="default" className={filterTriggerClass}>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger size="default" className={filterTriggerClass}>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Showing {visibleDestinations.length}{" "}
          {visibleDestinations.length === 1 ? "destination" : "destinations"}
        </p>

        {visibleDestinations.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-10 ">
            {visibleDestinations.map((item, index) => (
              <DestinationCard
                key={item._id}
                destination={item}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {destinations.length === 0
                ? "No destinations available yet."
                : "No destinations match your filters."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 cursor-pointer text-xs font-medium tracking-wide text-[#2ba5c9] uppercase hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export { DestinationsExplorer };
