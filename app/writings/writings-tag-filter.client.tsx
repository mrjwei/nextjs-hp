"use client"

import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { normalizeTag } from "app/utils/tags"

export type TTagFacet = {
  value: string
  label: string
  count: number
  color: string
}

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

function TagList({
  tags,
  selected,
  totalCount,
  onToggle,
  onClear,
  variant,
}: {
  tags: TTagFacet[]
  selected: Set<string>
  totalCount: number
  onToggle: (tag: string) => void
  onClear: () => void
  variant: "desktop" | "mobile"
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
          All
          <span className="text-xs font-mono">{totalCount}</span>
        </button>
        {tags.map((tag) => {
          const isSelected = selected.has(tag.value)
          return (
            <button
              key={tag.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(tag.value)}
              className={clsx(
                "flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                isSelected
                  ? "bg-[var(--surface-card)]"
                  : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)] hover:bg-[var(--surface-hover)]"
              )}
              style={isSelected ? { borderColor: tag.color, color: tag.color } : undefined}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
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
    <ul className="space-y-2">
      <li>
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
          <span>All</span>
          <span className="text-xs font-mono min-w-6 text-center">{totalCount}</span>
        </button>
      </li>
      {tags.map((tag) => {
        const isSelected = selected.has(tag.value)
        return (
          <li key={tag.value}>
            <label
              className={clsx(
                "w-full flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors duration-150 ease-[var(--ease-out)]",
                isSelected
                  ? "bg-[var(--surface-card)]"
                  : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-body)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-default)]"
              )}
              style={isSelected ? { borderColor: tag.color, color: tag.color } : undefined}
            >
              <input
                type="checkbox"
                className="shrink-0"
                checked={isSelected}
                onChange={() => onToggle(tag.value)}
              />
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <span className="flex-1">{tag.label}</span>
              <span className="text-xs font-mono min-w-6 text-center">{tag.count}</span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}

export function WritingsTagFilter({
  tags,
  totalCount,
  children,
}: {
  tags: TTagFacet[]
  totalCount: number
  children: React.ReactNode
}) {
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

  // Intercept clicks on any in-page link that navigates to /writings (with or
  // without a tags query), e.g. tag pills rendered on writing cards or on a
  // writing's detail page, so toggling a tag never triggers a full reload.
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

      if (url.pathname !== "/writings") return

      const explicitTag = anchor.getAttribute("data-tag")
      const rawTags = url.searchParams.get("tags")

      if (!explicitTag && !rawTags) {
        event.preventDefault()
        event.stopPropagation()

        setSelectedTags([])
        window.history.replaceState({}, "", "/writings")
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

        window.history.replaceState({}, "", `/writings${buildSearch(next)}`)
        return next
      })
    }

    document.addEventListener("click", onClickCapture, true)
    return () => {
      document.removeEventListener("click", onClickCapture, true)
    }
  }, [knownTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => {
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]

      window.history.replaceState({}, "", `/writings${buildSearch(next)}`)
      return next
    })
  }

  const clearTags = () => {
    setSelectedTags([])
    window.history.replaceState({}, "", "/writings")
  }

  const selected = new Set(selectedTags)
  const labelByValue = useMemo(
    () => new Map(tags.map((t) => [t.value, t.label])),
    [tags]
  )

  return (
    <section className="grid grid-cols-12 gap-8 pt-[var(--header-height)]">
      <aside className="hidden md:block bg-[var(--surface-sunken)] border-r border-[var(--border-subtle)] p-8 md:col-span-3 sticky md:top-[var(--header-height)] h-screen overflow-y-auto">
        <h2 className="eyebrow mb-4">Filter by tag</h2>
        <TagList
          tags={tags}
          selected={selected}
          totalCount={totalCount}
          onToggle={toggleTag}
          onClear={clearTags}
          variant="desktop"
        />
      </aside>

      <div className="col-span-12 px-6 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <span className="eyebrow">Writing</span>
          <h1 className="mt-3 mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
            Writing
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-6">
            Technical and design writing — cryptography, AI agents, design
            systems, and the reasoning behind them.
          </p>

          <div className="block md:hidden mb-4">
            <TagList
              tags={tags}
              selected={selected}
              totalCount={totalCount}
              onToggle={toggleTag}
              onClear={clearTags}
              variant="mobile"
            />
          </div>

          {selectedTags.length > 0 && (
            <div className="text-sm text-[var(--text-muted)] flex flex-wrap items-center gap-2">
              <span>
                Showing {visibleCount} of {totalCount} writings tagged{" "}
                {selectedTags.map((t) => labelByValue.get(t) ?? t).join(" or ")}.
              </span>
              <button
                type="button"
                onClick={clearTags}
                className="text-[var(--accent-text)] hover:underline font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {children}
      </div>
    </section>
  )
}
