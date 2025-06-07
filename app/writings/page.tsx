import { FilterWritings } from "app/components/filter-writings"
import { getAllSortedWritings } from "app/utils"

export const metadata = {
  title: "Writings | Jesse Wei",
  description: "My blog posts, tutorials and more.",
}

export default async function Page() {
  const writings = getAllSortedWritings()

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
