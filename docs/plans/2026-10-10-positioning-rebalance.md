# jessewei.net — positioning rebalance plan (Oct 2026)

> **Implemented 10 Oct 2026** (P0–P3, P5, P6, and the in-repo part of P4). Decisions in §8 are answered below the table, and they override the draft copy where the two differ. Still open: the EN WAmazing case study, the JA essay translations, and the §7 content backlog (all vault work).

*Prepared 10 Oct 2026 for implementation by Claude Code inside `nextjs-hp`. Written from an audit of the live site (jessewei.net, 10 Oct), the repo (`app/content/profile.ts`, About MDX, content index: 94 entries), the vault's `Posts.base` queue, and the career notes in `Notes/Career/` (pivot doc, career profiles, Japan openings, DEN and GoNOW evidence docs).*

**This plan supersedes the positioning in `docs/roadmap.md` §1 (audience, one-line positioning, vocabulary) and the 23 Sep "AI repositioning brush-up".** The site architecture, content model and design principles in `docs/roadmap.md` stay. Only the story the site tells changes, plus a few small model and Home changes.

---

## 0. Read this first (for Claude Code)

- **One branch per phase** (`CLAUDE.md`). Suggested names are given per phase. Merge each into `main` once it's green.
- **Quality gates for every phase:** `npm run lint && npm run typecheck && npm run build` pass; Home and About checked at 360 px and 1120 px in EN and JA; no new dependencies.
- **Copy in §5 is a draft.** Show Jesse the EN/JA diff for `profile.ts` and the About MDX before merging Phases 1–2. Items marked **⚠ verify** must not ship until Jesse confirms them.
- **Don't invent facts.** Employment dates, team sizes and client names come from Jesse. Leave `{{TODO: …}}` markers and list them in the PR description.
- **Don't touch:** the design tokens and type, the Projects/Posts IA, the publish/update pipeline skills, Gallery as a footer link.
- **EN/JA parity rule:** both languages tell the same story with the same structure. JA may lean towards 業務DX, 要件定義 and 一気通貫; EN may lean towards product engineering and AI. Every section, proof item and pinned project exists in both, or the plan says why not.

---

## 1. Audit: what the site claims vs what the evidence supports

### 1.1 What a visitor sees today (live Home, 10 Oct)

| Section | Content | Problem |
|---|---|---|
| Hero | "Applied AI engineer · Japan & Australia" / "AI that gets used, not just demoed." | The title names a role Jesse hasn't held. The public AI evidence is about 4 months of client work (KOD, DEN, from Jun 2026), plus coursework and one personal product. |
| Proof strip | "LLM pipelines shipped for 2 client businesses" · "Eval harness · 146 labelled attacks" · "10 yrs product · 3+ yrs frontend leadership" · languages | Ten years of work is squeezed into one item. "Shipped" for DEN conflicts with the DEN evidence doc, which describes a pilot/prototype test (⚠ verify). |
| Selected projects | Strobe Assistant (CAB432 coursework) · Log types (capstone) · LingoBun · AuStride (2025 concept) | Three of four are coursework or concepts. No professional project is on Home: DEN, WAmazing, Zerospec, Money Forward, GoNOW and KOD are all missing. The WAmazing case study (200+ → ~4 inquiries/week) exists **only in Japanese**. |
| How I work | Scope with customer → Build the pipeline → Prove it with evals | Only describes an AI pipeline. The design, research and adoption work that the decade of experience proves is absent. |
| Posts (latest) | 2 of 4 cards are **"Coming soon" placeholders** (tool calling, Networking & VPC). The other two are Strobe/AWS coursework. | The first writing a visitor sees is unfinished or course notes. The strongest original thinking (design × AI essays, UX Collective piece) isn't visible. |

About (EN/JA) is aligned between languages and well written, but it also leads with "applied AI engineer". Its "Where I come from" section is the strongest material on the site, yet it sits below the fold, has no dates, and leaves out GoNOW.

### 1.2 Verdict

The 23 Sep repositioning fixed real problems (no more design-portfolio placeholders, illustration work moved off the nav, positioning stored as data). But it **overcorrected**:

1. **The headline claims more than the evidence supports.** Hiring managers check the title against the CV. "Applied AI engineer" with no AI-titled role and under a year of applied work reads as *aspirational*, or in Japanese agent terms *AI未経験*. That is exactly the filter the pivot doc warns about.
2. **It hides the scarce part of the profile.** Plenty of candidates have coursework-level LLM experience. Very few combine 10 years of B2B product design, 3+ years of frontend leadership, a decade of operating in Japan, three working languages, *and* real LLM client work. The current site turns that combination into one "differentiator sentence".
3. **It narrows the funnel in the market Jesse is targeting.** His own research (`japan-openings-2026-09.md`, `⭐️ai-engineering-pivot-2026Q4.md` §1.4) shows that Tokyo's realistic openings for this profile are **hybrid roles**: AI Experience Designer and FDE at BCG X; Future Technologist at PwC FDL; Technical Director at Hakuhodo; NEC UX/UI with design systems plus AI tooling; Hitachi Design Studio inside the AI & Software Services BU; AI Product Engineer. The pivot doc itself rates "AI Product Engineer / AI-focused Design Engineer" as **high fit, high odds**. Pure FDE/applied-AI roles are rated medium odds and often senior.

---

## 2. What the posts and projects reveal

### 2.1 Distribution of published work (EN originals, ≈60 posts, 2022–2026; approximate)

| Theme | ≈ Count | Period | Nature |
|---|---|---|---|
| Frontend / web dev (React, Next.js, testing, tooling) | 20 | 2022–2025 | Practitioner tutorials |
| UX and design thinking (radio buttons, password UIs, requirements → assumptions, design infrastructure, AI design guidelines, LingoBun UX cases) | 14 | 2024–2026 | **Original opinion and case studies**: the most distinctive writing |
| AI-powered tools and products he built (speaking tutor 2024, multifunctional assistant 2024, LingoBun, Strobe Assistant, vibe-coding reflection) | 10 | **2024**–2026 | Builder posts. The AI interest predates the Master's pivot. |
| Security, cryptography and CS fundamentals (passkeys, RSA/ECC, MCP security, capstone log types and correlation IDs) | 12 | 2025–2026 | Explainers plus capstone evaluation work |
| ML explainers (R², regularisation, ROC, CNN ×2, autoencoders, VAE) | 7 | 2025–2026 | Learning-level coursework notes |
| Cloud / AWS (Strobe migration, ALB, ECS) | 4 + placeholders | Oct 2026 | Coursework series |

The vault queue (`Posts.base`) continues the same mix: Strobe parts 4–6, VAE/ELBO, Transformers (attention, position encoding), plus *Building an AI-mediated pipeline for seamless blog publishing* (Ready, 13 Oct).

### 2.2 Patterns: what he keeps coming back to

1. **He builds tools that change how people work.** This runs from the 2024 speaking tutor and the Medium TOC generator to the GoNOW design-ops pipeline, the DEN system and this site's own publishing pipeline. It's systems for real users and operations, not model research.
2. **Human factors are the recurring lens.** Password UIs (security × UX), the AI guidelines audit (human–AI interaction), LingoBun's non-blocking AI validation, DEN's ◎/○/★ code/LLM/human gate, GoNOW's human review gate. The *Naked Plan* says it outright: "the center of both is HUMAN".
3. **He builds infrastructure, not one-off artefacts.** First design systems at Zerospec and GoNOW, "Designing infrastructure, not assets", "Stop writing requirements, start making assumptions", positioning-as-data on this site.
4. **He explains complex technology plainly, in two languages.** Number systems, JWTs, cryptography, ROC, VAEs, ALB/ECS, all published bilingually. That's the client-facing, 上流工程 skill.
5. **He gets outcomes in low-maturity, legacy contexts.** A paper-run welfare operator growing from 20 to ~100 staff (DEN, 8 years); legacy booking code in peak season (WAmazing, 200+ → ~4 inquiries a week); the first designer at Zerospec; a 0→1 design system and culture at GoNOW; a Japanese industrial manufacturer's 400-page manuals (KOD).

**Thin areas (state them honestly, don't hide them):** model-level ML (coursework only), production MLOps, and no AI-titled role. These argue against leading with "AI engineer". They don't argue against putting AI front and centre *as the newest capability*.

### 2.3 The through-line

> **He takes an organisation that runs on paper, spreadsheets or habit, works out with the people there what should change, then designs and builds the system, now increasingly AI-assisted, and stays until it's actually used.**

Digital transformation in legacy industries, design infrastructure in low-maturity teams, and human-in-the-loop AI are three expressions of that one capability, not three separate careers.

---

## 3. Career path decision

### 3.1 Lanes compared (Japan-first; Australia kept small, as in the pivot doc)

| Lane | Example roles / employers (from vault research; re-verify live) | Evidence fit | Odds (2–4 months) | Level | Role |
|---|---|---|---|---|---|
| **A. Hybrid product builder**: Design engineer / UX engineer / AI product engineer | NEC 4371 (design system + WCAG + AI tooling), Rakuten chief UX, Money Forward (boomerang), LY, Mercari, Sony, Woven, in-house DX units | ★★★ all five patterns | High | Senior IC | **Primary** |
| **B. Consulting / agency hybrid**: AI experience, technologist, technical director | BCG X AI Experience Designer (+ FDE), PwC FDL Future Technologist (+ Future Designer), Hakuhodo Technical Director (CX), Hitachi Design Studio, ABeam AI × service design, Ridgelinez | ★★★ DX + design + AI + bilingual | Medium–high | Senior / SC | **Primary** (watch workload) |
| **C. Applied AI / FDE (engineering-first)** | Salesforce Japan FDE, OpenAI / Anthropic Tokyo (stretch), cloud-vendor GenAI solutions, consultancy AIエンジニア | ★★ KOD, DEN, capstone | Medium (often senior, 5+ yrs engineering) | Mid–senior | **Stretch** |
| **D. Senior product designer / design systems lead** | HARMAN, DXC, Mitsubishi Heavy design centre, GovTech Tokyo | ★★ | Medium | Senior | Fallback |

### 3.2 Recommendation

**Position as a product designer and engineer who brings digital and AI into how a business actually works. Lead with lanes A and B, keep C as a stretch, and hold D in reserve.**

- **Why not "Applied AI engineer" as the headline:** the evidence doesn't hold it up yet. In Japan it is classified by years of experience in that 職種, which turns 10 years of seniority into junior/未経験. The pivot doc's own salary note says a senior hybrid in Tokyo earns about the same as a mid-level AI engineer, so leading with AI buys nothing.
- **Why not go back to "design leadership":** Jesse wants IC roles, the design-only market in Tokyo is thin (no foreign product-design openings found in Sept), and the AI work is real and growing.
- **Why the hybrid wins:** it is the only framing where *every* project counts as evidence. It also fits the role families that are actually hiring in Tokyo. And it keeps a clean path to the long-term AI + design consultancy (`/areas/fire-business-plan`): the same story, sold to SMEs later.
- **AI stays prominent:** as the *current edge* (the newest capability, with client work behind it) in the subhead, proof, projects and How I work. It just isn't the job title.

This is consistent with the pivot doc's own end-of-October checkpoint ("shift weight toward AI Product Engineer roles"), triggered early because the site and positioning are the bottleneck, not application volume.

### 3.3 Japan-specific implications

- **Legible 職種 label.** Agents and 書類選考 sort by 職種. Use 「プロダクトデザイナー／エンジニア」 with a clear secondary line (UX × フロントエンド × 生成AI). Don't use invented titles.
- **Years and dates matter.** Japanese readers expect 経歴 with periods. Add dates to About ("Where I come from" / 「これまでの経歴」).
- **上流工程 is a selling point.** Requirements negotiated in Japanese (KOD), an as-built 要件定義 (DEN) and 業務改善 should be explicit in JA copy.
- **Japanese-language case studies carry the most weight** for Lane B and the Japanese in-house roles. The DEN case study should be written **JA-first**.
- **Portfolio PDF.** PwC FDL and many 書類選考 need a submission pack. That's tracked in the vault, not in this repo.

---

## 4. Job-hunting strategy (summary; detail stays in the vault)

| | Plan |
|---|---|
| **Effort split** | A 40% · B 35% · C 15% · D 10% (Australia: ≤15 targeted applications total, per the pivot doc) |
| **One site, several CVs** | The site carries the umbrella story. Tailoring goes into the **CV / 職務経歴書 variants**: (1) デザインエンジニア／AIプロダクト版, (2) DX・生成AI実装 / FDE版. Same experience, different summary and skill order. |
| **Volume** | 5–6 tailored applications a week; 2–3 conversations a week (agents, カジュアル面談, referrals). Warm leads first: Money Forward ex-colleagues, KOD/DEN network. |
| **Channels** | Bilingual agents (JAC, Robert Walters, en world), BizReach, LinkedIn. Approach BCG X and PwC FDL through recruiters, since their postings were ambiguous in Sept. |
| **Timing** | Japan start Feb–Apr 2027 means applications from late Oct/Nov. The case studies in §7 gate the Lane B applications (PwC needs a portfolio). |
| **Signal to watch** | First-round rate per lane. Review at end of November: if Lane C converts better than A/B, shift emphasis by editing `profile.ts` (§6, P3 makes track order data). No redesign needed. |

---

## 5. New positioning (draft copy for `profile.ts` and About)

### 5.1 Core thesis (internal; it guides all copy and isn't necessarily shown verbatim)

- EN: *I turn how a business really works into software people keep using: product design and frontend engineering in one head, ten years of B2B, and now LLM features with a person at every decision that matters.*
- JA: *業務の実態から、使われ続けるソフトウェアをつくる。プロダクトデザインとフロントエンド開発を一人で担い、B2Bで10年。いまは要所に人の判断を残した生成AI機能を、実際の業務に実装している。*

### 5.2 Vocabulary

- **Use:** design and build / 一気通貫; digital transformation / 業務DX; requirements / 要件定義; human review gate / 人の確認; design system; adoption / 定着; evaluation / 評価; LLM features and pipelines; legacy / low-maturity.
- **Avoid:** "Applied AI engineer" as the title; "shipped to production" unless true; "design leadership" (reads as a manager role; say "built the design practice" or "set up design infrastructure"); "vibe coding"; "AI literacy"; 未経験.
- UK/AU spelling in EN.

### 5.3 `profile.ts` values (draft)

| Field | EN | JA |
|---|---|---|
| `role` | Product designer & engineer | プロダクトデザイナー／エンジニア |
| `eyebrow` | Product designer & engineer · Design × frontend × applied AI · Japan | プロダクトデザイナー／エンジニア・UX×フロントエンド×生成AI・日本 |
| `headline` (option A, recommended) | Turning how work really gets done into software people keep using. | 現場の仕事を、使われ続けるソフトウェアに。 |
| `headline` (option B) | Design and engineering for businesses changing how they work. | 変わろうとする現場に、デザインとエンジニアリングを。 |
| `subhead` | Ten years of B2B product design and 3+ years leading frontend. I've helped a paper-run welfare business onto digital workflows, cut a booking flow's peak-season inquiries from 200+ a week to about four, and built first design systems for teams that had none. Now I build LLM features into real operations, with a person at every decision that matters. | B2Bプロダクトデザイン10年、フロントエンド開発リード3年以上。紙で回っていた福祉事業のDX、繁忙期の問い合わせを週200件超から約4件に減らした予約フロー改善、デザインの土台がなかった組織での初のデザインシステム構築。いまは、要所に人の確認を組み込んだ生成AI機能を、実際の業務に実装しています。 |
| `meta.title` | Jesse Wei — Product designer & engineer for digital and AI transformation | Jesse Wei — 業務DX・生成AI実装を担うプロダクトデザイナー／エンジニア |
| `meta.description` | Product designer and frontend engineer with ten years in B2B, bringing digital and AI-assisted workflows into businesses that run on paper, spreadsheets and legacy code — from requirements to a system people adopt. Based in Japan; works in English, Japanese and Chinese. | B2Bプロダクトデザイン10年・フロントエンド開発リードの経験を持つプロダクトデザイナー／エンジニア。紙・スプレッドシート・レガシーシステムで回る業務に、デジタルと生成AIを組み込みます。要件定義から設計・開発・定着まで一貫して担当。拠点は日本、英語・日本語・中国語に対応。 |

**Proof strip (4 items, EN / JA)**

1. 10 yrs B2B product · 3+ yrs frontend lead / B2Bプロダクト10年・フロントエンドリード3年以上
2. Booking redesign: 200+ → ~4 inquiries/week / 予約フロー改善：問い合わせ 週200件超→約4件
3. Paper-run welfare operator → ~100 staff on digital workflows / 紙運用の福祉事業→約100名規模のデジタル運用へ
4. LLM systems for 2 client businesses, with human review gates ⚠ verify wording (built vs in production vs pilot) / クライアント2社に生成AIシステムを構築（人の確認を組み込んだ設計）

Languages move into the About intro and JSON-LD rather than taking a proof slot. Restore a fifth item only if `ProofStrip` lays out cleanly at 360 px.

**How I work (4 steps; `HowIWork` needs a 4th icon and a 2×2 / 4-up grid)**

| # | EN title / body | JA title / body | Icon |
|---|---|---|---|
| 1 | **Understand the operation.** Start from how the work is done today (on paper, in spreadsheets, in people's heads) and what the business actually needs to change. | **業務を理解する。** 紙・スプレッドシート・個人の頭の中にある「いまのやり方」と、事業として本当に変えるべき点から始めます。 | `Search` / `MessagesSquare` |
| 2 | **Decide who decides.** Design the system and its review points: what's deterministic code, what an LLM drafts, and what a person must sign off. | **判断の分担を設計する。** コードで決めること、AIに下書きさせること、人が必ず確認することを切り分けて設計します。 | `GitBranch` / `Workflow` |
| 3 | **Design and build it.** Interface and production frontend in one head, so trade-offs are made once instead of traded across a handoff. | **デザインし、つくる。** UIと本番のフロントエンドを一人で担うので、トレードオフを引き継ぎの中で失わずに判断できます。 | `PenTool` / `Code` |
| 4 | **Prove it and make it stick.** Tests, evaluation and field feedback until the team uses it every day, plus a design system so it stays consistent after I leave. | **検証し、定着させる。** テスト・評価・現場のフィードバックで毎日使われる状態まで仕上げ、デザインシステムで品質が続く仕組みを残します。 | `FlaskConical` |

**`rolesSought`**: EN `["Design engineer / UX engineer", "AI product engineer", "Technical director · AI & digital transformation", "Forward deployed / solutions engineer"]`; JA `["デザインエンジニア／UXエンジニア", "AIプロダクトエンジニア", "テクニカルディレクター（DX・生成AI）", "Forward Deployed Engineer"]`.

**`languages`**: ⚠ decision D2 (keep or drop Korean; French).

### 5.4 About page structure (both `app/pages-content/{en,ja}/about.mdx`)

1. **Intro (2 short paragraphs):** the thesis from §5.1 in first person; currently finishing the Master of IT at QUT; working languages.
2. **What I do: three capabilities, each with its proof** (new section, replacing the AI-first framing):
   - *Digital and AI transformation in legacy operations / レガシーな業務のDX・生成AI実装*: DEN, KOD.
   - *Product design and frontend engineering / プロダクトデザインとフロントエンド開発*: WAmazing, Money Forward, LingoBun.
   - *Design infrastructure in low-maturity teams / デザイン基盤づくり*: Zerospec, GoNOW (⚠ D4 naming).
3. **Where I come from / これまでの経歴:** keep the existing company paragraphs (they're strong) and add **periods** `{{TODO: YYYY–YYYY}}`, plus a GoNOW entry. Order: most recent first.
4. **What I'm building now / 現在取り組んでいること:** KOD, DEN, capstone, LingoBun. Keep it, but tighten the status words (⚠ verify "production" vs "pilot" for DEN).
5. **How I think / 考えていること** (new, 3–4 links): *Designing infrastructure, not assets*; *Stop writing requirements, start making assumptions*; *AI design guidelines audit*; *AI's productivity gains aren't evenly shared*. JA links only where a translation exists (see P4).
6. **What I'm looking for / 今後について:** senior IC roles where design, engineering and AI meet inside real operations (design/UX engineer, AI product engineer, technical director, forward-deployed). Tokyo, from early 2027; Australia if sponsorship is possible (⚠ D3 wording). Keep the existing contact line.

The `description` frontmatter mirrors `meta.description`.

---

## 6. Implementation phases (Claude Code)

### P0 — Commit the plan and quick hygiene · branch `chore/positioning-rebalance-p0`

- [ ] Commit this file (`docs/plans/2026-10-10-positioning-rebalance.md`) and the banner already added at the top of `docs/roadmap.md`.
- [ ] **Keep "Coming soon" placeholders off Home.** In `app/(en)/page.tsx` and `app/ja/page.tsx`, filter `!writing.metadata.placeholder` before `pickHighlights` for the Posts block. Also exclude placeholders from `app/rss/route.ts`. They stay visible on project and series pages, where the badge makes sense.
- **Acceptance:** Home shows no "Coming soon" cards in either language; the build passes.

### P1 — Positioning data · branch `content/positioning-rebalance-profile`

- [ ] Replace the EN/JA values in `app/content/profile.ts` with §5.3 (headline option per D1).
- [ ] `components/how-i-work.tsx`: support 4 items (icons array, `md:grid-cols-2 lg:grid-cols-4` or 2×2). Keep the stroke weight.
- [ ] Check what reads `role` and `meta`: `app/seo/person.ts` (`jobTitle`, `knowsLanguage` per D2), both layouts' metadata, `app/og/route.tsx`, `components/footer.tsx` newsletter copy (rewrite it if it says "applied AI"). Grep for leftovers: `rg -n "Applied AI|アプライドAI|applied AI" app components` should only hit post content.
- **Acceptance:** the grep is clean outside posts; screenshots of `/` and `/ja` before and after are attached to the PR for Jesse.

### P2 — About rewrite · branch `content/about-rebalance`

- [ ] Restructure both About MDX files per §5.4. Write EN first, then JA (not a literal translation: JA leans on 要件定義, 業務DX and 一気通貫; same sections, same order).
- [ ] Add `{{TODO}}` markers for dates and GoNOW naming. List them in the PR.
- **Acceptance:** EN and JA have identical section order; no unverified claims; renders with no MDX errors.

### P3 — Tracks and pins as data · branch `feat/tracks-rebalance`

- [ ] **Tracks.** Add `design-systems` (EN "Design systems & ops" / JA 「デザインシステム・デザインOps」) and `transformation` (EN "Digital transformation" / JA 「業務DX」) to `WorkTrack`, the zod enum in `app/utils/index.ts`, the parser in `scripts/generate-content-index.mjs`, and the labels in `components/work-track-filter.client.tsx`. Relabel `ai-engineering` as "AI systems" / 「AIシステム」 (keep the slug).
- [ ] **Track order from config.** Move `WORK_TRACK_ORDER` into `profile.ts` (e.g. `export const trackOrder: WorkTrack[]`) so the lane emphasis is one edit. Initial order: `transformation, ai-engineering, product-design, design-systems, security, research`.
- [ ] **Rename the WAmazing project ID** from `UIUX` to `WAmazing` in the post frontmatter (EN once it exists, and JA), plus a redirect `/projects/uiux` → `/projects/wamazing` (and `/ja/…`). Set `track: product-design`. Update the vault note's `project` property too, so the pipeline doesn't revert it.
- [ ] **Pins in `highlights`** (`profile.ts`):
  - `projects`: `["WAmazing", "LingoBun", "AI+Sec", "Strobe"]`. DEN and KOD go to the front when their case studies land. AuStride stays on `/projects` but isn't pinned.
  - `posts`: `["designing-infrastructure-not-assets", "from-requirements-to-assumptions", "ai-design-guidelines", "ai-productivity-gains-not-evenly-shared"]`. Pins missing in JA are skipped automatically; P4 closes that gap.
- [ ] Update `docs/publish.md` (track values, project IDs).
- **Acceptance:** `/projects` filter shows the new tracks in config order; Home shows WAmazing in EN as soon as the EN post exists (until then it shows in JA only, which is expected).

### P4 — EN/JA content parity · branch per post (via `/publish-pipeline`)

This is vault work that the pipeline deploys. Claude Code's part is the pipeline runs and frontmatter.

- [ ] **WAmazing case study in EN** (currently JA-only, `WAmazing/注文フォームUIUXの改善.md`): Jesse drafts or approves an EN version in the vault; publish it with `project: WAmazing`, `track: product-design`, `lead: true`.
- [ ] **JA translations of the design × AI essays:** `designing-infrastructure-not-assets`, `from-requirements-to-assumptions`, `ai-productivity-gains-not-evenly-shared` (set `requireTranslate` on the vault notes).
- [ ] Optional parity check: a tiny `scripts/check-parity.mjs` that prints any `highlights` pin missing in a language. It runs in `npm run build` as a warning only.

### P5 — Home polish · branch `feat/home-rebalance`

- [ ] Rename the Posts block to **"Selected writing" / 「主な記事」**: pins first, then the latest non-placeholder posts. The link "All posts" stays.
- [ ] Hero CTAs unchanged ("See selected projects" / "About me"). Optional third, low-emphasis link: "Email me" (`mailto` from `profile.social`).
- **Acceptance:** above the fold at 1120 px shows the hero plus the proof strip; nothing overflows at 360 px; EN and JA have identical section order.

### P6 — Docs · branch `docs/roadmap-positioning-sync`

- [ ] Fold §5.1–5.2 into `docs/roadmap.md` §1 (replace the "use verbatim" AI lines and the vocabulary list) and mark this plan as implemented. Update the §4 decisions with Jesse's answers to §8.

---

## 7. Content backlog, re-prioritised (vault; each becomes a pinned project)

1. **DEN, JA-first.** 「紙とスプレッドシートの福祉事業所に、人の確認を前提とした生成AIを入れる」: 業務DX + 要件定義 + ◎/○/★ gate + eval results. It's the anchor of the new positioning because it shows all three capabilities at once. Needs 加納社長's written permission. Track: `transformation`.
2. **WAmazing EN** (P4). Track: `product-design`.
3. **Design infrastructure in a low-maturity team** (GoNOW or Zerospec). Teaser: *"Eleven versions of one yellow badge"* (outline ready in `gonow-case-evidence-and-post-outlines-2026-09.md`). Track: `design-systems`. Needs a naming decision (D4).
4. **KOD (anonymised).** LLM document checking for a manufacturer, requirements in Japanese. Track: `ai-engineering`. Needs KOD's OK.
5. **Capstone evals.** "Most detection gaps were logging gaps", 75.0% → 97.9% scoring inflation. Track: `security` / `research`. Needs the supervisor's OK.

Keep publishing the coursework explainers (Strobe, VAE, Transformers). They show learning velocity, but they're no longer pinned or featured.

---

## 8. Open decisions (Claude Code: ask Jesse, don't guess)

| # | Decision | Recommendation |
|---|---|---|
| D1 | Headline: option A or B (§5.3), or Jesse's own | A |
| D2 | Languages on the site: Korean? French? | List only the languages he'd work in on day one |
| D3 | Availability line: mention Australia sponsorship? | Keep it neutral: "Tokyo, from early 2027; open to Australia" |
| D4 | Can GoNOW (and Zerospec, DEN, KOD) be named? | Name the company where permitted; otherwise use "a Tokyo IoT startup" style |
| D5 | DEN and KOD status words: "in production", "pilot" or "built for"? | Use the most conservative true wording |
| D6 | Employment dates for About | Required for the JA audience |

**Answers (Jesse, 10 Oct):** D1: *Changing how people work, through design and AI.* / *デザインとAIで、人の働き方を変える。* (Jesse's own). D2: keep Korean; no French. D3: Tokyo only. D4: DEN, KOD and Zerospec may be named; **GoNOW is Zerospec's product, not a company**. D5: DEN pilot, KOD built. D6: no dates on About. Also: the WAmazing project ID stays `UIUX` (no rename or redirect) because the case study is written not to identify the organisation.

---

## 9. Outside this repo (for consistency, not for Claude Code)

- `Notes/Career/Job hunting/career-profile-{en,ja}.md`: replace "AI engineering positioning (primary)" with the hybrid lanes in §3; keep the AI evidence list.
- LinkedIn headline, e.g. *Product designer & engineer · Digital & AI transformation · Design × frontend × LLM · EN/日本語/中文*.
- CV / 職務経歴書: two variants per §4.
- The `⭐️ai-engineering-pivot-2026Q4.md` 90-day plan still applies for Lane C work (coding practice, LLM system-design prep); only its positioning section is superseded.
