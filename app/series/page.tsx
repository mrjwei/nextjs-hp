import { Series } from 'app/components/series'

export const metadata = {
  title: 'Series',
  description: 'Read my series.',
}

export default function Page() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-8">Series</h1>
      <Series hasSeeMore={false} />
    </section>
  )
}
