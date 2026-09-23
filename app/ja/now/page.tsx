import { CustomMDX } from "@/components/mdx"
import { buildStandardMetadata } from "app/seo/metadata"
import { getPageContent } from "app/pages-content"
import { formatDate } from "app/utils"

const now = getPageContent("now", "ja")

export const metadata = buildStandardMetadata({
  title: "いま取り組んでいること",
  description: now.metadata.description,
  pathname: "/ja/now",
  alternatePathname: "/now",
  alternateLang: "en",
})

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[720px] mx-auto">
      <span className="eyebrow">Now</span>
      <h1 className="mt-3 mb-2 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-strong)]">
        いま取り組んでいること
      </h1>
      {now.metadata.updatedAt && (
        <p className="mb-10 text-sm text-[var(--text-subtle)]">
          更新日: {formatDate(now.metadata.updatedAt)}
        </p>
      )}
      <article className="prose text-[var(--text-body)]">
        <CustomMDX source={now.content} />
      </article>
    </section>
  )
}
