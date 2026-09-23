"use client"

import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import type { Lang } from "app/i18n/config"
import type { WorkTrack } from "app/utils"

const trackLabel: Record<Lang, Record<WorkTrack, string>> = {
  en: {
    "ai-engineering": "AI engineering",
    "product-design": "Product design",
    security: "Security",
    research: "Research",
  },
  ja: {
    "ai-engineering": "AIエンジニアリング",
    "product-design": "プロダクトデザイン",
    security: "セキュリティ",
    research: "リサーチ",
  },
}

const copy: Record<Lang, { all: string; filterByTrack: string }> = {
  en: { all: "All", filterByTrack: "Filter by track" },
  ja: { all: "すべて", filterByTrack: "分野で絞り込む" },
}

export type TTrackFacet = {
  value: WorkTrack
  count: number
}

function applyFilterToDom(track: string | null) {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-work-track]")
  )
  for (const el of cards) {
    const value = el.getAttribute("data-work-track") || ""
    el.classList.toggle("hidden", !(!track || value === track))
  }
}

function parseTrackFromSearch(search: string): string | null {
  return new URLSearchParams(search).get("track")
}

export function WorkTrackFilter({
  tracks,
  lang = "en",
}: {
  tracks: TTrackFacet[]
  lang?: Lang
}) {
  const t = copy[lang]
  const labels = trackLabel[lang]
  const knownTracks = useMemo(() => new Set(tracks.map((f) => f.value)), [tracks])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => {
      const parsed = parseTrackFromSearch(window.location.search)
      setSelected(parsed && knownTracks.has(parsed as WorkTrack) ? parsed : null)
    }
    sync()
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [knownTracks])

  useEffect(() => {
    applyFilterToDom(selected)
  }, [selected])

  if (tracks.length < 2) return null

  const select = (value: string | null) => {
    setSelected(value)
    const url = value
      ? `${window.location.pathname}?track=${encodeURIComponent(value)}`
      : window.location.pathname
    window.history.replaceState({}, "", url)
  }

  return (
    <div
      className="mb-8 flex flex-wrap items-center gap-2"
      role="group"
      aria-label={t.filterByTrack}
    >
      <button
        type="button"
        onClick={() => select(null)}
        className={clsx(
          "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
          selected === null
            ? "border-[var(--accent-border)] bg-[var(--accent-subtle)] text-[var(--accent-text)]"
            : "border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-body)] hover:bg-[var(--surface-hover)]"
        )}
      >
        {t.all}
        <span className="font-mono text-xs">
          {tracks.reduce((sum, facet) => sum + facet.count, 0)}
        </span>
      </button>
      {tracks.map((facet) => (
        <button
          key={facet.value}
          type="button"
          onClick={() => select(facet.value)}
          aria-pressed={selected === facet.value}
          className={clsx(
            "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
            selected === facet.value
              ? "border-[var(--accent-border)] bg-[var(--accent-subtle)] text-[var(--accent-text)]"
              : "border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-body)] hover:bg-[var(--surface-hover)]"
          )}
        >
          {labels[facet.value]}
          <span className="font-mono text-xs">{facet.count}</span>
        </button>
      ))}
    </div>
  )
}
