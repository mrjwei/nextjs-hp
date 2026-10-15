import Link from "next/link"

// JA only: shown at a /ja URL whose post or series exists in English but
// hasn't been translated yet, instead of a 404.
export function NotTranslatedView({ englishHref }: { englishHref: string }) {
  return (
    <div className="w-full max-w-[1024px] mx-auto px-8 md:px-16 py-24">
      <div className="bg-[var(--surface-card)] rounded-lg shadow-xs border border-[var(--border-subtle)] p-8 md:p-12 text-center">
        <p className="mb-3 font-medium text-[var(--text-strong)]">
          この記事はまだ日本語訳がありません。
        </p>
        <p className="mb-6 text-[var(--text-muted)]">
          現在は英語でのみ公開しています。
        </p>
        <Link
          href={englishHref}
          className="text-[var(--accent-text)] hover:underline font-medium"
        >
          英語版を読む →
        </Link>
      </div>
    </div>
  )
}
