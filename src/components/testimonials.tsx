"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical: Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/assets/person1.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations: The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/assets/person2.png",
  },
  {
    quote:
      "The Safari In Kenya Was A Once-In-A-Lifetime Experience: Witnessing The Great Migration Up Close Left Us Speechless. Flawless Organization Throughout.",
    name: "Emma Williams",
    location: "London, UK",
    image: "/assets/person1.png",
  },
  {
    quote:
      "Santorini Sunsets Were Even More Beautiful Than The Photos: The Private Boat Tour And Local Cuisine Made This Honeymoon Truly Unforgettable.",
    name: "David Brown",
    location: "Sydney, Australia",
    image: "/assets/person2.png",
  },
];

function Testimonials() {
  return (
    <section className="bg-background px-4 py-16 md:px-6 md:py-24">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="mx-auto w-full max-w-6xl"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-light tracking-tight text-foreground md:text-5xl">
              What Travelers Say
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Real experiences from our happy travelers
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 pt-2">
            <CarouselPrevious className="static my-0 size-10 rounded-full border-border text-foreground hover:border-[#2ba5c9] hover:text-[#2ba5c9]" />
            <CarouselNext className="static my-0 size-10 rounded-full border-border text-foreground hover:border-[#2ba5c9] hover:text-[#2ba5c9]" />
          </div>
        </div>

        <CarouselContent className="mt-10">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2">
              <article className="flex h-full items-stretch gap-5 rounded-lg border border-border bg-background p-5 md:p-6">
                <div className="flex flex-1 flex-col">
                  <blockquote className="text-sm leading-relaxed text-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-auto pt-6">
                    <p className="text-sm font-medium text-[#2ba5c9]">
                      &mdash; {testimonial.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="relative aspect-[4/5] w-28 shrink-0 self-center overflow-hidden rounded-md md:w-36">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="(max-width: 768px) 112px, 144px"
                    className="object-cover"
                  />
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export { Testimonials };
