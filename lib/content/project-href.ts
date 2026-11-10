import { localePrefix, type Lang } from "@/lib/i18n/config"

// Kept apart from lib/content (which reads the fs) so client components such as
// WorkCard and the search palette can build post and project URLs too.

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

export function getProjectPostHref(project: string, slug: string, lang: Lang = "en") {
  return `${getProjectHref(project, lang)}/${slug}`
}

// THE canonical URL of a post. Every place that links to, advertises or
// canonicalises a post (cards, search, sitemap, RSS, metadata, JSON-LD) must
// build it through here, so the three URL shapes can't drift apart:
//   project post -> /projects/<project-slug>/<slug>
//   series post  -> /posts/<series>/<slug>
//   other        -> /posts/<slug>
// Series and project are mutually exclusive (see docs/publish.md); the content
// loader enforces it. The /posts/<slug> URL of a project post permanently
// redirects to its project URL.
export function getPostHref(
  post: { slug: string; series?: string; project?: string },
  lang: Lang = "en"
) {
  if (post.project) return getProjectPostHref(post.project, post.slug, lang)
  const prefix = localePrefix(lang)
  return post.series
    ? `${prefix}/posts/${post.series}/${post.slug}`
    : `${prefix}/posts/${post.slug}`
}
