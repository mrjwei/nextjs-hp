import {kanit} from 'app/data/fonts'
import { Articles } from 'app/components/articles'
import { Works } from 'app/components/works'
import { Series } from 'app/components/series'

export default function Page() {
  return (
    <section>
      <h1 className={`mb-4 text-4xl font-medium text-neutral-600 ${kanit.className}`}>
        <span className="font-bold italic">Jesse</span> <span className="text-neutral-500">is a creator who is passionate about the intersection of</span> <span className="font-bold italic">creativity and technology</span>.
      </h1>
      <h2 className="mb-4 text-xl text-neutral-600">
        This space is where I showcase my artworks and my creative experiments, document the design and development processes, and share my thoughts on blending these two worlds.
      </h2>
      <div className="my-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Latest Artworks</h2>
          <Works numWorks={3} />
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Popular Articles</h2>
          <Articles numArticles={6} />
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">New Series</h2>
          <Series numSeries={1} />
        </div>
      </div>
    </section>
  )
}
