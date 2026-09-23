import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Grid } from "@/components/grid"
import { WorkCard } from "@/components/work-card"
import { AvailabilityChip } from "@/components/availability-chip"
import { ProofStrip } from "@/components/proof-strip"
import { HowIWork } from "@/components/how-i-work"
import { NowBand } from "@/components/now-band"
import {
  getAllSortedWritings,
  getFeaturedWritings,
  isWorkItem,
  sortWorkItems,
} from "app/utils"
import { profile } from "app/content/profile"

export default function Page() {
  const writings = getAllSortedWritings()
  const caseStudies = sortWorkItems(writings.filter((w) => isWorkItem(w.metadata))).slice(
    0,
    3
  )
  const featuredWriting = getFeaturedWritings(writings, {
    focusTags: profile.en.focusTags,
    limit: 4,
    excludeSlugs: caseStudies.map((w) => w.slug),
  })
  const p = profile.en

  return (
    <section className="w-full">
      {/* Hero */}
      <div className="mx-auto w-full max-w-[1120px] px-8 pt-28 pb-20 md:pt-36 md:pb-24">
        <span className="eyebrow">{p.eyebrow}</span>
        <h1 className="display mt-6 text-5xl leading-[1.04] md:text-6xl">
          {p.headline}
        </h1>
        <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
          {p.subhead}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/work">See selected work</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/about">About me</Link>
          </Button>
        </div>
        <AvailabilityChip availability={p.availability} />
      </div>

      {/* Proof strip */}
      <div className="w-full border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-14">
          <ProofStrip items={p.proof} />
        </div>
      </div>

      {/* Selected work */}
      <div className="w-full bg-[var(--surface-sunken)] border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="eyebrow">Case Studies</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                Selected work
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              See all
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {caseStudies.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      </div>

      {/* How I work */}
      <div className="w-full border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10">
            <span className="eyebrow">Process</span>
            <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
              How I work
            </h2>
          </div>
          <HowIWork items={p.howIWork} />
        </div>
      </div>

      {/* Featured writing */}
      <div className="w-full bg-[var(--surface-sunken)] border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="eyebrow">Featured</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                Writing
              </h2>
            </div>
            <Link
              href="/writings"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              All writing
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <Grid writings={featuredWriting} path="writings" />
        </div>
      </div>

      {/* Now band */}
      {p.features.now && (
        <div className="w-full border-t border-[var(--border-subtle)]">
          <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
            <NowBand lang="en" />
          </div>
        </div>
      )}
    </section>
  )
}
