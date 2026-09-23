import { Grid } from "@/components/grid"
import { getAllSortedWritings } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "Work",
  description:
    "Selected case studies — applied AI systems and product work shipped for real businesses.",
  pathname: "/work",
  alternatePathname: "/ja/work",
  alternateLang: "ja",
})

export const dynamic = "force-static"

export default async function WorkPage() {
  const work = getAllSortedWritings().filter((w) =>
    w.metadata.tags.includes("casestudy")
  )

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <span className="eyebrow">Work</span>
        <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
          Work
        </h1>
        <p className="text-lg text-[var(--text-muted)] mb-4">
          Case studies — applied AI systems and product work shipped for real
          businesses.
        </p>
      </div>

      {work.length === 0 ? (
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--text-strong)]">
            No case studies yet
          </h2>
          <p className="text-[var(--text-muted)]">
            Tag a writing <code>casestudy</code> to have it appear here.
          </p>
        </div>
      ) : (
        <Grid writings={work} path="work" />
      )}
    </div>
  )
}
