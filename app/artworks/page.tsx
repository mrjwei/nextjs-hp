import { Works } from "app/components/works"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "Artworks",
  description: "View my artworks.",
  pathname: "/artworks",
})

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[1024px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Artworks</h1>
        <p className="text-gray-600">
          My original logos, illustrations and more.
        </p>
      </div>
      <Works priorityCount={2} />
    </section>
  )
}
