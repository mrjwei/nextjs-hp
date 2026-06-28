import Link from "next/link"
import { NewsletterForm } from "@/components/newsletter-form"

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
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
      <div className="w-full max-w-[1024px] mx-auto flex flex-col items-center px-4 py-12 md:px-0">
        <div className="w-full max-w-[480px] flex flex-col items-center text-center">
          <h2 className="font-serif text-xl font-medium text-[var(--text-strong)]">
            Get new posts by email
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Occasional updates. No spam.
          </p>
          <div className="mt-4 w-full flex justify-center">
            <NewsletterForm className="max-w-[420px]" />
          </div>
        </div>

        <ul className="mt-9 flex gap-4 text-sm text-[var(--text-muted)] lg:gap-8">
          <li>
            <Link
              className="flex items-center gap-2 transition-colors hover:text-[var(--text-strong)]"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              LinkedIn
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-2 transition-colors hover:text-[var(--text-strong)]"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              GitHub
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-2 transition-colors hover:text-[var(--text-strong)]"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.instagram.com/mrjwei/"
            >
              <ArrowIcon />
              Instagram
            </Link>
          </li>
        </ul>
        <p className="mt-8 text-xs text-[var(--text-subtle)]">
          © {new Date().getFullYear()} Jesse Wei
        </p>
      </div>
    </footer>
  )
}
