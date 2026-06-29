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
      <div className="mx-auto w-full max-w-[1120px] px-8 pt-28 pb-20 md:pt-36 md:pb-24">
        <span className="eyebrow">Designer &amp; engineer</span>
        <h1 className="display mt-6 text-5xl leading-[1.04] md:text-6xl">
          Calm, considered software.
        </h1>
        <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
          I build tools that hold up — clear, quiet, and made with care from
          the type up.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/writings">Read the writing</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/portfolio">See selected work</Link>
          </Button>
        </div>
      </div>

      {/* Writing — prioritized, as cards */}
      <div className="w-full bg-[var(--surface-sunken)] border-t border-[var(--border-subtle)]">
          <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="eyebrow">Writing</span>
                <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                  Notes &amp; explorations
                </h2>
              </div>
              <Link
                href="/writings"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
              >
                See all
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <Grid writings={writings} numWritings={6} path="writings" />
          </div>
      </div>

      {/* Selected work */}
      <div className="w-full border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                A few things I&apos;ve made
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              See all
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <Grid writings={portfolio} numWritings={4} path="portfolio" />
        </div>
      </div>

      {/* About — inverted band */}
      {/* <div className="w-full bg-[var(--surface-inverse)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20 md:py-24">
          <div className="grid grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="col-span-12 md:col-span-4 order-1">
              <Image
                src="/avatar.png"
                alt="Jesse Wei's avatar"
                width={563}
                height={517}
                className="w-full max-w-[220px] h-auto rounded-lg"
                sizes="220px"
              />
            </div>
            <div className="col-span-12 md:col-span-8 order-2">
              <span className="eyebrow text-[var(--text-subtle)]">About</span>
              <p className="display mt-4 text-2xl leading-snug text-[var(--text-ondark)] md:text-3xl">
                I work at the intersection of design, engineering, and
                emerging technologies — turning complex ideas into practical,
                considered products.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-ondark)] hover:underline"
                >
                  More about me
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/jesse-wei-profile/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  <ArrowIcon />
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  )
}
