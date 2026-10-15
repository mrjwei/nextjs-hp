import { localePrefix, type Lang } from "@/lib/i18n/config"

// Kept apart from lib/content (which reads the fs) so client components such as
// WorkCard can link to project pages too.

// URL segment for a project ID: "LingoBun" -> "lingobun", "AI+Sec" -> "ai-sec".
export function getProjectSlug(project: string) {
  return project
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getProjectHref(project: string, lang: Lang = "en") {
  const prefix = localePrefix(lang)
  return `${prefix}/projects/${getProjectSlug(project)}`
}

// A post read from its project's page stays under the project path; the
// canonical URL is still the /posts one.
export function getProjectPostHref(project: string, slug: string, lang: Lang = "en") {
  return `${getProjectHref(project, lang)}/${slug}`
}
