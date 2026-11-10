import { PostArticle } from "@/components/posts/post-article"
import {
  getProjectHref,
  getWritingHref,
  type TContentItem,
  type TContentMeta,
  type TProject,
} from "@/lib/content"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, type Lang } from "@/lib/i18n/config"

// A post read from its project's page (/projects/[project]/[slug]). Same body
// as any post page, but the breadcrumb, back link and prev/next stay inside
// the project. This path is the post's canonical URL (getWritingHref).
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

  const hrefFor = (w: TContentMeta) => getWritingHref(w, lang)

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
