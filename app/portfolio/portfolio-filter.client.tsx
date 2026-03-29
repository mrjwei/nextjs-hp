"use client"

import { useEffect, useState } from "react"

function parseCollectionFromSearch(search: string): string | null {
  try {
    const params = new URLSearchParams(search)
    const raw = params.get("collection")
    if (!raw) return null
    const value = decodeURIComponent(raw).trim()
    return value || null
  } catch {
    return null
  }
}

function applyCollectionFilterToDom(collection: string | null) {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-portfolio-collection]")
  )

  let visibleCount = 0
  for (const el of cards) {
    const value = (el.getAttribute("data-portfolio-collection") || "").trim()
    const matches = !collection || value === collection
    el.classList.toggle("hidden", !matches)
    if (matches) visibleCount += 1
  }

  const emptyState = document.getElementById("portfolio-empty-state")
  if (emptyState) {
    emptyState.classList.toggle("hidden", visibleCount !== 0)
  }
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

export function PortfolioFilterController() {
  const [collection, setCollection] = useState<string | null>(null)

  useEffect(() => {
    const syncFromLocation = () => {
      setCollection(parseCollectionFromSearch(window.location.search))
    }

    syncFromLocation()

    const onPopState = () => syncFromLocation()
    window.addEventListener("popstate", onPopState)

    return () => {
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

  useEffect(() => {
    applyCollectionFilterToDom(collection)
  }, [collection])

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

      if (url.pathname !== "/portfolio") return

      event.preventDefault()
      event.stopPropagation()

      const next = url.searchParams.get("collection")
      if (!next) {
        setCollection(null)
        window.history.replaceState({}, "", "/portfolio")
        return
      }

      const value = decodeURIComponent(next).trim()
      setCollection(value || null)
      window.history.replaceState(
        {},
        "",
        value ? `/portfolio?collection=${encodeURIComponent(value)}` : "/portfolio"
      )
    }

    document.addEventListener("click", onClickCapture, true)
    return () => {
      document.removeEventListener("click", onClickCapture, true)
    }
  }, [])

  return null
}
