"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { normalizeTag } from "app/utils/tags"
import type { Lang } from "app/i18n/config"

const copy: Record<
  Lang,
  {
    series: string
    showLess: string
    showMore: (n: number) => string
    filterByTag: string
    all: string
    showingFiltered: (visible: number, total: number, tags: string) => string
    clear: string
  }
> = {
  en: {
    series: "Series",
    showLess: "Show less",
    showMore: (n) => `Show ${n} more`,
    filterByTag: "Filter by tag",
    all: "All",
    showingFiltered: (visible, total, tags) =>
      `Showing ${visible} of ${total} writings tagged ${tags}.`,
    clear: "Clear",
  },
  ja: {
    series: "シリーズ",
    showLess: "閉じる",
    showMore: (n) => `他${n}件を表示`,
    filterByTag: "タグで絞り込む",
    all: "すべて",
    showingFiltered: (visible, total, tags) =>
      `「${tags}」に一致する記事: ${total}件中${visible}件を表示中。`,
    clear: "クリア",
  },
}

export type TTagFacet = {
  value: string
  label: string
  count: number
  color: string
}

export type TSeriesFacet = {
  slug: string
  title: string
  count: number
}

const SERIES_DEFAULT_VISIBLE = 4

function parseSelectedTagsFromSearch(search: string): string[] {
  try {
    const params = new URLSearchParams(search)
    const raw = params.get("tags")
    if (!raw) return []

    return Array.from(
      new Set(
        raw
          .split(",")
          .map((v) => normalizeTag(decodeURIComponent(v)))
          .filter(Boolean)
      )
    )
  } catch {
    return []
  }
}

function buildSearch(tags: string[]): string {
  const normalized = Array.from(new Set(tags.map(normalizeTag).filter(Boolean)))
  if (!normalized.length) return ""
  return `?tags=${encodeURIComponent(normalized.join(","))}`
}

function isPlainLeftClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}

function applyFilterToDom(selectedTags: string[]): number {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-writing-tags]")
  )

  const selected = new Set(selectedTags)
  let visibleCount = 0

  for (const el of cards) {
    const raw = el.getAttribute("data-writing-tags") || ""
    const tags = raw
      .split(",")
      .map(normalizeTag)
      .filter(Boolean)

    // OR semantics: a post matches if it carries at least one selected tag.
    const matches = selected.size === 0 || tags.some((t) => selected.has(t))

    el.classList.toggle("hidden", !matches)
    if (matches) visibleCount += 1
  }

  const emptyState = document.getElementById("writings-empty-state")
  if (emptyState) {
    emptyState.classList.toggle("hidden", visibleCount !== 0)
  }

  return visibleCount
}

function SeriesList({
  series,
  basePath,
  variant,
  t,
}: {
  series: TSeriesFacet[]
  basePath: string
  variant: "desktop" | "mobile"
  t: (typeof copy)[Lang]
}) {
  const [expanded, setExpanded] = useState(false)

  if (series.length === 0) return null

  const seriesBase = basePath.endsWith("/writings") ? basePath : basePath.replace(/\/writings\/.*/, "/writings")
  const currentSlug = basePath === seriesBase ? undefined : basePath.replace(`${seriesBase}/`, "")
  const visible = expanded ? series : series.slice(0, SERIES_DEFAULT_VISIBLE)
  const hiddenCount = series.length - SERIES_DEFAULT_VISIBLE

  if (variant === "mobile") {
    return (
      <div className="mb-4">
        <h2 className="eyebrow mb-2">{t.series}</h2>
        <div className={clsx("flex flex-wrap gap-2", expanded && "max-h-40 overflow-y-auto")}>
          {visible.map((s) => (
            <Link
              key={s.slug}
              href={`${seriesBase}/${s.slug}`}
              className={clsx(
                "flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                s.slug === currentSlug
                  ? "bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent-text)]"
                  : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)] hover:bg-[var(--surface-hover)]"
              )}
            >
              {s.title}
              <span className="text-xs font-mono">{s.count}</span>
            </Link>
          ))}
        </div>
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 text-sm text-[var(--accent-text)] hover:underline font-medium"
          >
            {expanded ? t.showLess : t.showMore(hiddenCount)}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h2 className="eyebrow mb-4">{t.series}</h2>
      <ul className={clsx("space-y-2 pr-1", expanded && "max-h-56 overflow-y-auto")}>
        {visible.map((s) => (
          <li key={s.slug}>
            <Link
              href={`${seriesBase}/${s.slug}`}
              className={clsx(
                "w-full flex justify-between items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-[var(--ease-out)]",
                s.slug === currentSlug
                  ? "bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent-text)]"
                  : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-default)]"
              )}
            >
              <span>{s.title}</span>
              <span className="text-xs font-mono min-w-6 text-center">{s.count}</span>
            </Link>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm text-[var(--accent-text)] hover:underline font-medium"
        >
          {expanded ? t.showLess : t.showMore(hiddenCount)}
        </button>
      )}
    </div>
  )
}

function TagList({
  tags,
  selected,
  totalCount,
  onToggle,
  onClear,
  variant,
  t,
}: {
  tags: TTagFacet[]
  selected: Set<string>
  totalCount: number
  onToggle: (tag: string) => void
  onClear: () => void
  variant: "desktop" | "mobile"
  t: (typeof copy)[Lang]
}) {
  if (variant === "mobile") {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onClear}
          className={clsx(
            "flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            selected.size === 0
              ? "bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent-text)]"
              : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)]"
          )}
        >
          {t.all}
          <span className="text-xs font-mono">{totalCount}</span>
        </button>
        {tags.map((tag) => {
          const isSelected = selected.has(tag.value)
          const isDisabled = tag.count === 0
          return (
            <button
              key={tag.value}
              type="button"
              disabled={isDisabled}
              aria-pressed={isSelected}
              onClick={() => onToggle(tag.value)}
              className={clsx(
                "flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                isDisabled
                  ? "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-subtle)] opacity-50 cursor-not-allowed"
                  : isSelected
                    ? "bg-[var(--surface-card)]"
                    : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)] hover:bg-[var(--surface-hover)]"
              )}
              style={isSelected && !isDisabled ? { borderColor: tag.color, color: tag.color } : undefined}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tag.color, opacity: isDisabled ? 0.5 : 1 }}
              />
              {tag.label}
              <span className="text-xs font-mono">{tag.count}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={onClear}
        className={clsx(
          "w-full flex justify-between items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
          selected.size === 0
            ? "bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent-text)]"
            : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-default)]"
        )}
      >
        <span>{t.all}</span>
        <span className="text-xs font-mono min-w-6 text-center">{totalCount}</span>
      </button>
      <ul className="space-y-2 mt-2 max-h-64 overflow-y-auto pr-1">
        {tags.map((tag) => {
          const isSelected = selected.has(tag.value)
          const isDisabled = tag.count === 0
          return (
            <li key={tag.value}>
              <label
                className={clsx(
                  "w-full flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-[var(--ease-out)]",
                  isDisabled
                    ? "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-subtle)] opacity-50 cursor-not-allowed"
                    : clsx(
                        "cursor-pointer",
                        isSelected
                          ? "bg-[var(--surface-card)]"
                          : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-default)]"
                      )
                )}
                style={isSelected && !isDisabled ? { borderColor: tag.color, color: tag.color } : undefined}
              >
                <input
                  type="checkbox"
                  className="shrink-0"
                  disabled={isDisabled}
                  checked={isSelected}
                  onChange={() => onToggle(tag.value)}
                />
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color, opacity: isDisabled ? 0.5 : 1 }}
                />
                <span className="flex-1">{tag.label}</span>
                <span className="text-xs font-mono min-w-6 text-center">{tag.count}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export function WritingsTagFilter({
  basePath = "/writings",
  tags,
  totalCount,
  series = [],
  heading,
  children,
  lang = "en",
}: {
  basePath?: string
  tags: TTagFacet[]
  totalCount: number
  series?: TSeriesFacet[]
  heading: React.ReactNode
  children: React.ReactNode
  lang?: Lang
}) {
  const labels = copy[lang]
  const knownTags = useMemo(() => new Set(tags.map((t) => t.value)), [tags])

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(totalCount)

  useEffect(() => {
    const syncFromLocation = () => {
      const parsed = parseSelectedTagsFromSearch(window.location.search).filter(
        (t) => knownTags.has(t)
      )
      setSelectedTags(parsed)
    }

    syncFromLocation()

    const onPopState = () => syncFromLocation()
    window.addEventListener("popstate", onPopState)

    return () => {
      window.removeEventListener("popstate", onPopState)
    }
  }, [knownTags])

  useEffect(() => {
    setVisibleCount(applyFilterToDom(selectedTags))
  }, [selectedTags])

  // Intercept clicks on any in-page link that navigates to this page's own
  // basePath (with or without a tags query), e.g. tag pills rendered on
  // writing cards, so toggling a tag never triggers a full reload.
  useEffect(() => {
    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (!isPlainLeftClick(event)) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!anchor) return

      let url: URL
      try {
        url = new URL(anchor.getAttribute("href") || "", window.location.origin)
      } catch {
        return
      }

      if (url.pathname !== basePath) return

      const explicitTag = anchor.getAttribute("data-tag")
      const rawTags = url.searchParams.get("tags")

      if (!explicitTag && !rawTags) {
        event.preventDefault()
        event.stopPropagation()

        setSelectedTags([])
        window.history.replaceState({}, "", basePath)
        return
      }

      const candidate = normalizeTag(
        (explicitTag || rawTags || "").split(",")[0] || ""
      )

      if (!candidate || !knownTags.has(candidate)) return

      event.preventDefault()
      event.stopPropagation()

      setSelectedTags((current) => {
        const next = current.includes(candidate)
          ? current.filter((t) => t !== candidate)
          : [...current, candidate]

        window.history.replaceState({}, "", `${basePath}${buildSearch(next)}`)
        return next
      })
    }

    document.addEventListener("click", onClickCapture, true)
    return () => {
      document.removeEventListener("click", onClickCapture, true)
    }
  }, [knownTags, basePath])

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => {
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]

      window.history.replaceState({}, "", `${basePath}${buildSearch(next)}`)
      return next
    })
  }

  const clearTags = () => {
    setSelectedTags([])
    window.history.replaceState({}, "", basePath)
  }

  const selected = new Set(selectedTags)
  const labelByValue = useMemo(
    () => new Map(tags.map((t) => [t.value, t.label])),
    [tags]
  )

  return (
    <section className="grid grid-cols-12 gap-8 pt-[var(--header-height)]">
      <aside className="hidden md:block bg-[var(--surface-sunken)] border-r border-[var(--border-subtle)] p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen overflow-y-auto">
        <SeriesList series={series} basePath={basePath} variant="desktop" t={labels} />

        <h2 className="eyebrow mb-4">{labels.filterByTag}</h2>
        <TagList
          tags={tags}
          selected={selected}
          totalCount={totalCount}
          onToggle={toggleTag}
          onClear={clearTags}
          variant="desktop"
          t={labels}
        />
      </aside>

      <div className="col-span-12 px-6 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          {heading}

          <div className="block md:hidden mb-4">
            <SeriesList series={series} basePath={basePath} variant="mobile" t={labels} />
            <TagList
              tags={tags}
              selected={selected}
              totalCount={totalCount}
              onToggle={toggleTag}
              onClear={clearTags}
              variant="mobile"
              t={labels}
            />
          </div>

          {selectedTags.length > 0 && (
            <div className="text-sm text-[var(--text-muted)] flex flex-wrap items-center gap-2">
              <span>
                {labels.showingFiltered(
                  visibleCount,
                  totalCount,
                  selectedTags.map((tag) => labelByValue.get(tag) ?? tag).join(lang === "ja" ? "・" : " or ")
                )}
              </span>
              <button
                type="button"
                onClick={clearTags}
                className="text-[var(--accent-text)] hover:underline font-medium transition-colors"
              >
                {labels.clear}
              </button>
            </div>
          )}
        </div>

        {children}
      </div>
    </section>
  )
}
