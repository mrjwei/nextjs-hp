import Image from "next/image"
import Link from "next/link"
import { ArrowIcon } from "app/components/footer"
import { openSans } from "app/data/fonts"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "About",
  description: "Introduction of Jesse Wei",
  pathname: "/about",
})

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[1024px] mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900">About Me</h1>
        <div className="grid grid-cols-12 gap-8 md:gap-16">
          <div className="text-neutral-800 col-span-12 order-2 md:col-span-8 md:order-1">
            <p className="mb-4">
              Hi, I am Jesse, a creator passionate about{" "}
              <strong>blending design and technology</strong> to craft
              innovative and impactful products.
            </p>
            <p className="mb-4">
              With 10 years of experience in{" "}
              <strong>creative problem-solving</strong>, I’ve helped businesses
              and individuals thrive while{" "}
              <strong>leading digital service development projects</strong> that
              merge design expertise with software engineering.
            </p>
            <p className="mb-4">
              Currently, I’m focused on{" "}
              <strong>
                envisioning and developing next-generation design tools
              </strong>{" "}
              that challenge traditional workflows and practices, pushing the
              boundaries of what’s possible in design.
            </p>
            <p className="mb-4">
              Outside of work, I enjoy illustrating vector art and watching
              Premier League matches.
            </p>
            <p>
              I’m always open to connecting and collaborating on exciting
              projects. Feel free to follow me on
              <Link
                className="inline-flex items-center transition-colors text-blue-600 hover:text-blue-700 hover:underline mx-1"
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.linkedin.com/in/jesse-wei-profile/"
              >
                <ArrowIcon />
                <span className={`ml-1 h-7 ${openSans.className}`}>
                  LinkedIn
                </span>
              </Link>
              <span>,&nbsp;</span>
              <Link
                className="inline-flex items-center transition-colors text-blue-600 hover:text-blue-700 hover:underline mx-1"
                rel="noopener noreferrer"
                target="_blank"
                href="https://bsky.app/profile/mrjwei.bsky.social"
              >
                <ArrowIcon />
                <span className={`ml-1 h-7 ${openSans.className}`}>
                  Bluesky
                </span>
              </Link>
              <span>,&nbsp;</span>
              <Link
                className="inline-flex items-center transition-colors text-blue-600 hover:text-blue-700 hover:underline mx-1"
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/mrjwei"
              >
                <ArrowIcon />
                <span className={`ml-1 h-7 ${openSans.className}`}>GitHub</span>
              </Link>
              <span>,&nbsp;</span>
              <Link
                className="inline-flex items-center transition-colors text-blue-600 hover:text-blue-700 hover:underline mx-1"
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.instagram.com/mrjwei/"
              >
                <ArrowIcon />
                <span className={`ml-1 h-7 ${openSans.className}`}>
                  Instagram
                </span>
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
              className="max-w-[120px] h-auto"
              sizes="120px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
