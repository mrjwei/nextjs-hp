import { BlogPosts } from 'app/components/posts'
import { Works } from 'app/components/works'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold tracking-tighter">
        Jesse Wei
      </h1>
      <p className="mb-4">
        I’m a product designer and self-taught software engineer, passionate about the intersection of <strong>creativity and technology</strong>. This space is where I showcase my creative works, document the design and development processes, and share my thoughts on blending these two worlds.
      </p>
      <div className="my-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Latest Works</h2>
          <Works numWorks={5} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
        <BlogPosts numPosts={5} />
      </div>
    </section>
  )
}
