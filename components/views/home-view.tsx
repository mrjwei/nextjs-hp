import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Grid } from "@/components/posts/post-grid"
import { JaEmptyNotice } from "@/components/posts/ja-empty-notice"
import { ProjectCard } from "@/components/projects/project-card"
import { ProofStrip } from "@/components/home/proof-strip"
import { HowIWork } from "@/components/home/how-i-work"
import { TrackedLink } from "@/components/layout/tracked-link"
import { JsonLd } from "@/components/layout/json-ld"
import { buildPersonJsonLd } from "@/lib/seo/person"
import {
  getAllSortedWritings,
  groupProjects,
  isProject,
  pickHighlights,
} from "@/lib/content"
import { highlights, profile } from "@/lib/content/profile"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, type Lang } from "@/lib/i18n/config"

export function HomeView({ lang }: { lang: Lang }) {
  const p = profile[lang]
  const writings = getAllSortedWritings(lang)
  const projects = pickHighlights(groupProjects(writings), {
    pinned: highlights.projects,
    keyOf: (project) => project.id,
    limit: 4,
  })
  // Selected writing: the 2 newest posts, so new writing always shows, then
  // pinned posts. Project posts belong to "Selected projects" above, and
  // unwritten "Coming soon" placeholders aren't ready, so neither is picked here.
  const selectedPosts = pickHighlights(
    writings.filter(
      (writing) =>
        !isProject(writing.metadata) && !writing.metadata.placeholder
    ),
    { pinned: highlights.posts, keyOf: (writing) => writing.slug, limit: 4, latest: 2 }
  )
  const email = p.social.find((s) => s.id === "email")?.href
  const labels = dictionaries[lang]
  const t = labels.home

  return (
    <section className="w-full">
      <JsonLd data={buildPersonJsonLd(lang)} />

      {/* Hero */}
      <div className="mx-auto w-full max-w-[1120px] px-8 pt-28 pb-20 md:pt-28 md:pb-20">
        <span className="eyebrow">{p.eyebrow}</span>
        <h1 className="display mt-6 text-5xl leading-[1.04] md:text-6xl">
          {p.headline}
        </h1>
        <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
          {p.subhead}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="primary" size="lg">
            <TrackedLink href={localeHref(lang, "/projects")} eventName="cta_selected_work">
              {t.ctaProjects}
            </TrackedLink>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href={localeHref(lang, "/about")}>{t.ctaAbout}</Link>
          </Button>
          {email && (
            <TrackedLink
              href={email}
              eventName="contact_click"
              className="self-center px-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)] hover:underline"
            >
              {t.emailMe}
            </TrackedLink>
          )}
        </div>
      </div>

      {/* Proof strip */}
      <div className="w-full bg-[var(--surface-sunken)] border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-14">
          <ProofStrip items={p.proof} />
        </div>
      </div>

      {/* Selected projects */}
      <div className="w-full border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="eyebrow">{t.projectsEyebrow}</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                {t.projectsHeading}
              </h2>
            </div>
            <Link
              href={localeHref(lang, "/projects")}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              {t.seeAll}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {lang === "ja" && projects.length === 0 ? (
            <JaEmptyNotice englishHref="/projects" englishLabel={labels.projects.seeEnglishProjects!} />
          ) : (
            <div className="grid grid-cols-12 gap-y-8 md:gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How I work */}
      <div className="w-full bg-[var(--surface-sunken)] border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10">
            <span className="eyebrow">{t.processEyebrow}</span>
            <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
              {t.processHeading}
            </h2>
          </div>
          <HowIWork items={p.howIWork} />
        </div>
      </div>

      {/* Selected writing */}
      <div className="w-full border-t border-[var(--border-subtle)]">
        <div className="mx-auto w-full max-w-[1120px] px-8 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="eyebrow">{t.writingEyebrow}</span>
              <h2 className="mt-2.5 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
                {t.writingHeading}
              </h2>
            </div>
            <Link
              href={localeHref(lang, "/posts")}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] hover:underline"
            >
              {t.allPosts}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {lang === "ja" && selectedPosts.length === 0 ? (
            <JaEmptyNotice englishHref="/posts" englishLabel={labels.posts.seeEnglishPosts!} />
          ) : (
            <Grid writings={selectedPosts} path="writings" lang={lang} />
          )}
        </div>
      </div>
    </section>
  )
}
