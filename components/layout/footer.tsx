"use client"

import Link from "next/link"
import { NewsletterForm } from "@/components/layout/newsletter-form"
import { TrackedLink } from "@/components/layout/tracked-link"
import type { Lang } from "@/lib/i18n/config"
import { profile, type SocialId } from "@/lib/content/profile"

const copy: Record<Lang, { heading: string }> = {
  en: {
    heading: "Subscribe to the newsletter (free)"
  },
  ja: {
    heading: "メルマガ登録はこちらから（無料）"
  },
}

const socialLabels: Record<SocialId, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  email: "Email",
}

type SiteLink = { key: string; href: string; label: string }

const siteLinksByLang: Record<Lang, SiteLink[]> = {
  en: [
    { key: "rss", href: "/rss", label: "RSS" },
  ],
  ja: [
    { key: "rss", href: "/rss", label: "RSS" },
  ],
}

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

export default function Footer({ lang = "en" }: { lang?: Lang }) {
  const t = copy[lang]
  const p = profile[lang]
  const social = p.social
  const siteLinks = siteLinksByLang[lang]

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
      <div className="w-full max-w-[1024px] mx-auto flex flex-col items-center px-4 py-12 md:px-0">
        <div className="w-full max-w-[480px] flex flex-col items-center text-center">
          <h2 className="font-serif text-xl font-medium text-[var(--text-strong)]">
            {t.heading}
          </h2>
          <div className="mt-4 w-full flex justify-center">
            <NewsletterForm className="max-w-[420px]" lang={lang} />
          </div>
        </div>

        <ul className="mt-9 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-[var(--text-muted)] lg:gap-x-8">
          {siteLinks.map((link) => (
            <li key={link.key}>
              <Link
                className="flex items-center gap-2 transition-colors hover:text-[var(--text-strong)]"
                href={link.href}
              >
                <ArrowIcon />
                {link.label}
              </Link>
            </li>
          ))}
          {social.map((s) =>
            s.id === "email" ? (
              <li key={s.id}>
                <TrackedLink
                  className="flex items-center gap-2 transition-colors hover:text-[var(--text-strong)]"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={s.href}
                  eventName="contact_click"
                >
                  <ArrowIcon />
                  {socialLabels[s.id]}
                </TrackedLink>
              </li>
            ) : (
              <li key={s.id}>
                <Link
                  className="flex items-center gap-2 transition-colors hover:text-[var(--text-strong)]"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={s.href}
                >
                  <ArrowIcon />
                  {socialLabels[s.id]}
                </Link>
              </li>
            )
          )}
        </ul>
        <p className="mt-8 text-xs text-[var(--text-subtle)]">
          © {new Date().getFullYear()} Jesse Wei
        </p>
      </div>
    </footer>
  )
}
