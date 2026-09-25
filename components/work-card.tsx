"use client"

import clsx from "clsx"
import { Files } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { ProjectBadge } from "@/components/project-badge"
import { Badge } from "@/components/ui/badge"
import type { TContentMeta } from "app/utils"
import type { Lang } from "app/i18n/config"

const articleCountLabel: Record<Lang, (n: number) => string> = {
  en: (n) => `${n} articles`,
  ja: (n) => `記事${n}件`,
}

export function WorkCard({
  work,
  lang = "en",
  href: hrefOverride,
  articleCount,
  className,
  wrapperProps,
}: {
  work: TContentMeta
  lang?: Lang
  // Set when the card stands for a whole project (see ProjectCard): links to
  // the project page and shows how many posts it covers.
  href?: string
  articleCount?: number
  className?: string
  wrapperProps?: React.HTMLAttributes<HTMLDivElement> & {
    [key: `data-${string}`]: string | undefined
  }
}) {
  const prefix = lang === "ja" ? "/ja" : ""
  const { title, summary, result, industry, publishedAt, stack, series, project } =
    work.metadata
  // Projects are canonical under /posts (mirrors getWritingHref, which can't
  // be imported into this client component because app/utils reads the fs).
  const href =
    hrefOverride ??
    (series ? `${prefix}/posts/${series}/${work.slug}` : `${prefix}/posts/${work.slug}`)
  const showArticleCount = !!articleCount && articleCount > 1
  const year = new Date(publishedAt).getFullYear()
  const eyebrow = industry ? `${industry} · ${year}` : `${year}`
  const resultLine = result || summary

  return (
    <div
      {...wrapperProps}
      className={clsx(
        "relative col-span-12 md:col-span-6 h-full flex flex-col bg-[var(--surface-card)] transition-[box-shadow,border-color,transform] duration-200 ease-[var(--ease-out)] shadow-xs hover:shadow-lg hover:-translate-y-0.5 border border-[var(--border-subtle)] hover:border-[var(--border-default)] rounded-lg group",
        className,
        wrapperProps?.className
      )}
    >
      {project && (
        <ProjectBadge project={project} className="pointer-events-none absolute top-3 -right-1 z-10 shadow-sm" />
      )}
      <TrackedLink
        href={href}
        className="flex flex-1 flex-col"
        eventName="work_card_click"
        eventParams={{ slug: work.slug, title }}
      >
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className={clsx({ "pr-20": project })}>
            <span className="eyebrow">{eyebrow}</span>
            <h3 className="mt-2 mb-2 text-lg font-semibold leading-normal text-[var(--text-strong)] transition-colors group-hover:text-[var(--accent-text)]">
              {title}
            </h3>
            <p className="mb-4 text-base leading-6 text-[var(--text-strong)]">
              {resultLine}
            </p>
          </div>
          {stack?.length || showArticleCount ? (
            <div className="flex items-end justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {stack?.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              {showArticleCount && (
                <Badge tone="accent" className="ml-auto shrink-0 whitespace-nowrap">
                  <Files aria-hidden className="size-3.5" />
                  {articleCountLabel[lang](articleCount)}
                </Badge>
              )}
            </div>
          ) : null}
        </div>
      </TrackedLink>
    </div>
  )
}
