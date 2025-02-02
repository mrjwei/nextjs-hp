import { Writings } from "app/components/writings"

export const metadata = {
  title: "Writings",
  description: "Read my writings.",
}

export default function Page() {
  return (
    <section className="py-24 w-full px-16 max-w-[1024px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Writings</h1>
        <p className="text-gray-600">My blog posts, tutorials and more.</p>
      </div>
      <Writings hasSeeMore={false} />
    </section>
  )
}
