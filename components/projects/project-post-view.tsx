import { PostArticle } from "@/components/posts/post-article"
import {
  getProjectHref,
  getProjectPostHref,
  getWritingHref,
  type TContentItem,
  type TContentMeta,
  type TProject,
} from "@/lib/content"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, type Lang } from "@/lib/i18n/config"

// A post read from its project's page (/projects/[project]/[slug]). Same body
// as the /posts page, but the breadcrumb, back link and prev/next stay inside
// the project. The canonical URL is still the /posts one.
export function ProjectPostView({
  project,
  writing,
  lang = "en",
}: {
  project: TProject
  writing: TContentItem
  lang?: Lang
}) {
  const t = dictionaries[lang]
  const projectHref = getProjectHref(project.id, lang)

  // Sibling posts in this project stay on the project path; anything else
  // goes to its canonical /posts URL.
  const hrefFor = (w: TContentMeta) =>
    w.metadata.project === project.id
      ? getProjectPostHref(project.id, w.slug, lang)
      : getWritingHref(w, lang)

  return (
    <PostArticle
      writing={writing}
      lang={lang}
      crumbs={[
        { label: t.nav.projects, href: localeHref(lang, "/projects") },
        { label: project.id, href: projectHref },
      ]}
      backHref={projectHref}
      backLabel={t.projects.backTo(project.id)}
      canonicalPath={getWritingHref(writing, lang)}
      prevNext={{ items: project.items, linkFor: hrefFor }}
      partHref={hrefFor}
      showProjectBadge={false}
    />
  )
}
