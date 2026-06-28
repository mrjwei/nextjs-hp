import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Newsreader } from "next/font/google"

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
