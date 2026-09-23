import "../global.css"

import type { Metadata } from "next"
import Script from "next/script"
import { RootShell } from "@/components/root-shell"
import { geistSans, geistMono, newsreader } from "app/data/fonts"
import { baseUrl } from "../sitemap"
import { profile } from "app/content/profile"

const { title: metaTitle, description: metaDescription } = profile.en.meta

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: metaTitle,
    template: "%s | Jesse Wei",
  },
  description: metaDescription,
  alternates: {
    languages: {
      en: baseUrl,
      ja: `${baseUrl}/ja`,
    },
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
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
