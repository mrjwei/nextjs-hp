import { Articles } from 'app/components/articles'

export const metadata = {
  title: 'Articles',
  description: 'Read my articles.',
}

export default function Page() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-8">Articles</h1>
      <Articles hasSeeMore={false} />
    </section>
  )
}
