import Link from "next/link"

export default function NotFound() {
  return (
    <section className="w-full max-w-[1024px] mx-auto px-8 py-24 text-center">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        404 - ページが見つかりません
      </h1>
      <p className="mb-4 text-[var(--text-muted)]">
        お探しのページはまだ日本語版が用意されていないか、存在しません。
      </p>
      <Link href="/ja" className="text-[var(--accent-text)] hover:underline font-medium">
        ホームに戻る
      </Link>
    </section>
  )
}
