# jessewei.net: performance, SEO and traffic plan (Nov 2026)

*Prepared 1 Nov 2026 from a Lighthouse run against production, a crawl of every URL in the live sitemap, and a read of the repo. Builds on `docs/roadmap.md` (positioning unchanged) and the 15 Oct audit. Nothing here is implemented yet; each phase below gets its own branch and PR.*

## 0. Ground rules

- One branch per phase (names below), merged through a PR into `main`.
- **Gates for every phase:** `npm run lint && npm run typecheck && npm run build` pass. Re-run the Lighthouse set in §2 after the phase merges and deploys, and add the numbers to the log in `docs/baseline.md`.
- **Post content comes from the vault.** Any fix to a post's body, images or frontmatter (GIF → video, renamed image files, new description fields) goes through the vault note and `/update-pipeline`, not a direct MDX edit. Code-level fixes (components, metadata, sitemap) don't touch post MDX.
- No new runtime dependencies unless a phase says so. Don't change design tokens without Jesse's OK (see D2).
- Don't change live post URLs. Fixes here only remove redirect hops and soft 404s.

## 1. Goals and how they're measured

The site exists to get the audience in roadmap §1 (Tokyo hiring managers, recruiters and agents, EN and JA) to a case study and then to the contact link. So "traffic" means **qualified visits that reach a case study or About**, not raw pageviews.

| Area | Metric | Source | Target |
|---|---|---|---|
| Speed (field) | LCP, INP, CLS at p75, mobile | Vercel Speed Insights (already installed) | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 ("Good" on all three) |
| Speed (lab) | Lighthouse mobile Performance on the §2 page set | Lighthouse 12, simulated slow 4G | ≥ 90 on index pages, ≥ 80 on image-heavy posts; no page over 2 MB transferred |
| Indexing | Indexed vs submitted pages; "Crawled, not indexed" and soft-404 counts | Google Search Console (GSC) | Every sitemap URL indexed; zero soft 404s |
| Search | Impressions, clicks, CTR, average position; split EN/JA | GSC (Performance, filtered by `/ja/`) | +50% clicks in 3 months over the Phase 0 baseline |
| Traffic | Users and engaged sessions by channel (Organic, Referral, Social, Direct) | GA4 | Organic share of sessions rising month on month |
| Outcomes | `contact_click`, `work_card_click`, newsletter sign-ups, CV downloads (when on) | GA4 key events; Buttondown | Tracked reliably first (Phase 1), then grow |

Lab scores guide the work; field data (Speed Insights, later CrUX) is the scoreboard.

## 2. Baseline (1 Nov 2026, production)

Lighthouse 12.8.2, headless Chromium, default mobile preset (simulated slow 4G, 4× CPU slowdown), one run per page from a US-east cloud container. Expect ±5 points of run-to-run noise.

| Page | Perf | A11y | SEO | LCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|---|
| `/` | 62 | 96 | 100 | 3.7 s | 1,760 ms | 0 | 679 KiB |
| `/` (desktop) | 82 | 96 | 100 | 2.3 s | 30 ms | 0 | 701 KiB |
| `/about` | 72 | 93 | 100 | 3.8 s | 630 ms | 0 | 664 KiB |
| `/posts` | 73 | 96 | 100 | 4.4 s | 420 ms | 0 | 773 KiB |
| `/projects` | 79 | 95 | 100 | 3.4 s | 510 ms | 0 | 682 KiB |
| `/ja` | 78 | 96 | 100 | 3.9 s | 380 ms | 0.006 | 1,334 KiB |
| `/posts/strobe-assistant-extending-strobe-with-an-ai-agent` | 71 | 96 | 100 | 5.2 s | 240 ms | 0 | **22,781 KiB** |
| `/posts/ai-and-design/revamping-my-personal-website-with-claude-design-claude-code` | 64 | 96 | 100 | 8.5 s | 250 ms | 0 | **8,874 KiB** |

Build: passes; First Load JS is 103–117 kB per route (87 kB shared), so the app's own JavaScript is not the main problem.

Crawl of the 114 sitemap URLs: all return 200; no duplicate titles; every page has one `<h1>`. Problems are listed in §3.

Not available from here (Phase 0 fills these in): GSC impressions/clicks/indexing, GA4 traffic by channel, Speed Insights field data.

## 3. Findings

Ranked by impact within each group. IDs are referenced by the phases in §4.

### Measurement

- **M1. GA4 counts each landing pageview twice.** The inline `gtag('config', …)` in `components/views/root-layout.tsx` sends a `page_view`, then `components/layout/providers.tsx` calls `pageview()` on mount, which calls `gtag('config', …)` again and sends a second one. Client-side navigations are likely double-counted too if GA4's enhanced measurement ("page changes based on browser history events") is on, which is the default. Any traffic baseline taken from GA4 today is inflated, so fix this before measuring growth.
- **M2. No newsletter or outbound events.** The newsletter form posts to Buttondown with no GA4 event, so sign-ups can't be attributed to a post or channel.

### Performance

- **P1. Post images are full-size originals.** MDX bodies use 382 raw `<img>` tags. `components/posts/mdx.tsx` only maps `Image`, not `img`, so these skip `next/image`: no resizing, no AVIF/WebP, no lazy loading, no width/height. Lighthouse estimates 19 MB of savings on the Strobe post and 7.7 MB on the revamp post from responsive images alone. 30 files in `public/` are over 500 KB; the largest PNGs are 3–6 MB.
- **P2. Animated GIFs.** Four GIFs on the Strobe agent post weigh 22 MB together (8.7, 7.1, 5.3 and 1.4 MB). Lighthouse's estimate for converting them to video is 21 MB saved. They are why that page transfers 22 MB.
- **P3. Google Tag Manager blocks the main thread.** `gtag/js` (178 KiB) accounts for 944 ms of blocking time on Home and about 400 ms elsewhere. It's loaded with `next/script`'s default `afterInteractive`, so it competes with hydration. It's the largest third-party cost on every page.
- **P4. Hero text paints late.** On every index page the LCP element is text (the hero paragraph on `/`), yet LCP is 3.4–4.4 s against FCP of 1.2–2.0 s. Contributors: two render-blocking CSS files (31 + 13 KiB), five preloaded font files on EN pages (about 250 KiB: Geist Sans, Geist Mono, Newsreader normal and italic), and main-thread contention from P3. 1.6 s of script time is attributed to the Home document itself (inline RSC payload and hydration), which needs a profile.
- **P5. Hydration error on `/about`.** Production logs React error #418 (text content mismatch). The page re-renders on the client, which costs time and can shift content.
- **P6. Repo weight.** Four `public/` folders aren't referenced by any code or content: `the-problematic-design-of-everyday-things` (11 MB), `lingobun-part-1` (1.6 MB), `perfmate-app`, `learn-to-stop`. They don't slow the site but bloat clones and deploys. Two images on *Non-blocking AI validation* are named `Pasted image 2026….png`, with spaces, and one is preloaded as that page's LCP image.

### SEO correctness

- **S1. Soft 404s on untranslated JA URLs.** The header's language toggle (`toggleLangPath` in `components/layout/header.tsx`) only swaps the `/ja` prefix, so every EN-only post links to a `/ja/...` URL. Those URLs render the "not translated yet" view with **status 200, `index, follow`, a self-canonical and the title 「見つかりません」** (posts), or the site's default title (posts in a series). That's about 50 thin, near-duplicate pages Google can find from every EN post. On the EN side the toggle produces 404s: `/posts/order-form-ui-ux-improvement` and `/projects/uiux` from the JA-only case study, and `/ja/projects/austride`.
- **S2. Internal links go through redirects.** `WritingCard` (`components/posts/article-card.tsx`) defaults `path` to `"writings"`, so every standalone post card links to `/writings/<slug>`, which 308s to `/posts/<slug>`. That affects Home, `/posts` and the prev/next links on posts, in both languages (31 distinct redirecting URLs found). Each one costs visitors a round trip and sends link signals through a redirect.
- **S3. No hreflang on posts.** 96 of 98 post and series pages have no `alternate hreflang`, even when a translation exists (44 JA URLs are in the sitemap). Post metadata never passes `alternatePathname`. No page has `x-default`. The sitemap has no `alternates` either.
- **S4. Home has no canonical.** `/` and `/ja` take their metadata from the root layout, which sets `alternates.languages` but no `canonical`.
- **S5. No feed discovery.** No page links `/rss` with `<link rel="alternate" type="application/rss+xml">`, and there's no JA feed, so feed readers and aggregators don't find it.
- **S6. Article structured data is off.** `BlogPosting.author.name` is `"Jesse Wei | Writings and Works"`; it should be the same Person as the Home/About JSON-LD (by `@id`), with a URL. There's no `WebSite` schema (Google uses it for the site name in results), no `BreadcrumbList` although posts show breadcrumbs, and OG `article` tags lack `modified_time`, `author` and `tag`.
- **S7. Sitemap `lastModified` churns.** Static pages use today's date on every build, so the signal is noise and Google learns to ignore it.
- **S8. The 404 page sends two robots metas** (`noindex` and the root layout's `index, follow`).

### SEO content and reach

- **C1. Snippets.** 53 of 114 meta descriptions are over 160 characters (post summaries double as descriptions) and 31 titles are over 65 characters with the `| Jesse Wei` suffix. Google rewrites or truncates these. 25 descriptions are under 70 characters, mostly series pages ("Posts in the AWS series"-style) and the JA index pages (`/ja/posts/series` is 12 characters).
- **C2. OG images are plain.** `/og` renders black text on white. A shared link on LinkedIn, the main referral channel for the audience, looks generic next to other posts in the feed.
- **C3. Thin internal linking.** Posts link to prev/next in their list and the series, but not to related posts by tag or to the project they support, so case studies get few internal links from the essays that drive traffic.
- **C4. Accessibility overlaps.** `--text-subtle` fails colour contrast on the header language link and other small `--text-subtle` text such as the footer (every page), and `/about` has a link distinguished only by colour. These cost Lighthouse points and readability; fixing them means changing a token (D2).

## 4. Phases

Ordered so measurement is trustworthy first, then the cheap, high-impact fixes. Phases 1–3 are independent and can run in any order once Phase 0 is done.

### Phase 0: baseline and accounts (Jesse, no code)

- [ ] Verify the domain in **Google Search Console** as a Domain property (DNS TXT at the registrar covers `www` and both languages). Submit `https://jessewei.net/sitemap.xml`.
- [ ] Import the GSC property into **Bing Webmaster Tools** (one click; Bing's index also feeds DuckDuckGo and other search tools).
- [ ] Export the GSC baseline (last 3 months: clicks, impressions, CTR, position, top queries and pages, EN vs `/ja/`) and the **Page indexing** report. Note how many `/ja/` URLs show as soft 404 or "Crawled, currently not indexed".
- [ ] Record Speed Insights p75 LCP/INP/CLS (Vercel dashboard → Speed Insights, mobile) and GA4 users/sessions by channel for October, noting that GA4 pageviews are inflated (M1).
- [ ] Add the numbers to `docs/baseline.md`.

### Phase 1: `fix/analytics`

Fixes M1, M2, P3.

- [ ] Send one `page_view` per page: set `send_page_view: false` in the inline config and keep `AnalyticsProvider` as the only sender (or drop the provider and rely on enhanced measurement; pick one, not both). Check in GA4 DebugView: one `page_view` on landing and one per client navigation.
- [ ] Load gtag with `strategy="lazyOnload"` so it runs after the page is idle. Events fired before it loads queue in `dataLayer`, so nothing is lost. Alternative: drop GA4 and use Vercel Web Analytics only (D1).
- [ ] Add a `newsletter_signup` event on a successful subscribe, and mark `contact_click` and `newsletter_signup` as key events in GA4.
- [ ] Tag links Jesse posts on LinkedIn and elsewhere with UTM parameters (`utm_source=linkedin&utm_medium=social&utm_campaign=<slug>`) so Referral and Social split cleanly. Document the convention in `docs/publish.md`.
- **Done when:** DebugView shows single pageviews; Home TBT on mobile drops from 1,760 ms to under 600 ms.

### Phase 2: `fix/seo-correctness`

Fixes S1–S5, S7, S8. Code only; no post MDX changes.

- [ ] **S2:** `WritingCard` builds `/posts/...` hrefs (change the `"writings"` default and its `/${path}/` branch). Re-crawl: no internal link should return 3xx.
- [ ] **S1, language toggle:** pass the counterpart URL down from the page (the views already know whether a translation exists via `getWritingBySlug(slug, otherLang)`), and fall back to the other language's index page (`/ja/posts`, `/posts`, `/projects`) when there's none. This removes the 404s and stops pointing crawlers at untranslated JA URLs.
- [ ] **S1, untranslated pages:** the "not translated yet" view keeps working for people, but its metadata gets `noIndex` and a real title (「英語版のみ公開中」 or similar), and the series fallback in `collectionPostMetadata` returns metadata instead of `undefined`. (Alternative in D4.)
- [ ] **S3:** post, series and project metadata pass `alternatePathname`/`alternateLang` when the other language has the same post; `buildStandardMetadata` adds `x-default` pointing at the EN URL. The sitemap gets `alternates.languages` per entry (Next 14.2's `MetadataRoute.Sitemap` supports it).
- [ ] **S4:** `generateMetadata`/`metadata` on `/` and `/ja` with a canonical (via `buildStandardMetadata`).
- [ ] **S5:** add `/ja/rss` (JA posts) and `alternates.types: { "application/rss+xml": … }` in the root metadata for each language.
- [ ] **S7:** static sitemap entries use the latest content date (as `/posts` already does) or omit `lastModified`.
- [ ] **S8:** give the not-found pages `robots: { index: false }` metadata so only one robots meta is emitted.
- **Done when:** re-running the crawl script finds zero redirecting or 404 internal links, every post with a translation has reciprocal hreflang plus `x-default`, and `/ja/posts/<untranslated>` is `noindex`. Then ask GSC to validate the soft-404 fix.

### Phase 3: `perf/images`

Fixes P1, P2, P6. The biggest byte savings on the site.

- [ ] **Image manifest:** a `scripts/generate-image-manifest.mjs` step in `prebuild`/`predev` that reads the intrinsic width and height of every image under `public/` (PNG/GIF/JPEG/WebP headers and SVG `viewBox`, parsed directly, no dependency) into a generated, uncommitted `app/data/image-manifest.json`.
- [ ] **`img` override in `components/posts/mdx.tsx`:** map MDX `img` to a component that looks the `src` up in the manifest and renders `next/image` with those dimensions, `sizes="(max-width: 768px) 100vw, 768px"`, lazy loading, and the existing `style`/`alt`. SVGs and anything missing from the manifest fall back to a plain `<img loading="lazy" decoding="async">` with dimensions when known. The post content doesn't change, so the vault isn't involved.
- [ ] `next.config.js`: `images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 31536000 }`. Check the Vercel plan's image-optimisation quota first (D3); about 200 source images, each in a few widths.
- [ ] Mark the first image in a post `priority` only when it's above the fold (most posts' LCP is the `<h1>`, so the default stays lazy).
- [ ] **GIF → video (vault):** convert the four Strobe GIFs to MP4 (H.264) plus WebM with `ffmpeg`, replace them in the vault note with `<video autoPlay muted loop playsInline poster=…>`, and deploy through `/update-pipeline`. Expected: about 22 MB → 2–3 MB.
- [ ] **Rename (vault):** the two `Pasted image …png` files on *Non-blocking AI validation* to kebab-case names.
- [ ] **Clean-up:** after confirming no vault note references them, delete the four orphaned `public/` folders (about 13 MB).
- **Done when:** no post transfers more than 2 MB on first load; the revamp post's mobile LCP is under 4 s and the Strobe post's under 3.5 s; Lighthouse `unsized-images` and `uses-responsive-images` pass.

### Phase 4: `perf/fonts-css-hydration`

Fixes P4, P5.

- [ ] Fix the `/about` hydration mismatch (#418): reproduce with `npm run build && npm start` in a non-UTC timezone, find the differing text node, make it deterministic.
- [ ] Fonts: set `preload: false` on Geist Mono and drop the Newsreader italic preload (keep the face, lose the preload) so only the faces used above the fold are preloaded; confirm Newsreader only ships the weights actually used. Check the EN hero for a visible font swap after the change.
- [ ] Profile the Home document's 1.6 s of script time (Chrome Performance panel, 4× CPU) and the inline RSC payload size; move anything client-only that isn't needed at first paint (search palette, back-to-top) behind `next/dynamic` if it shows up.
- [ ] Try inlining critical CSS (`experimental.optimizeCss`, which needs `critters` as a dev dependency) and keep it only if mobile FCP improves on the §2 set.
- **Done when:** mobile Lighthouse Performance ≥ 90 on `/`, `/posts`, `/projects`, `/about` and `/ja`, and LCP ≤ 2.5 s on each.

### Phase 5: `feat/structured-data-and-og`

Fixes S6, C2.

- [ ] A JSON-LD graph: `WebSite` (name "Jesse Wei", `inLanguage`, `url`) and `Person` with a stable `@id` (`https://jessewei.net/#person`), emitted in the root layout; About's `ProfilePage.mainEntity` and every `BlogPosting.author` reference the `@id`.
- [ ] `BlogPosting`: correct author, absolute `image`, `keywords` from tags, `isPartOf` the series when there is one; plus `BreadcrumbList` built from the existing `crumbs`.
- [ ] OG `article`: `modifiedTime`, `authors`, `tags`. Pass `updatedAt` through `buildStandardMetadata`.
- [ ] Redesign `/og` within the site's restraint rules: Newsreader title, Geist role line, the logo mark and accent rule, the series name when there is one. Fetch Newsreader the same way the route already fetches Noto Sans JP.
- **Done when:** Google's Rich Results Test shows no errors for a post, About and Home; LinkedIn Post Inspector shows the new card.

### Phase 6: `content/search-snippets` (code + vault)

Fixes C1, C3.

- [ ] Optional `description` frontmatter (≤ 155 characters EN, ≤ 110 JA) used for the meta description and OG; `summary` stays the on-page lead. Add it to both validators (`lib/content/index.ts`, `scripts/generate-content-index.mjs`), `docs/publish.md` and the pipeline's frontmatter handling (D5). Backfill the ten most-visited posts first (from GSC), then the rest as notes are touched.
- [ ] Optional `seoTitle` for the few posts whose titles exceed about 60 characters, so the on-page title can stay long.
- [ ] Series descriptions: add a one-line `description` per series in `app/data/series.json` (EN and JA) and use it on series pages instead of "Posts in the X series".
- [ ] Related posts: two or three posts sharing the most tags at the end of each post, plus a "Part of project X" link on any post with a `project`, so the essays pass visitors and link signals to the case studies.
- **Done when:** no description is over 160 characters or under 70; every post links to at least two other posts besides prev/next.

### Phase 7: traffic (ongoing, mostly not code)

A personal site gets found through search for specific problems, LinkedIn shares, and links from places the audience already reads. The posts that do best are the ones that answer one specific question with first-hand evidence.

- **Write for queries that exist.** Before drafting each case study, check two or three target queries in GSC (once it has data) or Google's autocomplete, EN and JA, and put the main phrase in the title, the first paragraph and one `##` heading. Priorities follow roadmap §3: the DEN case study JA-first (業務DX, 生成AI, 人の確認, 福祉), Design in Git, LLM tool calling, Cognito.
- **Refresh what already ranks.** Each month, take the GSC pages with high impressions but under 2% CTR or position 8–20; rewrite the title and description (Phase 6 fields), add a section that answers the query better, update `updatedAt`.
- **LinkedIn every post.** A native post with the key image or diagram and the result in the first two lines, and the link (with UTM) in the first comment or post body. Add the best case study to LinkedIn Featured.
- **Cross-post with canonical links** where the platform supports `rel=canonical`: dev.to, Hashnode, Medium (via its import tool). For Zenn, Qiita and note, which don't, post a short JA summary with a link back rather than the full article, so the duplicate doesn't outrank the original.
- **Earn links.** GitHub profile README and pinned repos link to the related posts; post the Design in Git series and the tool-calling explainer where developers and designers read (Hacker News "Show HN" for Design in Git, relevant subreddits, Designer News); reply in threads where a post genuinely answers the question.
- **Newsletter.** Add a sign-up block at the end of each post (the footer form exists already) and send one email per new post through Buttondown, so each post gets a second wave of visits.
- **Review monthly** (§6).

## 5. Decisions for Jesse

| # | Question | Recommendation |
|---|---|---|
| D1 | Keep GA4 or move to Vercel Web Analytics only? GA4 costs about 1 s of main-thread time on mobile Home; Vercel Analytics is already installed but has fewer reports and shorter retention on the Hobby plan. | Keep GA4, load it `lazyOnload` (Phase 1), and revisit after measuring. |
| D2 | Darken `--text-subtle` enough to pass WCAG AA contrast (4.5:1 on the page surface)? It's a token change, which the roadmap says needs your OK. | Yes, the smallest change that passes; check it visually on every page. |
| D3 | Vercel image optimisation (counts against the plan's quota) or pre-compressed WebP/AVIF made at publish time in the pipeline? | Vercel optimisation via the manifest approach first; switch if the quota bites. |
| D4 | Untranslated JA post URLs: `noindex` "not translated" page (status 200), a real 404, or a 307 to the EN post? | `noindex` page, as now but with correct metadata; it's the friendliest for JA readers and stops the soft 404s. |
| D5 | Add optional `description` and `seoTitle` frontmatter to the pipeline? | Yes, optional and backfilled gradually. |
| D6 | Which cross-posting channels to use? | dev.to and LinkedIn for EN, Zenn summaries for JA; skip Medium unless a post fits its audience. |

## 6. Measurement cadence

- **After each phase deploys:** re-run the §2 Lighthouse set (mobile) and the sitemap crawl; append the numbers to `docs/baseline.md`.
- **Monthly (first week):** GSC clicks, impressions, CTR, average position, indexed pages (EN and `/ja/` separately); GA4 users and engaged sessions by channel and key events; Speed Insights p75 LCP/INP/CLS. Pick the next three posts to refresh from the GSC "high impressions, low CTR" list.
- **Quarterly:** compare against the Phase 0 baseline and the targets in §1; adjust Phase 7 priorities.

## 7. Out of scope

- Next 14 → 15 and Tailwind alpha → stable 4.x upgrades (tracked in roadmap §3; each needs its own branch and a visual check). Re-measure after them, since both can change bundle size and CSS output.
- New pages (services, `/now`) and positioning changes.
- Paid acquisition.
