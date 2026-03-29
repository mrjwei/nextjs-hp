"use client"

import { useEffect, useMemo, useState } from "react"
import tagsData from "app/data/tags.json"

function parseSelectedTagsFromSearch(search: string): string[] {
  try {
    const params = new URLSearchParams(search)
    const raw = params.get("tags")
    if (!raw) return []

    return Array.from(
      new Set(
        raw
          .split(",")
          .map((v) => decodeURIComponent(v).trim())
          .filter(Boolean)
      )
    )
  } catch {
    return []
  }
}

function buildSearch(tags: string[]): string {
  const normalized = Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean)))
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

function applyFilterToDom(selectedTags: string[]) {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-writing-tags]")
  )

  const selected = new Set(selectedTags)
  let visibleCount = 0

  for (const el of cards) {
    const raw = el.getAttribute("data-writing-tags") || ""
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const matches =
      selected.size === 0 || tags.some((t) => selected.has(t))

    el.classList.toggle("hidden", !matches)
    if (matches) visibleCount += 1
  }

  const emptyState = document.getElementById("writings-empty-state")
  if (emptyState) {
    emptyState.classList.toggle("hidden", visibleCount !== 0)
  }
}

export function WritingsFilterController() {
  const knownTags = useMemo(() => new Set(Object.keys(tagsData)), [])

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    const syncFromLocation = () => {
      const parsed = parseSelectedTagsFromSearch(window.location.search)
        .filter((t) => knownTags.has(t))
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
    applyFilterToDom(selectedTags)
  }, [selectedTags])

  useEffect(() => {
    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (!isPlainLeftClick(event)) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!anchor) return

      // Only intercept clicks that would navigate to /writings (with or without tags).
      let url: URL
      try {
        url = new URL(anchor.getAttribute("href") || "", window.location.origin)
      } catch {
        return
      }

      if (url.pathname !== "/writings") return

      // If the anchor explicitly carries a tag, prefer that.
      const explicitTag = anchor.getAttribute("data-tag")
      const rawTags = url.searchParams.get("tags")

      // Clear action: /writings (no tags query)
      if (!explicitTag && !rawTags) {
        event.preventDefault()
        event.stopPropagation()

        setSelectedTags([])
        window.history.replaceState({}, "", "/writings")
        return
      }

      const candidate = (explicitTag || rawTags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)[0]

      if (!candidate || !knownTags.has(candidate)) return

      event.preventDefault()
      event.stopPropagation()

      setSelectedTags((current) => {
        const next = current.includes(candidate)
          ? current.filter((t) => t !== candidate)
          : [...current, candidate]

        const nextSearch = buildSearch(next)
        window.history.replaceState({}, "", `/writings${nextSearch}`)

        return next
      })
    }

    document.addEventListener("click", onClickCapture, true)
    return () => {
      document.removeEventListener("click", onClickCapture, true)
    }
  }, [knownTags])

  if (selectedTags.length === 0) return null

  return (
    <div className="mt-6 text-sm text-neutral-700 flex flex-wrap items-center gap-2">
      <span className="font-medium">Filtering by tags:</span>
      {selectedTags.map((tag) => {
        const color = (tagsData as any)[tag]?.color
        if (!color) return null

        return (
          <span
            key={tag}
            className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{ border: `2px solid ${color}`, color }}
          >
            <a
              href={`/writings${buildSearch(selectedTags)}`}
              className="inline-flex items-center"
              data-tag={tag}
              aria-label={`Toggle tag ${tag}`}
            >
              {tag}
            </a>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="ml-0.5 leading-none"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                setSelectedTags((current) => {
                  const next = current.filter((t) => t !== tag)
                  const nextSearch = buildSearch(next)
                  window.history.replaceState({}, "", `/writings${nextSearch}`)
                  return next
                })
              }}
            >
              ×
            </button>
          </span>
        )
      })}
      <a
        href="/writings"
        className="ml-1 text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
      >
        Clear
      </a>
    </div>
  )
}
