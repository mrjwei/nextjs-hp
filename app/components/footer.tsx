import Link from "next/link"
import { openSans } from "app/data/fonts"

export function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="w-full bg-gray-200">
      <div className="w-full max-w-[1024px] mx-auto flex flex-col items-center px-2 md:px-0">
        <ul className="font-sm mt-8 flex space-x-3 lg:space-x-8 text-neutral-600">
          {/* <li>
            <a
              className="flex items-center transition-all hover:text-neutral-800"
              rel="noopener noreferrer"
              target="_blank"
              href="/rss"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${openSans.className}`}>rss</p>
            </a>
          </li> */}

          <li>
            <Link
              className="flex items-center transition-all hover:text-neutral-800"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${openSans.className}`}>LinkedIn</p>
            </Link>
          </li>
          {/*
          <li>
            <Link
              className="flex items-center transition-all hover:text-neutral-800"
              rel="noopener noreferrer"
              target="_blank"
              href="https://bsky.app/profile/mrjwei.bsky.social"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${openSans.className}`}>Bluesky</p>
            </Link>
          </li>
          */}
          <li>
            <Link
              className="flex items-center transition-all hover:text-neutral-800"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${openSans.className}`}>GitHub</p>
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center transition-all hover:text-neutral-800"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.instagram.com/mrjwei/"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${openSans.className}`}>Instagram</p>
            </Link>
          </li>
        </ul>
        <p className="mt-8 text-neutral-600">
          © {new Date().getFullYear()} Jesse Wei
        </p>
      </div>
    </footer>
  )
}
