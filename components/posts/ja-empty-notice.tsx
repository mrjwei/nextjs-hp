import Link from "next/link"

export function JaEmptyNotice({
  englishHref,
  englishLabel,
}: {
  englishHref: string
  englishLabel: string
}) {
  return (
    <div className="text-[var(--text-body)] bg-[var(--surface-card)] rounded-lg border border-[var(--border-subtle)] p-8 shadow-xs">
      <p className="mb-3 font-medium text-[var(--text-strong)]">
        日本語の記事は準備中です。
      </p>
      <p className="mb-4 text-[var(--text-muted)]">
        現在は英語でのみ公開しています。翻訳は順次追加していく予定です。
      </p>
      <Link
        href={englishHref}
        className="text-[var(--accent-text)] hover:underline font-medium"
      >
        {englishLabel} →
      </Link>
    </div>
  )
}
