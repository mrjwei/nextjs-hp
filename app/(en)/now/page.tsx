import { CustomMDX } from "@/components/mdx"
import { buildStandardMetadata } from "app/seo/metadata"
import { getPageContent } from "app/pages-content"
import { formatDate } from "app/utils"

const now = getPageContent("now", "en")

export const metadata = buildStandardMetadata({
  title: "Now",
  description: now.metadata.description,
  pathname: "/now",
  alternatePathname: "/ja/now",
  alternateLang: "ja",
})

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[720px] mx-auto">
      <span className="eyebrow">Now</span>
      <h1 className="mt-3 mb-2 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-strong)]">
        What I&apos;m on
      </h1>
      {now.metadata.updatedAt && (
        <p className="mb-10 text-sm text-[var(--text-subtle)]">
          Updated {formatDate(now.metadata.updatedAt)}
        </p>
      )}
      <article className="prose text-[var(--text-body)]">
        <CustomMDX source={now.content} />
      </article>
    </section>
  )
}
