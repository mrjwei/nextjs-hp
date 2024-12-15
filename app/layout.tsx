import './global.css'

import type { Metadata } from 'next'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import {openSans} from 'app/data/fonts'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'HP of Jesse Wei',
    template: '%s',
  },
  description: "This is Jesse Wei's homepage.",
  openGraph: {
    title: 'Jesse Wei',
    description: "This is Jesse Wei's homepage.",
    url: baseUrl,
    siteName: 'Jesse Wei',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-neutral-800 bg-neutral-50 dark:text-white dark:bg-neutral-800',
        openSans.className
      )}
    >
      <body className="antialiased mt-4">
        <main className="max-w-2xl lg:max-w-3xl mx-4 lg:mx-auto min-w-0 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  )
}
