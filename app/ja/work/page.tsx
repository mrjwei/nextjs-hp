import { Grid } from "@/components/grid"
import { getAllSortedWritings } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"
import { JaEmptyNotice } from "@/components/ja-empty-notice"

export const metadata = buildStandardMetadata({
  title: "実績",
  description:
    "選定した実績・ケーススタディ——実際の事業のために構築したアプライドAIシステムとプロダクトの仕事。",
  pathname: "/ja/work",
  alternatePathname: "/work",
  alternateLang: "en",
})

export const dynamic = "force-static"

export default async function WorkPage() {
  const work = getAllSortedWritings("ja").filter((w) =>
    w.metadata.tags.includes("casestudy")
  )

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <span className="eyebrow">実績</span>
        <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
          実績
        </h1>
        <p className="text-lg text-[var(--text-muted)] mb-4">
          選定した実績・ケーススタディ——実際の事業のために構築したアプライドAIシステムとプロダクトの仕事。
        </p>
      </div>

      {work.length === 0 ? (
        <JaEmptyNotice englishHref="/work" englishLabel="英語版の実績を見る" />
      ) : (
        <Grid writings={work} path="work" lang="ja" />
      )}
    </div>
  )
}
