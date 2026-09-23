# jessewei.net — AI repositioning brush-up plan

*Prepared 23 Sep 2026 for implementation by Claude Code inside `nextjs-hp`. Source of truth for the positioning: `Notes/Career/Job hunting/⭐️ai-engineering-pivot-2026Q4.md` and `career-profile-{en,ja}.md`. This plan **supersedes** the design-first framing in `docs/roadmap/month-1-evidence-and-spine.md` and updates (does not replace) `Notes/Career/Business/jessewei-net-Consultancy-Adaptation-Plan-2026-09.md`.*

---

## 0. Read this first (for Claude Code)

**Who the site is for, in priority order**

1. Hiring managers and recruiters for **Forward Deployed Engineer / AI Solutions Engineer / Applied AI (生成AI) Engineer** roles in Tokyo, and a small number in Australia. They give the site 30–90 seconds and want to verify: *has this person shipped LLM systems for real users, and can they prove quality?*
2. Japanese hiring managers reading the `/ja` tree (same question, plus 上流工程 and Japanese-language delivery).
3. Later (feature-flagged, off for now): Japanese SME owners looking for AI + design help (§7).

**One-line positioning (use verbatim, don't paraphrase in new places)**

- EN: *Applied AI engineer who ships LLM systems into real business workflows — from messy Japanese documents to evaluated, production-ready pipelines — with a decade of product experience that makes those systems usable and adopted.*
- JA: *生成AI/LLMシステムを実際の業務に実装するアプライドAIエンジニア。日本語の複雑な文書処理から、評価設計を伴う本番運用可能なパイプライン構築まで一貫して担当。10年のプロダクト経験を活かし、「使われるAI」を作る。*

**Vocabulary rules** (from the pivot doc §2.4)

- Use: LLM pipelines, evaluation, ground truth, retrieval, orchestration, guardrails, human-in-the-loop, cost/latency, deployed for a client, production.
- Avoid in new copy: "design leadership", "design culture", "vibe coding", "AI literacy", "未経験". Design is a **differentiator sentence**, never the headline.
- UK/AU spelling in EN (existing repo convention).

**Already done in this session (23 Sep) — don't redo, build on it**

| File | Change |
|---|---|
| `app/(en)/page.tsx`, `app/ja/page.tsx` | Hero eyebrow, H1, sub-copy rewritten for AI positioning; primary CTA is now *See selected work*, secondary *About me* |
| `app/(en)/about/page.tsx`, `app/ja/about/page.tsx` | Rewritten: AI-first intro → *What I'm building now* (4 AI projects) → *Where I come from* (DEN 8 yrs, Money Forward, WAmazing with metric, Zerospec) → *What I'm looking for*. Instagram dropped from the About CTA |
| `app/(en)/layout.tsx`, `app/ja/layout.tsx` | Default `<title>` and meta/OG description |
| `components/footer.tsx` | Newsletter sub-copy (EN + JA) |

These are copy-only edits layered on top of Jesse's **uncommitted** portfolio → gallery restructure (see Phase 0). Typecheck and lint pass.

**Quality gates for every phase:** `npm run lint && npm run typecheck && npm run build` green; mobile Lighthouse per `docs/baseline.md` (update its URL list — `/portfolio` no longer exists); no new dependencies unless the task says so; one branch per phase, small PRs.

---

## 1. Audit of the current site (23 Sep 2026)

Ranked by damage to the new positioning.

| # | Finding | Why it matters | Fixed in |
|---|---|---|---|
| 1 | **Selected work shows three "coming soon" placeholders** (`wamazing.mdx`, `gonow-design-ops.mdx`, `case-study-3.mdx` — tagged `casestudy`) plus LingoBun/AuStride overviews and two design essays. | The first proof section on the home page says "nothing finished yet". None of the cards is AI engineering. | Phase 3 |
| 2 | **No case-study format.** Case studies are ordinary writings filtered by `?tags=casestudy`; no result, role, stack or client-type up front. | FDE/applied-AI screeners look for *problem → system → evaluation → outcome* in the first screen. | Phase 3 |
| 3 | **Positioning is scattered across ~9 files** (two home pages, two about pages, two layouts, footer, OG route, header). | Every future shift means hunting strings; EN and JA drift (e.g. the JA about page said DEN was 7 years while the profile says 8). | Phase 1 |
| 4 | **Primary nav includes *Gallery*** (illustration artworks) and the header shows **Instagram** next to LinkedIn/GitHub. | Signals "visual designer" to an AI hiring manager in the first second. | Phase 2 |
| 5 | **Home "Latest writing" is purely chronological** — currently CNN explainers first. | Learning-level posts lead; the strongest AI-engineering pieces (security pipeline, correlation IDs, MCP security, AI guidelines audit) are buried. | Phase 4 |
| 6 | **No contact route, no CV, no availability statement** outside About prose. | Recruiters need a one-click next step. | Phase 2 / 6 |
| 7 | **Canonical host bug:** `app/sitemap.ts` exports `baseUrl = "https://www.jessewei.net"` but `next.config.js` 301s `www` → apex. Every canonical, hreflang, OG URL and sitemap entry points at a redirect. | SEO / link-preview hygiene. | Phase 0 |
| 8 | **JA typography:** no Japanese font declared; headings inherit `letter-spacing: -0.015em` and `line-height: 1.1`. **OG route** (`app/og/route.tsx`) loads no font → CJK titles render as tofu. | The `/ja` tree is half the target market. | Phase 5 |
| 9 | Header active state uses exact match (`path == pathName`), so `/writings/AI/foo` doesn't highlight *Writing*. No `Person` JSON-LD on home/about. `docs/baseline.md` still lists `/portfolio`. | Polish / trust. | Phase 2 / 6 |
| 10 | Tag vocabulary (`app/data/tags.json`) has no `llm`, `evals`, `rag`, `agents`, `mlops`. | Can't filter writing by the new focus. | Phase 3 |

What's already good and must be kept: the restrained token system in `app/global.css` (cool grays, single blue accent, Newsreader display + Geist), the bilingual route mirror, zod-validated frontmatter, the search palette, the publish/translate skills.

---

## 2. Design principles for the brush-up

1. **Proof before prose.** Every section answers "how do I know?" — a number, a diagram, a repo, or an eval result. No adjectives without evidence.
2. **Outcome-first case studies.** Result in the first screen, then constraint → system → how it was evaluated → what I chose not to do → craft. (Same rule as the Q4 roadmap, now with an *evaluation* step.)
3. **Positioning is data, not markup.** Role title, headline, focus areas, availability and feature flags live in one typed config per language. Changing direction later = editing one file + re-tagging featured content, not redesigning pages.
4. **Restraint stays.** Keep the existing tokens, type and accent. The brush-up is IA, content model and a handful of components — not a rebrand. No dark mode, no animation library, no hero illustration.
5. **Bilingual parity by construction.** Long prose moves to MDX per language so the `translate` skill can keep EN/JA in sync.

---

## 3. Target information architecture

```
EN                                          JA (mirrors EN; consultancy pages flagged off)
/            Home                            /ja
/work        Work — case studies index       /ja/work        実績
/work/[slug] Case study (result block)       /ja/work/[slug]
/writings    Writing (existing)              /ja/writings    記事
/about       About (+ CV links)              /ja/about       プロフィール
/now         Now — dated, what I'm on         /ja/now         いま取り組んでいること
/gallery     Gallery (footer link only)      /ja/gallery
—            (advisory, flag off)            /ja/services    (flag off, §7)
```

- **Header nav:** EN `Work · Writing · About` (logo = Home); JA `実績 · 記事 · プロフィール`. Header icons: search, LinkedIn, GitHub. Instagram and Gallery move to the footer.
- **Footer:** newsletter (existing), then a link row: Now · Gallery · RSS · LinkedIn · GitHub · Instagram · email.
- **Home, top to bottom:**
  1. **Hero** (from config): eyebrow, H1, sub, CTAs *See selected work* / *About me*, plus a one-line **availability** chip (e.g. "Open to applied AI / FDE roles · Tokyo & Australia · from early 2027").
  2. **Proof strip** — 3–4 small facts from config, each linking to its evidence (e.g. "LLM systems built for 2 client businesses", "Eval harness · 146 labelled attacks", "10 yrs B2B product · 3+ yrs frontend lead", "EN · 日本語 · 中文").
  3. **Selected work** — 3 `WorkCard`s chosen by `featured` order (not by date), each with a result line.
  4. **How I work** — three short columns: *Scope it with the customer* · *Build the pipeline* · *Prove it with evals*. Static copy from config; links to the relevant case study.
  5. **Featured writing** — up to 4 posts: `featured` first, then latest posts whose tags intersect the config's `focusTags`. "All writing →".
  6. **Now band** — 2–3 lines from `/now` + its date.
- **Case study page:** `ResultBlock` above the MDX body (result sentence, role, client type, industry, duration, stack chips, status such as "In production" / "Pilot" / "Research"), optional architecture diagram, then MDX. Prev/next within Work.

---

## 4. "Positioning as data" — the flexibility layer

Create `app/content/profile.ts` exporting a typed `profile: Record<Lang, Profile>`:

```ts
type Profile = {
  role: string                 // "Applied AI engineer"
  eyebrow: string              // "Applied AI engineer · Japan & Australia"
  headline: string             // "AI that gets used, not just demoed."
  subhead: string
  meta: { title: string; description: string }
  availability: { open: boolean; text: string; updated: string } // ISO date
  proof: { label: string; href?: string }[]
  howIWork: { title: string; body: string; href?: string }[]
  focusTags: string[]          // e.g. ["llm","evals","agents","security","ai"]
  rolesSought: string[]
  languages: string[]
  social: { id: "linkedin"|"github"|"instagram"|"email"; href: string; inHeader: boolean }[]
  features: { galleryInNav: boolean; advisory: boolean; newsletter: boolean; now: boolean }
}
```

Wire it into: both home pages, both layouts' `metadata`, `components/header.tsx` (nav + social icons + feature flags), `components/footer.tsx`, `app/og/route.tsx` (role line), about page intro (or the MDX frontmatter), and `Person` JSON-LD. Seed the EN/JA values from the copy already written on 23 Sep so nothing visibly changes in Phase 1.

**Content-level knobs** (add to both the zod schema in `app/utils/index.ts` **and** the parser in `scripts/generate-content-index.mjs` — the index script has its own minimal parser):

- `featured?: number` — lower = earlier on Home/Work; absent = not featured.
- `track?: "ai-engineering" | "product-design" | "security" | "research"` — Work index filter; lets a future focus shift re-order the site by changing `focusTags`/`featured` only.
- `draft?: boolean` — excluded from all grids, sitemap, RSS and search in production; visible in `npm run dev`.
- Case-study fields (all optional): `result`, `role`, `client` (type, not name, unless permitted), `industry`, `duration`, `stack: string[]`, `status: "production" | "pilot" | "research" | "shipped" | "archived"`, `confidential?: boolean` (renders a small "Details anonymised at the client's request" note).

When the focus shifts again (e.g. toward MLOps, or toward the consultancy): edit `profile.ts`, re-rank `featured`, flip `features.*`. No page rewrites.

---

## 5. Visual brush-up (component list)

Use existing tokens only; 4px spacing grid; specify at 360 / 768 / 1120.

| Component | Spec |
|---|---|
| `AvailabilityChip` | Small pill under the hero CTAs: green dot (`--success`) + text + "Updated {date}". Hidden when `availability.open` is false. |
| `ProofStrip` | 2×2 on mobile, 4-up on desktop; mono eyebrow label style for the small caption, `--text-strong` for the fact. Each item optionally a link. |
| `WorkCard` | Extends `WritingCard`: eyebrow = industry · year, title, **result line** (one sentence, `--text-strong`), stack chips (max 4), status badge. No thumbnail required; if `image` exists show it 16:9. |
| `ResultBlock` | Bordered panel (`--surface-sunken`, `--border-subtle`, radius md): result sentence in display serif at ~1.5rem, then a definition list (Role / Client / Industry / Duration / Stack / Status). Renders `<dl>`. |
| `HowIWork` | Three columns with lucide icons (`MessagesSquare`, `Workflow`, `FlaskConical`) at the header's stroke weight. |
| `Figure` MDX component | For architecture diagrams: `<Figure src alt caption />`, light background, zoom-on-click optional (no library). Register in `components/mdx.tsx`. |
| Header | Prefix-match active state (`pathName === path || pathName.startsWith(path + "/")`); replace hard-coded `rgba(255,255,255,0.82)` with a token (`--surface-header`). |
| OG image | `app/og/route.tsx`: two-line layout — title + "Jesse Wei · {role}" from config; load a subset JA font (e.g. Noto Sans JP 700 subset committed under `public/fonts/`) and use it when the title contains CJK. |

Don'ts: gradients, stock imagery, emoji, animated counters, logo walls of employers.

---

## 6. Work order for Claude Code

Branch per phase. Each numbered task is one PR unless noted.

### Phase 0 — Stabilise (½ day)

0.1 **Finish the in-progress restructure.** `git status` shows staged/unstaged renames (`portfolio` → `gallery`, case studies and LingoBun/AuStride overviews moved into `app/writings/posts`), plus the 23 Sep copy edits. Ask Jesse to confirm, then commit them as two commits: (a) restructure, (b) copy. Add redirects in `next.config.js`: `/portfolio` → `/work` (after Phase 2) or `/writings?tags=casestudy` (until then), `/portfolio/:slug` → matching new path, `/ja/portfolio*` likewise.
0.2 **Canonical host fix:** `baseUrl = "https://jessewei.net"` in `app/sitemap.ts`; confirm `metadataBase`, `alternates`, RSS and JSON-LD all follow.
0.3 Update `docs/baseline.md` URL list; record a Lighthouse baseline (mobile) for `/`, `/about`, `/writings`, `/ja`.

**Acceptance:** build green; no URL in sitemap/canonical uses `www`; old portfolio URLs 301 somewhere sensible.

### Phase 1 — Positioning as data (1 day)

1.1 Create `app/content/profile.ts` per §4, seeded from current copy.
1.2 Refactor home pages, layouts' metadata, header, footer and OG route to read from it. Pixel-identical output is the acceptance test (screenshot `/`, `/ja`, `/about`, `/ja/about` before/after).
1.3 Move About prose to `app/pages-content/{en,ja}/about.mdx`, rendered with the existing MDX pipeline (`components/mdx.tsx`). Keep the avatar/grid layout in TSX.

**Acceptance:** grep for "Applied AI engineer" / "アプライドAIエンジニア" finds it only in `profile.ts` and MDX content.

### Phase 2 — IA and navigation (1 day)

2.1 `/work` and `/work/[slug]` (+ JA) listing writings where `tags` includes `casestudy` **or** `track` is set and `draft` is not true. Implementation may reuse writings content (no new content dir): Work is a *view*, case studies stay in `app/writings/posts`. Canonical for a case study = `/work/[slug]`; the writings route for the same file 301s or sets `canonical` to the Work URL — pick one and document it in `docs/publish.md`.
2.2 Nav per §3; Gallery and Instagram to footer; header prefix-match active state.
2.3 `/now` (+ JA) from `app/pages-content/{en,ja}/now.mdx` with `updatedAt` in frontmatter, shown at top.
2.4 Contact: `mailto:` link in footer and About (address from `profile.social`). No form in this phase.
2.5 CV links on About: `/cv/jesse-wei-cv-en.pdf` and `/cv/jesse-wei-shokumukeirekisho-ja.pdf` behind `features.cv` (files supplied by Jesse later; render nothing if flag off).

**Acceptance:** keyboard-only nav works; mobile sheet menu shows the new items; `/gallery` still reachable; sitemap includes `/work`, `/now` and JA twins.

### Phase 3 — Case-study system (1–1.5 days)

3.1 Frontmatter fields from §4 in zod + index script; `ResultBlock`, `WorkCard` components.
3.2 Mark the three placeholders `draft: true` so they disappear from production immediately; keep files as templates.
3.3 Add `app/_drafts/_case-study-template.mdx` with the section skeleton: *Result · Context & constraint · System (diagram) · Evaluation · What I chose not to do · Outcome & next · Stack*.
3.4 Re-tag existing content: add `track` + `featured` to `LingoBun/lingobun-overview.mdx` (reframe title/summary toward "AI product hardened for production": rate limits, cost caps, 180 tests), `security/understanding-log-types.mdx`, `security/deterministic-attack-to-alert-mapping.mdx`, `design/ai-design-guidelines.mdx`. Add tags `llm`, `evals`, `agents`, `rag`, `mlops` to `app/data/tags.json`.
3.5 Work index filter by `track` (reuse the tag-filter pattern in `writings-tag-filter.client.tsx`).

**Acceptance:** Home "Selected work" shows no placeholders; each card has a result line; a case study renders its ResultBlock above the body in EN and JA.

### Phase 4 — Home redesign (1 day)

4.1 Implement the §3 home order with `AvailabilityChip`, `ProofStrip`, `WorkCard` grid, `HowIWork`, featured writing (`featured` first, then `focusTags` match), Now band.
4.2 Mirror in `/ja` with `JaEmptyNotice` fallbacks where JA content is missing.

**Acceptance:** above the fold at 1120px shows hero + availability + proof strip; at 360px, hero + CTAs fit without horizontal scroll; LCP ≤ 2.5 s on throttled mobile.

### Phase 5 — Japanese quality (½–1 day)

5.1 JA font via `next/font/google` (Noto Sans JP or BIZ UDPGothic; 400/500/700) exposed as `--font-ja`; apply on `app/ja/layout.tsx`; `:lang(ja)` rules: headings `letter-spacing: 0`, display `line-height: 1.4`, body `1.8`, `font-feature-settings: "palt"` on headings only; JA display uses the sans at 600–700, not Newsreader.
5.2 OG route CJK font (see §5).
5.3 Run the repo's `translate` skill for every case study that reaches `featured`.

### Phase 6 — Trust & SEO (½ day)

6.1 `Person` JSON-LD on `/` and `/about` (name, jobTitle from config, knowsLanguage, sameAs LinkedIn/GitHub, affiliation QUT — switch to alumniOf after graduation); `ProfilePage` type on About.
6.2 Case study pages: `Article` JSON-LD with `about` = industry.
6.3 GA4 events via a new `event()` helper in `app/analytics.ts`: `cta_selected_work`, `cv_download`, `contact_click`, `work_card_click`.

### Phase 7 — Advisory module, built but switched off (½ day, optional)

See §7. Ships dark: `features.advisory = false`.

---

## 7. AI + design consultancy — recommendation

**Verdict: architect for it now, don't publish offers yet.**

- The FDE/applied-AI story and an "AI + design" consultancy are *the same story* — putting AI into how a real business works, with the human and the workflow designed in. So every case study built for the job search (KOD pipeline, DEN human-in-the-loop records, capstone evals) is also consultancy proof. That's why the site structure above already serves both.
- But a visible services/pricing page during a job search tells FDE hiring managers you may not stay, and competes for the same 15–20 hours a week the pivot plan needs. The adaptation plan's own rule still holds: consultancy pages wait until the job search resolves (offer accepted, or the Nov checkpoint says to change course).
- What goes live now: one sentence at the end of About ("always glad to talk with teams bringing AI into Japanese businesses" — already added) and the proof itself.

**What to build dark in Phase 7** (updates §4/§6/§7 of the 14 Sep adaptation plan from "design infrastructure" to "AI + design"):

- `app/data/services.ts` with a re-framed ladder: **AI活用診断** (2-week readiness audit: where AI can and can't be trusted in your workflows) → **業務AI実装スプリント** (6–10 weeks: one workflow redesigned + an LLM pipeline with a human review gate, evals and staff training) → **運用・評価レビュー** (quarterly: eval re-runs, prompt/model updates, next workflow) → **AI顧問** (monthly, max two clients). Keep price ranges from the SME assessment as placeholders; don't render prices until Jesse confirms.
- `/ja/services` and an EN About "Advisory" block, both gated by `features.advisory`; excluded from sitemap/nav while false.
- The adaptation plan's JA hero copy ("デザインとAIの「仕組み」を、御社の中に残す。") still fits and can be reused when the flag flips.

---

## 8. Content backlog that the site needs (from the pivot plan)

The code above is only as good as what goes into it. In priority order — each becomes a `featured` Work entry:

1. **Capstone evals** — "Most detection gaps were logging gaps" + the scoring rule that inflated accuracy (75.0% → 97.9%). Publishable after the supervisor's OK; reuse the IFN738 visual pack.
2. **DEN — letting an LLM write regulatory records, and deciding where it isn't allowed to.** ◎/○/★ → code / LLM / human; eval harness results. Needs 加納社長's written permission for naming and screenshots (seed data only).
3. **KOD — LLM document checking (anonymised).** Architecture diagram, text-vs-vector warning-symbol extraction, rule engine, Japanese requirements. Needs KOD's OK on what can be named.
4. **LingoBun** — reframed as AI product hardening.
5. **WAmazing** (design track) — keep; it's the best outcome number (200+/week → ~4), but not featured above the AI work.

Until 1–3 are live, Home "Selected work" shows LingoBun + the two security-pipeline posts + the AI-guidelines audit, not placeholders.

---

## 9. Benchmarks — what to borrow from whom

| Site | Why it's relevant | Borrow |
|---|---|---|
| [Parlance Labs](https://parlance-labs.com/) (Hamel Husain) | AI evals consultancy; "Build AI that works in production" | Three-step value framing (diagnose → method → ship); proof via numbers, not adjectives. Model for the dark advisory page. |
| [hamel.dev](https://hamel.dev/) | Practitioner site that funnels writing into consulting/teaching | Blog as a dense dated table; services woven in, not a separate brochure. |
| [jxnl.co](https://jxnl.co/) and its [services page](https://jxnl.co/services/) (Jason Liu) | Applied-AI engineer turned consultant; now publicly *closed* to engagements | An availability page that states plainly what you do and don't take on — the pattern for `features.advisory` + `/now`. |
| [eugeneyan.com](https://eugeneyan.com/) | Applied ML/LLM practitioner, now at Anthropic | One-sentence mission; "Start here"; prototypes shown as evidence; stats as quiet credibility. |
| [huyenchip.com](https://huyenchip.com/) | "I work to bring AI to production" | Minimal intro that leads with the job-to-be-done, then credentials. |
| [Normally](https://www.normally.com/) | Data & AI product studio (UK) — closest model for AI + design consultancy | **Case-study cards titled by outcome** ("three days to 30 seconds"); a "current applied AI themes" section. Directly informs `WorkCard` result lines. |
| [maggieappleton.com](https://maggieappleton.com/) | Designer working on AI at GitHub Next | Content types with explicit maturity (essays vs notes); a *Now* page; design × AI without the site becoming a design portfolio. |
| [wattenberger.com](https://wattenberger.com/) | Research engineer, AI interfaces, strong design sense | Projects shown as short video previews; "Thinking about" section for AI + interface essays. |
| [geoffreylitt.com](https://www.geoffreylitt.com/) | HCI + AI-assisted programming | Projects grouped by theme, not chronology — the model for `track`. |
| [thesephist.com](https://thesephist.com/) (Linus Lee) | AI + interface research, text-first | Talks list and experience as plain text; proof that a restrained, text-led site reads as senior. |
| [emilkowal.ski](https://emilkowal.ski/) · [rauno.me](https://rauno.me/) | Design engineers (Linear, Vercel) | Typographic restraint, whitespace, small interaction details — the bar for polish without ornament. |
| [simonwillison.net](https://simonwillison.net/) | Most-read independent LLM practitioner blog | Content types (entries / notes / links) and heavy tagging — a model if the writing volume grows. |
| [takram.com](https://www.takram.com/) | Tokyo design × engineering × business firm; EN/JA/ZH | Trilingual switcher and mirrored URLs; project cards labelled by discipline. Tone reference for the JA tree. |
| [nownownow.com](https://nownownow.com/about) | The /now page convention | The cheapest way to keep the site current as focus shifts. |

Also worth a look for Maggie Appleton's curated list: [A Collection of Design Engineers](https://maggieappleton.com/design-engineers).

---

## 10. Open decisions for Jesse (Claude Code should ask, not guess)

1. **Permissions:** what may be named/shown for KOD, DEN and the capstone (drives `confidential`, client wording and diagrams).
2. **Languages line:** site/profile say *Chinese (native), English, Japanese, Korean*; the pivot doc says EN/JA/ZH. Confirm whether Korean (and French) belong on the site.
3. **Availability wording:** whether to mention visa sponsorship for Australia publicly (current copy: "Tokyo or Australia, from early 2027", no visa mention).
4. **Contact address** to publish, and whether CV PDFs go on the site or are sent on request.
5. **Gallery:** keep as a footer link, or archive entirely.
6. **Work URL policy:** canonical at `/work/[slug]` vs staying under `/writings` (§6 2.1).
