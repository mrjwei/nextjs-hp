import Image from "next/image"
import Link from "next/link"
import { ArrowIcon } from "@/components/footer"
import { CustomMDX } from "@/components/mdx"
import { buildStandardMetadata } from "app/seo/metadata"
import { getPageContent } from "app/pages-content"

const about = getPageContent("about", "en")

export const metadata = buildStandardMetadata({
  title: "About",
  description: about.metadata.description,
  pathname: "/about",
  alternatePathname: "/ja/about",
  alternateLang: "ja",
})

const strong = "text-[var(--text-strong)]"
const h2 =
  "mt-10 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-strong)]"
const extLink =
  "inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className={extLink} rel="noopener noreferrer" target="_blank" href={href}>
      <ArrowIcon />
      <span>{children}</span>
    </Link>
  )
}

const aboutComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className={h2}>{children}</h2>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4">{children}</p>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className={strong}>{children}</strong>
  ),
  ExtLink,
}

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[1024px] mx-auto">
      <span className="eyebrow">About</span>
      <h1 className="mt-3 mb-10 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-strong)]">About me</h1>
      <div className="grid grid-cols-12 gap-8 md:gap-16">
        <div className="text-[var(--text-body)] col-span-12 order-2 md:col-span-8 md:order-1">
          <CustomMDX source={about.content} components={aboutComponents} />
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
