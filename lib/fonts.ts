import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Newsreader, Noto_Sans_JP } from "next/font/google"

// Geist — UI + body (self-hosted via the `geist` package).
// Exposes CSS var `--font-geist-sans`.
export const geistSans = GeistSans

// Geist Mono — labels, code, metadata. Exposes `--font-geist-mono`.
export const geistMono = GeistMono

// Newsreader — editorial serif for display headlines & pull-quotes.
export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
})

// Noto Sans JP — the `/ja` tree's body + display face. Newsreader has no
// CJK glyphs, so JA display copy uses this (at 600-700) instead of the
// serif (see :lang(ja) rules in app/global.css). Exposes `--font-ja`.
export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-ja",
})
