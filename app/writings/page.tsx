import { Writings } from 'app/components/writings'

export const metadata = {
  title: 'Writings',
  description: 'Read my writings.',
}

export default function Page() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-8">Writings</h1>
      <Writings hasSeeMore={false} />
    </section>
  )
}
