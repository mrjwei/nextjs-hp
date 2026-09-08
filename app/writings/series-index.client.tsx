"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import type { Lang } from "app/i18n/config"
import type { TSeriesFacet } from "app/writings/writings-tag-filter.client"

const STORAGE_KEY = "writings-series-view-mode"

type TDisplayMode = "tile" | "list"

const copy: Record<
  Lang,
  {
    tileView: string
    listView: string
    postCount: (n: number) => string
  }
> = {
  en: {
    tileView: "Tile",
    listView: "List",
    postCount: (n) => `${n} ${n === 1 ? "post" : "posts"}`,
  },
  ja: {
    tileView: "タイル",
    listView: "リスト",
    postCount: (n) => `${n}件`,
  },
}

function ModeToggle({
  mode,
  onChange,
  t,
}: {
  mode: TDisplayMode
  onChange: (mode: TDisplayMode) => void
  t: (typeof copy)[Lang]
}) {
  return (
    <div
      role="group"
      aria-label="Display mode"
      className="inline-flex items-center gap-1 border border-[var(--border-subtle)] rounded-md p-1 bg-[var(--surface-sunken)]"
    >
      {(["tile", "list"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
          className={clsx(
            "px-3 py-1 rounded text-sm font-medium transition-colors",
            mode === value
              ? "bg-[var(--surface-card)] text-[var(--text-strong)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text-body)]"
          )}
        >
          {value === "tile" ? t.tileView : t.listView}
        </button>
      ))}
    </div>
  )
}

export function SeriesIndexView({
  series,
  writingsRoot,
  lang = "en",
}: {
  series: TSeriesFacet[]
  writingsRoot: string
  lang?: Lang
}) {
  const t = copy[lang]
  const [mode, setMode] = useState<TDisplayMode>("tile")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === "tile" || stored === "list") setMode(stored)
    } catch {
      // ignore
    }
  }, [])

  const handleModeChange = (next: TDisplayMode) => {
    setMode(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <ModeToggle mode={mode} onChange={handleModeChange} t={t} />
      </div>

      {mode === "tile" ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {series.map((s) => (
            <li key={s.slug}>
              <Link
                href={`${writingsRoot}/${s.slug}`}
                className="w-full flex justify-between items-center gap-2 border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5 rounded-md text-sm font-medium text-[var(--text-body)] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
              >
                <span>{s.title}</span>
                <span className="text-xs font-mono min-w-6 text-center">{s.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
          {series.map((s) => (
            <li key={s.slug}>
              <Link
                href={`${writingsRoot}/${s.slug}`}
                className="flex items-center justify-between gap-4 py-4 text-[var(--text-body)] hover:text-[var(--text-strong)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
              >
                <span className="font-medium">{s.title}</span>
                <span className="text-sm text-[var(--text-muted)] whitespace-nowrap">
                  {t.postCount(s.count)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
