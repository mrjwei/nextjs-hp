import Image from "next/image"
import Link from "next/link"
import { ArrowIcon } from "@/components/footer"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "About",
  description: "Introduction of Jesse Wei",
  pathname: "/about",
})

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[1024px] mx-auto">
      <span className="eyebrow">About</span>
      <h1 className="mt-3 mb-10 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-strong)]">About me</h1>
      <div className="grid grid-cols-12 gap-8 md:gap-16">
        <div className="text-[var(--text-body)] col-span-12 order-2 md:col-span-8 md:order-1">
          <p className="mb-4">
            Hi, I am Jesse. I build things at the{" "}
            <strong className="text-[var(--text-strong)]">
              intersection of design, engineering, and emerging technologies
            </strong>
            .
          </p>
          <p className="mb-4">
            My career began in product design, where I spent years thinking
            deeply about how people interact with technology and how good
            products are shaped by real user needs. Over time, I became
            increasingly curious about what happens beneath the interface:
            the systems, architectures, and technologies that make products
            work. That curiosity led me to{" "}
            <strong className="text-[var(--text-strong)]">
              transition from design into software engineering
            </strong>{" "}
            and pursue a Master&apos;s degree in IT in Australia.
          </p>
          <p className="mb-4">
            Today, I focus on building useful tools and understanding complex
            systems. My interests range from software engineering and
            AI-powered applications to system architecture and knowledge
            systems. I enjoy{" "}
            <strong className="text-[var(--text-strong)]">
              turning complex ideas into practical solutions
            </strong>{" "}
            and I like{" "}
            <strong className="text-[var(--text-strong)]">
              writing about my explorations and how technology works in
              general
            </strong>
            . Having lived and worked across China and Japan and now studying
            in Australia, I bring a global perspective and a
            multidisciplinary mindset to problem-solving.
          </p>
          <p className="mb-4">
            I&apos;m particularly interested in the{" "}
            <strong className="text-[var(--text-strong)]">
              future of intelligent systems, software engineering and
              creative workflows, and technology that amplifies human
              capability
            </strong>
            . My goal is to combine design thinking, engineering skills, and
            curiosity to create technology that is both powerful and
            accessible.
          </p>
          <p>
            I&apos;m always open to connecting and collaborating on exciting
            projects. Feel free to follow me on
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              <span>LinkedIn</span>
            </Link>
            <span>,&nbsp;</span>
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://bsky.app/profile/mrjwei.bsky.social"
            >
              <ArrowIcon />
              <span>Bluesky</span>
            </Link>
            <span>,&nbsp;</span>
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              <span>GitHub</span>
            </Link>
            <span>,&nbsp;</span>
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.instagram.com/mrjwei/"
            >
              <ArrowIcon />
              <span>Instagram</span>
            </Link>
            <span>.</span>
          </p>
        </div>
        <div className="col-12 order-1 md:col-span-4 md:order-2">
          <Image
            src="/avatar.png"
            alt="Jesse Wei's avatar"
            width={563}
            height={517}
            className="max-w-[160px] h-auto rounded-lg"
            sizes="160px"
            priority
          />
        </div>
      </div>
    </section>
  )
}
