import { Grid } from "@/components/grid"
import { getAllSortedGallery } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "Gallery",
  description:
    "Illustrations and visual experiments — made for fun, not for a client.",
  pathname: "/gallery",
  alternatePathname: "/ja/gallery",
  alternateLang: "ja",
})

export const dynamic = "force-static"

export default async function GalleryPage() {
  const items = getAllSortedGallery()

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <span className="eyebrow">Gallery</span>
        <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">Gallery</h1>
        <p className="text-lg text-[var(--text-muted)] mb-4">
          Illustrations and visual experiments — made for fun, not for a client.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--text-strong)]">No items yet</h2>
          <p className="text-[var(--text-muted)]">
            Add MDX files under <code>app/gallery/posts</code> to populate this page.
          </p>
        </div>
      ) : (
        <Grid writings={items} path="gallery" />
      )}
    </div>
  )
}
