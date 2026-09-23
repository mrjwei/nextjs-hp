import { Grid } from "@/components/grid"
import { JaEmptyNotice } from "@/components/ja-empty-notice"
import { getAllSortedGallery } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "ギャラリー",
  description: "イラストやビジュアルの実験——仕事ではなく、趣味で作ったもの。",
  pathname: "/ja/gallery",
  alternatePathname: "/gallery",
  alternateLang: "en",
})

export const dynamic = "force-static"

export default async function GalleryPage() {
  const items = getAllSortedGallery("ja")

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <span className="eyebrow">ギャラリー</span>
        <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
          ギャラリー
        </h1>
        <p className="text-lg text-[var(--text-muted)] mb-4">
          イラストやビジュアルの実験——仕事ではなく、趣味で作ったもの。
        </p>
      </div>

      {items.length === 0 ? (
        <JaEmptyNotice englishHref="/gallery" englishLabel="英語版のギャラリーを見る" />
      ) : (
        <Grid writings={items} path="gallery" lang="ja" />
      )}
    </div>
  )
}
