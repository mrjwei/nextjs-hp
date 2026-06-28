import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Grid } from "@/components/grid"
import { getAllSortedPortfolio, getAllSortedWritings } from "app/utils"

export default function Page() {
  const writings = getAllSortedWritings()
  const portfolio = getAllSortedPortfolio()
  return (
    <section className="w-full">
      {/* Hero */}
      <div className="mx-auto w-full max-w-[1120px] px-8 pt-24 pb-20 md:pt-32">
        <span className="eyebrow">Designer &amp; engineer</span>
        <h1 className="display mt-6 text-5xl leading-[1.04] md:text-6xl">
          Calm, considered software.
        </h1>
        <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-text-muted md:text-xl">
          I build tools that hold up — clear, quiet, and made with care from the
          type up.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="primary">
            <Link href="/portfolio">See selected work</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/about">About</Link>
          </Button>
        </div>
      </div>

      {/* Latest writings */}
      <div className="mx-auto w-full max-w-[1024px] px-8 py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Latest writings
          </h2>
          <Link
            href="/writings"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent-text hover:underline"
          >
            See all <ArrowRight className="size-4" />
          </Link>
        </div>
        <Grid writings={writings} numWritings={4} />
      </div>

      {/* Latest portfolio */}
      <div className="mx-auto w-full max-w-[1024px] px-8 py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Latest work
          </h2>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent-text hover:underline"
          >
            See all <ArrowRight className="size-4" />
          </Link>
        </div>
        <Grid writings={portfolio} numWritings={4} path="portfolio" />
      </div>
    </section>
  )
}
