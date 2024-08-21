import { Works } from 'app/components/works'

export const metadata = {
  title: 'Works',
  description: 'View my works.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8">Works</h1>
      <Works />
    </section>
  )
}
