import { Works } from "app/components/works"

export const metadata = {
  title: "Artworks",
  description: "View my artworks.",
}

export default function Page() {
  return (
    <section className="py-24 w-full px-16 max-w-[1024px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Artworks</h1>
        <p className="text-gray-600">
          My original logos, illustrations and more.
        </p>
      </div>
      <Works hasSeeMore={false} />
    </section>
  )
}
