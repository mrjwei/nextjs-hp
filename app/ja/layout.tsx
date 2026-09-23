import "../global.css"

import type { Metadata } from "next"
import Script from "next/script"
import { RootShell } from "@/components/root-shell"
import { geistSans, geistMono, newsreader } from "app/data/fonts"
import { baseUrl } from "../sitemap"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Jesse Wei — 業務に実装されるAIをつくるアプライドAIエンジニア",
    template: "%s | Jesse Wei",
  },
  description:
    "生成AI／LLMシステムを実際の業務に実装するアプライドAIエンジニア。文書処理パイプライン、評価設計、顧客との要件整理から本番運用までを担当し、10年のプロダクトデザイン・開発経験で「使われるAI」をつくります。拠点は日本、英語・日本語・中国語で対応可能です。",
  alternates: {
    languages: {
      en: baseUrl,
      ja: `${baseUrl}/ja`,
    },
  },
  openGraph: {
    title: "Jesse Wei — 業務に実装されるAIをつくるアプライドAIエンジニア",
    description:
      "生成AI／LLMシステムを実際の業務に実装するアプライドAIエンジニア。文書処理パイプライン、評価設計、顧客との要件整理から本番運用までを担当し、10年のプロダクトデザイン・開発経験で「使われるAI」をつくります。拠点は日本、英語・日本語・中国語で対応可能です。",
    url: `${baseUrl}/ja`,
    siteName: "Jesse Wei",
    locale: "ja_JP",
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

export default function JaRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ja"
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
      <RootShell lang="ja">{children}</RootShell>
    </html>
  )
}
