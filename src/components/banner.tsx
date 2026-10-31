import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
]

function Banner() {
  return (
    <section className="relative flex min-h-[540px] flex-col justify-end overflow-hidden">
      <Image
        src="/assets/Banner.png"
        alt="Aerial view of a turquoise bay surrounded by lush green hills"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-32 text-center">
        <h1 className="max-w-3xl text-4xl font-light tracking-tight text-white md:text-6xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-5 max-w-xl text-sm text-white md:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/destinations"
            className="flex items-center gap-2 bg-[#2ba5c9] px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-[#2492b3]"
          >
            Explore Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/destinations"
            className="bg-white/25 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/35"
          >
            View Destination
          </Link>
        </div>
      </div>

      <div className="relative grid grid-cols-2 border-t border-white/20 bg-black/40 backdrop-blur-sm md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        {searchFields.map((field) => (
          <div
            key={field.label}
            className="border-r border-white/20 px-6 py-4 text-left"
          >
            <p className="text-sm font-semibold text-white">{field.label}</p>
            <p className="mt-0.5 text-xs text-white/70">{field.placeholder}</p>
          </div>
        ))}
        <button
          type="button"
          className="col-span-2 bg-[#2ba5c9] px-10 py-4 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-[#2492b3] md:col-span-1"
        >
          Search
        </button>
      </div>
    </section>
  )
}

export { Banner }
