import "./global.css"

import type { Metadata } from "next"
import { Header } from "./components/header"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "./components/footer"
import { openSans } from "app/data/fonts"
import { baseUrl } from "./sitemap"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Jesse Wei | A Creator who blends design and technology",
    template: "%s",
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
      className={cx("text-neutral-800 bg-white text-base", openSans.className)}
    >
      <body className="antialiased flex flex-col items-center justify-between min-h-screen">
        <Header />
        <main className="relative w-full flex-1 bg-gray-50 flex flex-col">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  )
}
