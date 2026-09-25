import Link from "next/link"
import { BackLink } from "@/components/back-link"
import { WritingCard } from "@/components/article-card"
import { ResultBlock } from "@/components/result-block"
import type { TProject } from "app/utils"
import type { Lang } from "app/i18n/config"

const copy: Record<
  Lang,
  {
    home: string
    projects: string
    project: string
    backToAll: string
    articles: (n: number) => string
  }
> = {
  en: {
    home: "Home",
    projects: "Projects",
    project: "Project",
    backToAll: "Back to All Projects",
    articles: (n) => `${n} ${n === 1 ? "article" : "articles"}`,
  },
  ja: {
    home: "ホーム",
    projects: "プロジェクト",
    project: "プロジェクト",
    backToAll: "プロジェクト一覧に戻る",
    articles: (n) => `記事${n}件`,
  },
}

// A project's own page (/projects/[project]): the lead post's result up top,
// then every post written about the project.
export function ProjectView({
  project,
  lang = "en",
}: {
  project: TProject
  lang?: Lang
}) {
  const t = copy[lang]
  const prefix = lang === "ja" ? "/ja" : ""
  const projectsHref = `${prefix}/projects`
  const { lead, items } = project

  return (
    <div className="w-full max-w-[1120px] mx-auto px-6 md:px-8 py-24">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)] mb-4">
        <Link href={prefix || "/"} className="hover:underline hover:text-[var(--text-strong)] transition-colors">
          {t.home}
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <Link href={projectsHref} className="hover:underline hover:text-[var(--text-strong)] transition-colors">
          {t.projects}
        </Link>
        <span className="mx-2 text-[var(--text-subtle)]">/</span>
        <span className="text-[var(--text-strong)]">{project.id}</span>
      </nav>

      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow">{t.project}</span>
        <BackLink href={projectsHref} label={t.backToAll} />
      </div>
      <h1 className="mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
        {project.id}
      </h1>
      <p className="text-lg text-[var(--text-muted)] mb-8">{lead.metadata.summary}</p>

      <ResultBlock metadata={lead.metadata} lang={lang} />

      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--text-strong)]">
        {t.articles(items.length)}
      </h2>
      <div className="grid grid-cols-12 gap-y-8 md:gap-8">
        {items.map((item) => (
          <WritingCard key={item.slug} article={item} lang={lang} showProjectBadge={false} />
        ))}
      </div>
    </div>
  )
}
