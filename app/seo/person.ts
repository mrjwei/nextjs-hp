import { profile } from "app/content/profile"
import { baseUrl } from "app/sitemap"
import type { Lang } from "app/i18n/config"

// Still finishing the Master of IT at time of writing — see
// docs/roadmap/2026-09-ai-repositioning-brushup.md §6.1. Switch
// `affiliation` to `alumniOf` once the degree is conferred.
const university = {
  "@type": "CollegeOrUniversity",
  name: "Queensland University of Technology",
} as const

/** Person schema (no `@context`) shared by the standalone Person JSON-LD on Home and the ProfilePage's `mainEntity` on About. */
export function personSchema(lang: Lang) {
  const p = profile[lang]
  const aboutPath = lang === "ja" ? "/ja/about" : "/about"

  return {
    "@type": "Person",
    name: "Jesse Wei",
    jobTitle: p.role,
    url: `${baseUrl}${aboutPath}`,
    image: `${baseUrl}/avatar.png`,
    knowsLanguage: ["en", "ja", "zh", "ko"],
    sameAs: p.social
      .filter((s) => s.id === "linkedin" || s.id === "github")
      .map((s) => s.href),
    affiliation: university,
  }
}

export function buildPersonJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    ...personSchema(lang),
  }
}
