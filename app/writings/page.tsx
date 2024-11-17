import { Articles } from 'app/components/posts'

export const metadata = {
  title: 'Writings',
  description: 'Read my writings.',
}

export default function Page() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-8">Writings</h1>
      <Articles hasSeeMore={false} />
    </section>
  )
}
