import "../global.css"

import type { Metadata } from "next"
import Script from "next/script"
import { RootShell } from "@/components/root-shell"
import { geistSans, geistMono, newsreader } from "app/data/fonts"
import { baseUrl } from "../sitemap"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Jesse Wei — Design engineer building AI-native products",
    template: "%s | Jesse Wei",
  },
  description:
    "Design engineer with 10+ years across product design and software. I design and ship full products — interface, system, and the AI underneath. Based in Japan, working in English and Japanese.",
  alternates: {
    languages: {
      en: baseUrl,
      ja: `${baseUrl}/ja`,
    },
  },
  openGraph: {
    title: "Jesse Wei — Design engineer building AI-native products",
    description:
      "Design engineer with 10+ years across product design and software. I design and ship full products — interface, system, and the AI underneath. Based in Japan, working in English and Japanese.",
    url: baseUrl,
    siteName: "Jesse Wei",
    locale: "en_US",
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

const cx = (...classes) => classes.filter(Boolean).join(" ")

export default function EnRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        "text-base",
        geistSans.variable,
        geistMono.variable,
        newsreader.variable
      )}
    >
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-44FT4BDFH2" />
        <Script id="gtag-init">
          {`window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());

          gtag('config', 'G-44FT4BDFH2');`}
        </Script>
      </head>
      <RootShell lang="en">{children}</RootShell>
    </html>
  )
}
