import { notFound, redirect } from "next/navigation"
import { ProjectView } from "@/components/projects/project-view"
import { ProjectPostView } from "@/components/projects/project-post-view"
import { getAllSortedWritings, getWritingBySlug, getWritingHref, groupProjects } from "@/lib/content"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, otherLang, type Lang } from "@/lib/i18n/config"
import { buildStandardMetadata } from "@/lib/seo/metadata"

// /projects/[project] and /projects/[project]/[slug], in both languages.

function getProject(lang: Lang, slug: string) {
  return groupProjects(getAllSortedWritings(lang)).find((p) => p.slug === slug)
}

// ---------------------------------------------------------------------------
// /projects/[project]

export function projectStaticParams(lang: Lang) {
  return groupProjects(getAllSortedWritings(lang)).map((p) => ({ project: p.slug }))
}

export function projectMetadata(lang: Lang, projectSlug: string) {
  const project = getProject(lang, projectSlug)
  if (!project) return

  const other = otherLang(lang)
  const hasOtherLang = !!getProject(other, projectSlug)
  return buildStandardMetadata({
    title: dictionaries[lang].projects.pageTitle(project.id),
    description: project.lead.metadata.summary,
    pathname: localeHref(lang, `/projects/${project.slug}`),
    image: project.lead.metadata.image,
    alternatePathname: hasOtherLang ? localeHref(other, `/projects/${project.slug}`) : undefined,
    alternateLang: hasOtherLang ? other : undefined,
  })
}

export function ProjectPageView({ lang, projectSlug }: { lang: Lang; projectSlug: string }) {
  const project = getProject(lang, projectSlug)
  if (!project) notFound()

  return <ProjectView project={project} lang={lang} />
}

// ---------------------------------------------------------------------------
// /projects/[project]/[slug]

type ProjectPostParams = { project: string; slug: string }

function getProjectPost(lang: Lang, { project: projectSlug, slug }: ProjectPostParams) {
  const project = getProject(lang, projectSlug)
  const writing = project?.items.some((w) => w.slug === slug) && getWritingBySlug(slug, lang)
  return project && writing ? { project, writing } : undefined
}

export function projectPostStaticParams(lang: Lang): ProjectPostParams[] {
  return groupProjects(getAllSortedWritings(lang)).flatMap((p) =>
    p.items.map((w) => ({ project: p.slug, slug: w.slug }))
  )
}

export function projectPostMetadata(lang: Lang, params: ProjectPostParams) {
  const found = getProjectPost(lang, params)
  if (!found) return

  const { writing } = found
  const { title, publishedAt: publishedTime, summary: description, image } = writing.metadata
  return buildStandardMetadata({
    title,
    description,
    // Canonical stays on /posts; this path is a view over it.
    pathname: getWritingHref(writing, lang),
    type: "article",
    publishedTime,
    image,
    // "Coming soon" placeholders are thin pages: keep them out of search results.
    noIndex: writing.metadata.placeholder,
  })
}

export function ProjectPostPageView({ lang, params }: { lang: Lang; params: ProjectPostParams }) {
  const found = getProjectPost(lang, params)
  if (!found) {
    // Only in the other language (e.g. after the language toggle): send it to
    // this language's /posts URL, which explains the post isn't translated.
    const other = getProjectPost(otherLang(lang), params)
    if (other) redirect(getWritingHref(other.writing, lang))
    notFound()
  }

  return <ProjectPostView project={found.project} writing={found.writing} lang={lang} />
}
