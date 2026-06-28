"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Command } from "cmdk";
import { SearchIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import MiniSearch from "minisearch";

type SearchResultItem = {
  id: string;
  slug: string;
  collection?: string;
  title: string;
  summary: string;
  type: string;
};

export function SearchPalette({ isLight }: { isLight: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load the pre-generated search-index.json once the dialog is opened
  useEffect(() => {
    if (!open && documents.length === 0) return;
    if (documents.length > 0) return; // already loaded

    let isMounted = true;
    setLoading(true);

    fetch("/search-index.json")
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setDocuments(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load search index:", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [open, documents.length]);

  // Setup MiniSearch configuration and index the loaded document data
  const miniSearch = useMemo(() => {
    const searcher = new MiniSearch({
      fields: ["title", "summary", "content"], // fields to index for full-text search
      storeFields: ["slug", "title", "type", "collection"],   // fields to return with search results
      searchOptions: {
        fuzzy: 0.2, // Allow some typos
        prefix: true // Enable prefix matching (match partial words typed)
      }
    });

    if (documents.length > 0) {
      searcher.addAll(documents);
    }

    return searcher;
  }, [documents]);

  const results = useMemo(() => {
    if (!query) return [];
    // Perform search synchronously on every keystroke against the local MiniSearch instance
    return miniSearch.search(query).slice(0, 7) as unknown as SearchResultItem[];
  }, [query, miniSearch]);

  // Toggle palette with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const getPath = (type: string, slug: string, collection?: string) => {
    if (type === "portfolio") return `/portfolio/${slug}`;
    if (collection) return `/writings/${collection}/${slug}`;
    return `/writings/${slug}`; // Assume writing by default
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={clsx(
          "px-2 py-1.5 rounded-md transition-colors duration-150 ease-[var(--ease-out)] flex items-center justify-center",
          {
            "text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)]": isLight,
            "text-white/70 hover:text-white hover:bg-white/10": !isLight,
          }
        )}
        aria-label="Search"
      >
        <SearchIcon strokeWidth={2} style={{ width: "20px", height: "20px" }} />
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-[100] flex pt-[10vh] sm:pt-[20vh] items-start justify-center backdrop-blur-sm bg-[rgba(11,16,27,0.45)]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setOpen(false);
          }
        }}
      >
        <div className="w-[90vw] max-w-[640px] rounded-lg bg-[var(--surface-card)] shadow-xl overflow-hidden border border-[var(--border-subtle)] flex flex-col font-sans">
          <div className="flex items-center px-4 py-3 border-b border-[var(--border-subtle)] gap-3">
            {loading ? (
              <Loader2Icon className="w-5 h-5 text-[var(--text-subtle)] animate-spin" />
            ) : (
              <SearchIcon className="w-5 h-5 text-[var(--text-subtle)]" />
            )}
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search posts..."
              className="w-full rounded bg-transparent outline-none border-none text-[var(--text-strong)] placeholder-[var(--text-subtle)] text-lg font-medium"
            />
          </div>
          {results.length > 0 && (
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
            {query && !loading && results.length === 0 && (
              <Command.Empty className="p-4 text-center text-sm text-[var(--text-muted)]">
                No results found.
              </Command.Empty>
            )}
            {results.map((result) => (
              <Command.Item
                key={result.slug}
                value={result.slug}
                onSelect={() => {
                  setOpen(false);
                  router.push(getPath(result.type, result.slug, result.collection));
                }}
                className="px-4 py-3 cursor-pointer rounded-md hover:bg-[var(--surface-active)] aria-selected:bg-[var(--surface-active)] flex flex-col gap-1 text-left"
              >
                <span className="font-semibold text-[var(--text-strong)]">{result.title}</span>
                <span className="text-xs text-[var(--text-muted)] capitalize">{result.type}</span>
              </Command.Item>
            ))}
          </Command.List>
          )}
        </div>
      </Command.Dialog>
    </>
  );
}
