import { Works } from 'app/components/works'

export const metadata = {
  title: 'Artworks',
  description: 'View my artworks.',
}

export default function Page() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-8">Artworks</h1>
      <Works hasSeeMore={false} />
    </section>
  )
}
