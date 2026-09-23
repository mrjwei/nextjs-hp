import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import type { TContentMeta, WorkStatus } from "app/utils"
import type { Lang } from "app/i18n/config"

const statusLabel: Record<Lang, Record<WorkStatus, string>> = {
  en: {
    production: "In production",
    pilot: "Pilot",
    research: "Research",
    shipped: "Shipped",
    archived: "Archived",
  },
  ja: {
    production: "本番運用中",
    pilot: "パイロット",
    research: "研究",
    shipped: "リリース済み",
    archived: "アーカイブ",
  },
}

export function WorkCard({
  work,
  lang = "en",
  className,
  wrapperProps,
}: {
  work: TContentMeta
  lang?: Lang
  className?: string
  wrapperProps?: React.HTMLAttributes<HTMLDivElement> & {
    [key: `data-${string}`]: string | undefined
  }
}) {
  const prefix = lang === "ja" ? "/ja" : ""
  const href = `${prefix}/work/${work.slug}`
  const { title, summary, result, industry, publishedAt, image, stack, status } =
    work.metadata
  const year = new Date(publishedAt).getFullYear()
  const eyebrow = industry ? `${industry} · ${year}` : `${year}`
  const resultLine = result || summary

  return (
    <div
      {...wrapperProps}
      className={clsx(
        "col-span-12 md:col-span-6 h-full flex flex-col bg-[var(--surface-card)] transition-[box-shadow,border-color,transform] duration-200 ease-[var(--ease-out)] shadow-xs hover:shadow-lg hover:-translate-y-0.5 border border-[var(--border-subtle)] hover:border-[var(--border-default)] rounded-lg overflow-hidden group",
        className,
        wrapperProps?.className
      )}
    >
      <Link href={href} className="flex flex-1 flex-col">
        {image && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface-sunken)]">
            <Image
              src={image}
              alt={`${title} thumbnail`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h3 className="mt-2 mb-2 text-lg font-semibold leading-normal text-[var(--text-strong)] transition-colors group-hover:text-[var(--accent-text)]">
              {title}
            </h3>
            <p className="mb-4 text-base leading-6 text-[var(--text-strong)]">
              {resultLine}
            </p>
          </div>
          {(stack?.length || status) && (
            <div className="flex flex-wrap items-center gap-2">
              {stack?.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]"
                >
                  {item}
                </span>
              ))}
              {status && (
                <span className="ml-auto rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--accent-text)] whitespace-nowrap">
                  {statusLabel[lang][status]}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
