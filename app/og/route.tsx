import { ImageResponse } from 'next/og'
import { profile } from 'app/content/profile'

export const runtime = 'edge'

// Matches CJK Unified Ideographs, Hiragana and Katakana — enough to tell a
// Japanese title apart from an English one for font selection below.
const CJK_REGEX = /[　-ヿ㐀-䶿一-鿿＀-￯]/

// Google's css2 endpoint returns a woff2 subset to just the glyphs in
// `text` when given one, so this stays small even for a full CJK title —
// no font file needs to be committed to the repo.
async function loadGoogleFont(font: string, text: string, weight: number) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    font
  )}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(cssUrl)).text()
  const resource = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)

  if (resource) {
    const fontResponse = await fetch(resource[1])
    if (fontResponse.status === 200) {
      return await fontResponse.arrayBuffer()
    }
  }

  throw new Error(`Failed to load font data for ${font}`)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') || 'Jesse Wei'
  const isJa = CJK_REGEX.test(title)
  const role = isJa ? profile.ja.role : profile.en.role

  const fontFamily = isJa ? 'Noto Sans JP' : undefined
  const fonts = isJa
    ? [
        {
          name: 'Noto Sans JP',
          data: await loadGoogleFont('Noto Sans JP', `${title}Jesse Wei・${role}`, 700),
          weight: 700 as const,
          style: 'normal' as const,
        },
      ]
    : undefined

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full items-center justify-center bg-white"
        style={fontFamily ? { fontFamily } : undefined}
      >
        <div tw="flex flex-col w-full py-12 px-4 justify-between p-8">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">
            {title}
          </h2>
          <p tw="flex text-2xl text-gray-500 mt-4">
            Jesse Wei · {role}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        // Cache per unique URL (including ?title=...) at the CDN.
        // This dramatically reduces origin/compute for bot crawls.
        'Cache-Control': 'public, immutable, no-transform, s-maxage=31536000, stale-while-revalidate=86400',
      },
    }
  )
}
