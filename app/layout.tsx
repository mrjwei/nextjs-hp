import "./global.css"

import type { Metadata } from "next"
import Head from "next/head"
import Script from "next/script"
import { Header } from "./components/header"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "./components/footer"
import { openSans } from "app/data/fonts"
import { baseUrl } from "./sitemap"
import AnalyticsProvider from "./providers"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Jesse Wei | A Creator who blends design and technology",
    template: "%s | Jesse Wei",
  },
  description:
    "Jesse Wei is a creator, passionate about blending design and technology to craft innovative and impactful products.",
  openGraph: {
    title: "Jesse Wei | A Creator who blends design and technology",
    description:
      "Jesse Wei is a creator, passionate about blending design and technology to craft innovative and impactful products.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx("text-neutral-900 bg-neutral-50 text-base", openSans.className)}
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
      <body className="antialiased flex flex-col items-center justify-between min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-neutral-900 focus:shadow"
        >
          Skip to content
        </a>
        <div id="scroll-top-sentinel" className="h-px w-px" aria-hidden="true" />
        <AnalyticsProvider />
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="relative w-full flex-1 bg-neutral-50 flex flex-col scroll-mt-[var(--header-height)]"
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  )
}
