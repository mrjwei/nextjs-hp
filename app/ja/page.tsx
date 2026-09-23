import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Grid } from "@/components/grid"
import { JaEmptyNotice } from "@/components/ja-empty-notice"
import { getAllSortedWritings } from "app/utils"

export default function Page() {
  const writings = getAllSortedWritings("ja")
  const caseStudies = writings.filter((w) => w.metadata.tags.includes("casestudy"))

  return (
    <section className="w-full">
      {/* Hero */}
      <div className="mx-auto w-full max-w-[1120px] px-8 pt-28 pb-20 md:pt-36 md:pb-24">
        <span className="eyebrow">アプライドAIエンジニア・日本／オーストラリア</span>
        <h1 className="display mt-6 text-5xl leading-[1.04] md:text-6xl">
          デモで終わらない、現場で使われるAIを。
        </h1>
        <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
          生成AI／LLMシステムを実際の業務に実装しています。日本語の複雑な文書処理から、評価設計を伴う本番運用可能なパイプラインまで一貫して担当。10年のプロダクトデザインと開発の経験が、「使われるAI」につながっています。
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/ja/writings?tags=casestudy">代表的な実績を見る</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/ja/about">プロフィール</Link>
          </Button>
        </div>
      </div>

      {/* Writing — prioritized, as cards */}
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
          {writings.length === 0 ? (
            <JaEmptyNotice englishHref="/writings" englishLabel="英語版の記事を見る" />
          ) : (
            <Grid writings={writings} numWritings={6} path="writings" lang="ja" />
          )}
        </div>
      </div>

      {/* Selected work */}
      <div className="w-full border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="eyebrow">ケーススタディ</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                代表的な実績
              </h2>
            </div>
            <Link
              href="/ja/writings?tags=casestudy"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              すべて見る
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {caseStudies.length === 0 ? (
            <JaEmptyNotice englishHref="/writings?tags=casestudy" englishLabel="英語版のケーススタディを見る" />
          ) : (
            <Grid writings={caseStudies} numWritings={4} path="writings" lang="ja" />
          )}
        </div>
      </div>
    </section>
  )
}
