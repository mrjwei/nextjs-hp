import Link from "next/link"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, type Lang } from "@/lib/i18n/config"

export function NotFoundView({ lang }: { lang: Lang }) {
  const t = dictionaries[lang].notFound
  return (
    <section className="w-full max-w-[1024px] mx-auto px-8 py-24 text-center">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{t.heading}</h1>
      <p className="mb-4 text-[var(--text-muted)]">{t.body}</p>
      <Link href={localeHref(lang, "/")} className="text-[var(--accent-text)] hover:underline font-medium">
        {t.backHome}
      </Link>
    </section>
  )
}
