import { notFound, redirect } from "next/navigation"
import { ProjectPostView } from "@/components/project-post-view"
import { getAllSortedWritings, getWritingBySlug, getWritingHref, groupProjects } from "app/utils"
import { buildStandardMetadata } from "app/seo/metadata"

export const dynamic = "force-static"
export const dynamicParams = true

function getProjectPost(projectSlug: string, slug: string, lang: "en" | "ja" = "en") {
  const project = groupProjects(getAllSortedWritings(lang)).find((p) => p.slug === projectSlug)
  const writing = project?.items.some((w) => w.slug === slug) && getWritingBySlug(slug, lang)
  return project && writing ? { project, writing } : undefined
}

export function generateStaticParams() {
  return groupProjects(getAllSortedWritings("en")).flatMap((p) =>
    p.items.map((w) => ({ project: p.slug, slug: w.slug }))
  )
}

export function generateMetadata({ params }) {
  const found = getProjectPost(params.project, params.slug)
  if (!found) return

  const { writing } = found
  const { title, publishedAt: publishedTime, summary: description, image } = writing.metadata
  return buildStandardMetadata({
    title,
    description,
    // Canonical stays on /posts; this path is a view over it.
    pathname: getWritingHref(writing, "en"),
    type: "article",
    publishedTime,
    image,
  })
}

export default function ProjectPostPage({ params }) {
  const found = getProjectPost(params.project, params.slug)
  if (!found) {
    // Only in the other language (e.g. after the language toggle): send it to
    // this language's /posts URL, which explains the post isn't translated.
    const other = getProjectPost(params.project, params.slug, "ja")
    if (other) redirect(getWritingHref(other.writing, "en"))
    notFound()
  }

  return <ProjectPostView project={found.project} writing={found.writing} lang="en" />
}
