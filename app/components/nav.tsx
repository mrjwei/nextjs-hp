import Link from "next/link"
import Image from "next/image"
import {kanit} from 'app/data/fonts'

const navItems = {
  "/": {
    name: "Home",
  },
  "/artworks": {
    name: "Artworks",
  },
  "/articles": {
    name: "Articles",
  },
  "/series": {
    name: "Series",
  },
}

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" aria-label="home" className="mr-4">
            <Image
              src="/avatar.png"
              alt="Jesse Wei's avatar"
              width={72}
              height={72}
            />
          </Link>
          <nav
            className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
            id="nav"
          >
            {Object.entries(navItems).map(([path, { name }]) => {
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 ${kanit.className}`}
                  >
                    {name}
                  </Link>
                )
              })}
          </nav>
        </div>
        <div className="flex items-center">
          <Link target="_blank" href="https://bsky.app/profile/mrjwei.bsky.social" className="px-2 m-1">
            <Image
              src="/bluesky.svg"
              alt="bluesky"
              width={24}
              height={24}
            />
          </Link>
          <Link target="_blank" href="https://www.linkedin.com/in/jesse-wei-profile/" className="px-2 m-1">
            <Image
              src="/linkedin.png"
              alt="linkedin"
              width={24}
              height={24}
            />
          </Link>
          <Link target="_blank" href="https://github.com/mrjwei" className="px-2 m-1">
            <Image
              src="/github.png"
              alt="github"
              width={24}
              height={24}
            />
          </Link>
          <Link target="_blank" href="https://www.instagram.com/mrjwei/" className="px-2 m-1">
            <Image
              src="/instagram.png"
              alt="instagram"
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>
    </aside>
  )
}
