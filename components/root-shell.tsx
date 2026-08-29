import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import AnalyticsProvider from "app/providers"
import type { Lang } from "app/i18n/config"

const skipLinkLabel: Record<Lang, string> = {
  en: "Skip to content",
  ja: "コンテンツへスキップ",
}

export function RootShell({
  lang,
  children,
}: {
  lang: Lang
  children: React.ReactNode
}) {
  return (
    <body className="antialiased flex flex-col items-center justify-between min-h-screen bg-surface-page text-text-body">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-neutral-900 focus:shadow"
      >
        {skipLinkLabel[lang]}
      </a>
      <div id="scroll-top-sentinel" className="h-px w-px" aria-hidden="true" />
      <AnalyticsProvider />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative w-full flex-1 bg-surface-page flex flex-col scroll-mt-[var(--header-height)]"
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </main>
      <Footer lang={lang} />
    </body>
  )
}
