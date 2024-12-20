import {kanit} from 'app/data/fonts'

function ArrowIcon() {
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
    <footer className="mt-16 mb-8 border-t-2 border-neutral-200">
      <div className="max-w-2xl lg:max-w-3xl mx-4 lg:mx-auto min-w-0 flex flex-col px-2 md:px-0">
        <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
          {/* <li>
            <a
              className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              rel="noopener noreferrer"
              target="_blank"
              href="/rss"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${kanit.className}`}>rss</p>
            </a>
          </li> */}
          <li>
            <a
              className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              rel="noopener noreferrer"
              target="_blank"
              href="https://bsky.app/profile/mrjwei.bsky.social"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${kanit.className}`}>Bluesky</p>
            </a>
          </li>
          <li>
            <a
              className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${kanit.className}`}>LinkedIn</p>
            </a>
          </li>
          <li>
            <a
              className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${kanit.className}`}>GitHub</p>
            </a>
          </li>
          <li>
            <a
              className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.instagram.com/mrjwei/"
            >
              <ArrowIcon />
              <p className={`ml-2 h-7 ${kanit.className}`}>Instagram</p>
            </a>
          </li>
        </ul>
        <p className="mt-8 text-neutral-600 dark:text-neutral-300">
          © {new Date().getFullYear()} Jesse Wei
        </p>
      </div>
    </footer>
  )
}
