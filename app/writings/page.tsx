import { FilterWritings } from "app/components/filter-writings"
import { getWritings } from "app/utils"

export const metadata = {
  title: "Writings",
  description: "My blog posts, tutorials and more.",
}

export default async function Page() {
  const writings = getWritings().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  return (
    <section className="py-24 w-full px-16 max-w-[1024px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Writings</h1>
        <p className="text-gray-600">My blog posts, tutorials, and more.</p>
      </div>
      <FilterWritings writings={writings} />
    </section>
  )
}
