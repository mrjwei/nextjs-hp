import type { Metadata } from "next"
import Script from "next/script"
import { RootShell } from "@/components/layout/root-shell"
import { GA_MEASUREMENT_ID } from "@/lib/analytics"
import { geistSans, geistMono, newsreader, notoSansJP } from "@/lib/fonts"
import { localePrefix, ogLocale, type Lang } from "@/lib/i18n/config"
import { profile } from "@/lib/content/profile"
import { baseUrl } from "@/lib/site"

// EN (app/(en)) and JA (app/ja) are separate root layouts so each tree gets
// its own <html lang>; they share this metadata and markup.

export function rootMetadata(lang: Lang): Metadata {
  const { title, description } = profile[lang].meta
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Jesse Wei",
    },
    description,
    alternates: {
      languages: {
        en: baseUrl,
        ja: `${baseUrl}/ja`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${localePrefix(lang)}`,
      siteName: "Jesse Wei",
      locale: ogLocale[lang],
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ")

export function RootLayoutView({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html
      lang={lang}
      className={cx(
        "text-base",
        geistSans.variable,
        geistMono.variable,
        newsreader.variable,
        // Noto Sans JP is the /ja body and display face; EN never loads it.
        lang === "ja" && notoSansJP.variable
      )}
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout (rendered by app/(en) and app/ja layouts); next/head is pages/ only */}
      <head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <Script id="gtag-init">
          {`window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </head>
      <RootShell lang={lang}>{children}</RootShell>
    </html>
  )
}
