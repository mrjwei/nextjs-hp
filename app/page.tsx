import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Jesse Wei
      </h1>
      <p className="mb-4">
        I’m a product designer and self-taught software engineer, passionate about the intersection of <strong>creativity and technology</strong>. This space is where I showcase my creative works, document the design and development processes, and share my thoughts on blending these two worlds.
      </p>
      <div className="my-8">
        <BlogPosts numPosts={5} />
      </div>
    </section>
  )
}
