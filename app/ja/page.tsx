import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Grid } from "@/components/grid"
import { WorkCard } from "@/components/work-card"
import { JaEmptyNotice } from "@/components/ja-empty-notice"
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
  const writings = getAllSortedWritings("ja")
  const caseStudies = sortWorkItems(writings.filter((w) => isWorkItem(w.metadata))).slice(
    0,
    3
  )
  const featuredWriting = getFeaturedWritings(writings, {
    focusTags: profile.ja.focusTags,
    limit: 4,
    excludeSlugs: caseStudies.map((w) => w.slug),
  })
  const p = profile.ja

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
            <Link href="/ja/work">代表的な実績を見る</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/ja/about">プロフィール</Link>
          </Button>
        </div>
        <AvailabilityChip availability={p.availability} lang="ja" />
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
              <span className="eyebrow">ケーススタディ</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                代表的な実績
              </h2>
            </div>
            <Link
              href="/ja/work"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              すべて見る
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {caseStudies.length === 0 ? (
            <JaEmptyNotice englishHref="/work" englishLabel="英語版の実績を見る" />
          ) : (
            <div className="grid grid-cols-12 gap-y-8 md:gap-8">
              {caseStudies.map((work) => (
                <WorkCard key={work.slug} work={work} lang="ja" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How I work */}
      <div className="w-full border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10">
            <span className="eyebrow">Process</span>
            <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
              仕事の進め方
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
              <span className="eyebrow">新着</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                記事
              </h2>
            </div>
            <Link
              href="/ja/writings"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              すべて見る
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {featuredWriting.length === 0 ? (
            <JaEmptyNotice englishHref="/writings" englishLabel="英語版の記事を見る" />
          ) : (
            <Grid writings={featuredWriting} path="writings" lang="ja" />
          )}
        </div>
      </div>

      {/* Now band */}
      {p.features.now && (
        <div className="w-full border-t border-[var(--border-subtle)]">
          <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
            <NowBand lang="ja" />
          </div>
        </div>
      )}
    </section>
  )
}
