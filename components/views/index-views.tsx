import Link from "next/link"
import { Grid } from "@/components/posts/post-grid"
import { JaEmptyNotice } from "@/components/posts/ja-empty-notice"
import { WritingsTagFilter } from "@/components/posts/writings-tag-filter.client"
import { SeriesIndexView } from "@/components/posts/series-index.client"
import { BackLink } from "@/components/layout/back-link"
import { ProjectCard } from "@/components/projects/project-card"
import { WorkTrackFilter } from "@/components/projects/work-track-filter.client"
import {
  getAllSortedWritingCollections,
  getAllSortedWritings,
  getWorkTrackFacets,
  groupProjects,
} from "@/lib/content"
import { formatTagLabel, normalizeTag } from "@/lib/content/tags"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, otherLang, type Lang } from "@/lib/i18n/config"
import { buildStandardMetadata } from "@/lib/seo/metadata"
import tagsData from "@/app/data/tags.json"

// Index pages: /posts, /posts/series and /projects, in both languages.

function indexMetadata(lang: Lang, title: string, description: string, path: string) {
  return buildStandardMetadata({
    title,
    description,
    pathname: localeHref(lang, path),
    alternatePathname: localeHref(otherLang(lang), path),
    alternateLang: otherLang(lang),
  })
}

const seriesFacets = (lang: Lang) =>
  getAllSortedWritingCollections(lang).map((s) => ({
    slug: s.slug,
    title: s.title,
    count: s.items.length,
  }))

// ---------------------------------------------------------------------------
// /posts

export function postsIndexMetadata(lang: Lang) {
  const t = dictionaries[lang].posts
  return indexMetadata(lang, t.title, t.description, "/posts")
}

export function PostsIndexView({ lang }: { lang: Lang }) {
  const t = dictionaries[lang].posts
  // "Coming soon" placeholders stay off the all-posts list and out of the tag
  // counts; they're still listed on their series and project pages.
  const writings = getAllSortedWritings(lang).filter((w) => !w.metadata.placeholder)

  const knownTags: Record<string, { color: string }> = tagsData
  const tagCounts = new Map<string, number>(Object.keys(knownTags).map((tag) => [tag, 0]))
  for (const writing of writings) {
    const seen = new Set<string>()
    for (const rawTag of writing.metadata.tags ?? []) {
      const tag = normalizeTag(rawTag)
      if (!tag || seen.has(tag) || !tagCounts.has(tag)) continue
      seen.add(tag)
      tagCounts.set(tag, tagCounts.get(tag)! + 1)
    }
  }
  const tags = Array.from(tagCounts.entries())
    .map(([value, count]) => ({
      value,
      label: formatTagLabel(value),
      count,
      color: knownTags[value].color,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  const postsHref = localeHref(lang, "/posts")

  return (
    <WritingsTagFilter
      tags={tags}
      totalCount={writings.length}
      series={seriesFacets(lang)}
      basePath={postsHref}
      lang={lang}
      heading={
        <>
          <span className="eyebrow">{t.title}</span>
          <h1 className="mt-3 mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
            {t.title}
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-6">{t.description}</p>
        </>
      }
    >
      {writings.length === 0 ? (
        lang === "ja" ? (
          <JaEmptyNotice englishHref="/posts" englishLabel={t.seeEnglishPosts!} />
        ) : (
          <div className="text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs">
            <p className="mb-3 font-medium text-[var(--text-strong)]">{t.noPosts}</p>
          </div>
        )
      ) : (
        <>
          <Grid writings={writings} selectedTags={[]} lang={lang} />
          <div
            id="writings-empty-state"
            className="hidden text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs"
          >
            <p className="mb-3 font-medium text-[var(--text-strong)]">{t.noPostsForTags}</p>
            <Link
              href={postsHref}
              className="text-[var(--accent-text)] hover:underline font-medium transition-colors"
            >
              {t.viewAllPosts}
            </Link>
          </div>
        </>
      )}
    </WritingsTagFilter>
  )
}

// ---------------------------------------------------------------------------
// /posts/series

export function seriesIndexMetadata(lang: Lang) {
  const t = dictionaries[lang].seriesIndex
  return indexMetadata(lang, t.title, t.description, "/posts/series")
}

export function SeriesIndexPageView({ lang }: { lang: Lang }) {
  const t = dictionaries[lang]
  const series = seriesFacets(lang)
  const postsHref = localeHref(lang, "/posts")
  const crumbLink = "hover:underline hover:text-[var(--text-strong)] transition-colors"

  return (
    <div className="w-full max-w-[1024px] mx-auto px-6 md:px-8 py-24">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
        <Link href={localeHref(lang, "/")} className={crumbLink}>
          {t.nav.home}
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <Link href={postsHref} className={crumbLink}>
          {t.nav.posts}
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <span className="text-[var(--text-strong)]">{t.nav.series}</span>
      </nav>

      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow">{t.nav.series}</span>
        <BackLink href={postsHref} label={t.nav.backToAllPosts} />
      </div>
      <h1 className="mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
        {t.seriesIndex.title}
      </h1>
      <p className="text-lg text-[var(--text-muted)] mb-8">{t.seriesIndex.count(series.length)}</p>

      <SeriesIndexView series={series} writingsRoot={postsHref} lang={lang} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// /projects

export function projectsIndexMetadata(lang: Lang) {
  const t = dictionaries[lang].projects
  return indexMetadata(lang, t.title, t.description, "/projects")
}

export function ProjectsIndexView({ lang }: { lang: Lang }) {
  const t = dictionaries[lang].projects
  // One card per project; projects spanning several posts link to their
  // own page (/projects/[project]).
  const projects = groupProjects(getAllSortedWritings(lang))
  const tracks = getWorkTrackFacets(projects)

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <span className="eyebrow">{t.title}</span>
        <h1 className="mt-3 mb-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
          {t.title}
        </h1>
        <p className="text-lg text-[var(--text-muted)] mb-4">{t.intro}</p>
      </div>

      {projects.length === 0 ? (
        lang === "ja" ? (
          <JaEmptyNotice englishHref="/projects" englishLabel={t.seeEnglishProjects!} />
        ) : (
          <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2 text-[var(--text-strong)]">No projects yet</h2>
            <p className="text-[var(--text-muted)]">
              Give a post a <code>project</code> ID in its frontmatter to have it appear here.
            </p>
          </div>
        )
      ) : (
        <>
          <WorkTrackFilter tracks={tracks} lang={lang} />
          <div className="grid grid-cols-12 gap-y-8 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} lang={lang} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
