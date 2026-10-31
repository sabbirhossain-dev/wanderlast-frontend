import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

function CallToAction() {
  return (
    <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden md:min-h-[440px]">
      <Image
        src="/assets/CTA.png"
        alt="Airplane flying over a tropical island"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex flex-col items-center px-4 py-16 text-center">
        <h2 className="text-3xl font-light italic tracking-tight text-white md:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 max-w-xl text-sm text-white md:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href="/destinations"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "mt-8 h-auto rounded-md bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-black uppercase shadow-md hover:bg-white/90"
          )}
        >
          Book Your Trip Today
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

export { CallToAction }
