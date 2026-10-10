# jessewei.net — roadmap

> **10 Oct 2026:** §1 now carries the hybrid positioning from `docs/plans/2026-10-10-positioning-rebalance.md` (implemented 10 Oct): product designer & engineer, with AI as the current edge rather than the title. That plan holds the audit, the lane analysis and the job-hunting strategy behind it.

*This is the canonical plan for this repo. It replaces `docs/roadmap/2026-09-ai-repositioning-brushup.md` (23 Sep 2026) and `docs/roadmap/month-1-evidence-and-spine.md` (14 Sep 2026). Last updated 10 Oct 2026.*

Positioning source of truth: §1 below, from `docs/plans/2026-10-10-positioning-rebalance.md`. It supersedes the positioning section of the vault's `Career/Job hunting/⭐️ai-engineering-pivot-2026Q4.md` (its 90-day plan still applies to Lane C prep) and the design-first framing of `⭐️portfolio-roadmap-2026Q4.md`.

Related docs: `docs/publish.md` (content model, frontmatter, publishing), `docs/baseline.md` (Lighthouse/build checks), `docs/templates/case-study.mdx` (case-study skeleton).

---

## 1. Positioning

**Audience, in priority order** (Tokyo first)

1. Hiring managers and recruiters for **hybrid product-builder roles**: design engineer / UX engineer / AI product engineer at in-house product and DX teams (Lane A), and AI experience / technologist / technical director roles at consultancies and agencies (Lane B). Their question: *can this person turn how a business works into software people adopt, and is the AI work real?*
2. Japanese hiring managers and agents reading `/ja`. Same question, plus a legible 職種, 上流工程 (要件定義) and Japanese-language delivery.
3. Applied AI / FDE roles (Lane C) as a stretch; senior product designer / design systems roles (Lane D) in reserve.
4. Later, behind a feature flag (§5): Japanese SME owners looking for AI + design help.

To shift lane emphasis, edit `profile.ts` (copy, `highlights`, `trackOrder`); no redesign needed.

**Core thesis** (guides all copy; not necessarily shown verbatim)

- EN: *I turn how a business really works into software people keep using: product design and frontend engineering in one head, ten years of B2B, and now LLM features with a person at every decision that matters.*
- JA: *業務の実態から、使われ続けるソフトウェアをつくる。プロダクトデザインとフロントエンド開発を一人で担い、B2Bで10年。いまは要所に人の判断を残した生成AI機能を、実際の業務に実装している。*

Role label: **Product designer & engineer** / **プロダクトデザイナー／エンジニア**. Headline: *Changing how people work, through design and AI.* / *デザインとAIで、人の働き方を変える。*

**Vocabulary**

- Use: design and build / 一気通貫; digital transformation / 業務DX; requirements / 要件定義; human review gate / 人の確認; design system; adoption / 定着; evaluation / 評価; LLM features and pipelines; legacy / low-maturity.
- Avoid: "Applied AI engineer" as the title; "shipped to production" unless true (DEN's AI records system is a **pilot**; KOD's system was **built for** the client); "design leadership" (say "built the design practice" or "set up design infrastructure"); "vibe coding"; "AI literacy"; 未経験.
- GoNOW is Zerospec's product, not a company: never list it as an employer.
- Use UK/AU spelling in English.

**Design principles**

1. **Proof before prose.** Every section answers "how do I know?" with a number, a diagram, a repo or an eval result. No adjectives without evidence.
2. **Outcome-first case studies.** Put the result on the first screen, then: constraint → system → evaluation → what I chose not to do → craft.
3. **Positioning is data, not markup.** Role, headline, proof, socials, feature flags and Home `highlights` live in `app/content/profile.ts`. To change direction, edit that file (including what's pinned in `highlights`); don't rewrite pages.
4. **Restraint.** Keep the existing tokens, type (Newsreader + Geist, Noto Sans JP on `/ja`) and the single accent. No dark mode, animation library, gradients, stock imagery, emoji, animated counters or employer logo walls.
5. **Bilingual parity by construction.** Long prose lives in per-language MDX so the `publish-pipeline` skill's translate stage can keep EN and JA in sync.

**Quality gates for every change:** `npm run lint && npm run typecheck && npm run build` pass; mobile Lighthouse per `docs/baseline.md`; no new dependencies unless the task needs them; one branch per task (see `CLAUDE.md`).

---

## 2. Current site (as built, 2 Oct 2026)

```
EN                                   JA
/                    Home            /ja
/projects            Projects        /ja/projects
/projects/[project]  Project page    /ja/projects/[project]
/projects/[project]/[slug]  Post in project  /ja/projects/[project]/[slug]   (canonical: /posts)
/posts               Posts           /ja/posts             記事
/posts/[...]         Post            /ja/posts/[...]
/about               About           /ja/about
```

- **Header**: Posts · Projects · About (logo = Home), search, LinkedIn, GitHub. Active state uses prefix matching. Email is in the footer.
- **Home**: hero (from `profile.ts`, with a quiet Email me link) → proof strip (static) → selected projects (one card per project) → How I work (4 steps, static) → Selected writing. Both lists show `highlights` pins first, then the latest; `scripts/check-parity.mjs` warns at build time about pins missing in a language.
- **Tracks** (`/projects` filter): transformation, ai-engineering (labelled "AI systems"), product-design, design-systems, security, research. Order comes from `trackOrder` in `profile.ts`.
- **Projects** are a *view* over posts: any post with a `project` ID. `/posts` URLs are always canonical. `/writings/*`, `/work/*` and `/portfolio/*` 301 to the new paths. Full rules are in `docs/publish.md`.
- **Content knobs**: `project`, `lead`, `track`, `draft`, `placeholder`, `archived`, plus the case-study fields (`role`, `client`, `industry`, `duration`, `stack`, `status`, `confidential`). They're validated in both `app/utils/index.ts` (zod) and `scripts/generate-content-index.mjs`.
- **Drafts** live in the Obsidian vault, outside the repo. Publish with `/publish-pipeline`.

### Where the 23 Sep plan landed

| Phase | Plan | Status |
|---|---|---|
| 0 Stabilise | Commit restructure, canonical host `jessewei.net`, `/portfolio` redirects, baseline doc | ✅ Done (`886fd55`). Lighthouse baseline not recorded. |
| 1 Positioning as data | `profile.ts`, wire into home/layouts/header/footer/OG, About prose → MDX | ✅ Done (`f654cb7`) |
| 2 IA & navigation | `/work`, nav, `/now`, contact, CV links | ✅ Done (`10c7fea`), then revised: Work/Writing → **Projects/Posts** (`e0dcec0`), one card per project + project pages (`746a437`). `/now` and the availability chip were **removed** (`40ab71c`). CV links built but off (`features.cv = false`, no PDFs yet). |
| 3 Case-study system | Frontmatter, `ResultBlock`, `WorkCard`, template, re-tag, track filter, new tags | ✅ Done (`6fcf0f5`). The placeholder case studies were moved out of the repo instead of being kept as `draft: true`. |
| 4 Home redesign | Hero, proof strip, selected work, How I work, featured writing, Now band | ✅ Done (`eaf147a`). Proof strip and How I work are static (no links, `7b99368`). The Now band was removed. |
| 5 Japanese quality | Noto Sans JP, `:lang(ja)` rules, OG CJK font, translate featured | ✅ Done (`e44b52a`). The OG route fetches the font from Google Fonts instead of committing it. |
| 6 Trust & SEO | Person/ProfilePage/Article JSON-LD, GA4 events | ✅ Done (`9a78461`) |
| 7 Advisory module (dark) | `services.ts`, `/ja/services`, About advisory block | ⬜ Not started. Only the `features.advisory = false` flag exists. |

---

## 3. Open work

### Code

- [ ] **`<Figure>` MDX component** for architecture diagrams: `<Figure src alt caption />` on a light background, optional zoom-on-click with no library, registered in `components/mdx.tsx`. The case-study template's *System* section depends on it.
- [ ] **CV PDFs**: add `public/cv/jesse-wei-cv-en.pdf` and `public/cv/jesse-wei-shokumukeirekisho-ja.pdf`, then set `features.cv = true`. Blocked on the files.
- [ ] **Lighthouse baseline**: record mobile scores for `/`, `/about`, `/posts`, `/projects`, `/ja` per `docs/baseline.md`. Target LCP ≤ 2.5 s on throttled mobile.
- [ ] **JSON-LD after graduation**: switch QUT from `affiliation` to `alumniOf` in `app/seo/person.ts`.
- [ ] **Phase 7 advisory module** (optional, ships dark; see §5).

### Content (each becomes a project)

Pinned now: projects UIUX (the WAmazing booking-form case study, JA only), LingoBun, AI+Sec, Strobe; posts are the four design × AI essays. DEN and KOD go to the front of `highlights.projects` when their case studies land.

1. [ ] **DEN, JA-first**: 「紙とスプレッドシートの福祉事業所に、人の確認を前提とした生成AIを入れる」 — 業務DX + 要件定義 + ◎/○/★ gate + eval results; describe the AI system as a pilot. Needs 加納社長's written permission for screenshots (seed data only). Track: `transformation`.
2. [ ] **WAmazing case study in EN** (the JA post is project `UIUX`, `track: product-design`, `lead: true`). Jesse drafts or approves the EN version in the vault; publish with the same `project: "UIUX"`. The project ID stays `UIUX` because the case study is written not to identify the organisation.
3. [ ] **Design infrastructure at Zerospec (GoNOW product)**: "Eleven versions of one yellow badge" teaser plus the case study. Track: `design-systems`.
4. [ ] **KOD**: LLM document checking for a manufacturer, requirements in Japanese. KOD may be named. Track: `ai-engineering`.
5. [ ] **Capstone evals**: "Most detection gaps were logging gaps", plus the scoring rule that inflated accuracy (75.0% → 97.9%). Needs the supervisor's OK. Track: `security` / `research`.
6. [x] **LingoBun** reframed as AI product hardening.
7. [ ] **JA translations of the pinned essays**: `ai-productivity-gains-not-evenly-shared` has `requireTranslate: true` on its vault note (run `/publish-pipeline`). `designing-infrastructure-not-assets` and `from-requirements-to-assumptions` have no vault note yet, so one must be created before the pipeline can translate them.

Keep publishing the coursework explainers (Strobe, VAE, Transformers); they show learning velocity but aren't pinned.

### Tracked elsewhere (no work in this repo)

- Case-study drafting: Notes vault.
- Studio verification layer, token pipeline and a11y gate: `design_workflows/studio` repo.
- LinkedIn overhaul.

---

## 4. Decisions

**Open** (Claude Code should ask Jesse, not guess):

1. **Capstone permissions**: what may be shown from the capstone (needs the supervisor's OK).
2. **CV**: publish the PDFs on the site, or send them on request?

**Resolved**

- Positioning (10 Oct): hybrid product designer & engineer; headline *Changing how people work, through design and AI.*
- Naming: DEN, KOD and Zerospec may be named; GoNOW is Zerospec's product. The WAmazing case study keeps project ID `UIUX` (it doesn't identify the organisation).
- Status words: DEN's AI records system is a pilot; KOD's was built for the client.
- Languages: Chinese (native), English, Japanese, Korean (no French).
- Availability: Tokyo only, from early 2027. No employment dates on About.
- Contact: `mailto:jesseweijapan@gmail.com`, in the footer, About and the Home hero.
- Gallery and Instagram: removed (2026-10).
- URL policy: `/posts/...` is canonical, and `/projects` is a view over it (replacing the planned `/work/[slug]`).
- `/now` page and availability chip: dropped.

---

## 5. AI + design consultancy

**Verdict: design the site so a consultancy can be added later, but don't publish offers yet.**

- The FDE/applied-AI story and an AI + design consultancy are the same story: putting AI into how a real business works, with the people and the workflow designed in. Every case study built for the job search (KOD, DEN, capstone evals) also proves the consultancy case.
- A visible services or pricing page during a job search tells FDE hiring managers you may not stay. It also competes for the 15–20 hours a week the pivot plan needs. Consultancy pages wait until the job search resolves: an offer is accepted, or the November checkpoint says to change course.
- Live now: one sentence at the end of About ("always glad to talk with teams bringing AI into Japanese businesses") and the proof itself.

**Phase 7, built behind `features.advisory = false`** (supersedes the "design infrastructure" framing in `Career/Business/jessewei-net-Consultancy-Adaptation-Plan-2026-09.md`):

- `app/data/services.ts` with this ladder:
  - **AI活用診断**: 2-week readiness audit of where AI can and can't be trusted in the client's workflows.
  - **業務AI実装スプリント**: 6–10 weeks. One workflow redesigned, plus an LLM pipeline with a human review gate, evals and staff training.
  - **運用・評価レビュー**: quarterly eval re-runs, prompt/model updates and the next workflow.
  - **AI顧問**: monthly, max two clients.
  - Keep the SME-assessment price ranges as placeholders. Don't render prices until Jesse confirms them.
- `/ja/services` and an EN About "Advisory" block, both gated by the flag and kept out of the sitemap and nav while it's off.
- Reusable hero copy for when the flag flips: 「デザインとAIの「仕組み」を、御社の中に残す。」

---

## 6. Benchmarks

| Site | Borrow |
|---|---|
| [Parlance Labs](https://parlance-labs.com/) | Three-step value framing (diagnose → method → ship); proof through numbers. Model for the advisory page. |
| [hamel.dev](https://hamel.dev/) | Blog as a dense dated table; services woven in rather than a separate brochure. |
| [jxnl.co/services](https://jxnl.co/services/) | Plain statement of what is and isn't taken on. |
| [eugeneyan.com](https://eugeneyan.com/) | One-sentence mission; "Start here"; prototypes shown as evidence. |
| [huyenchip.com](https://huyenchip.com/) | Leads with the job to be done, then credentials. |
| [Normally](https://www.normally.com/) | Case-study cards titled by outcome; a "current applied AI themes" section. |
| [maggieappleton.com](https://maggieappleton.com/) | Content types with explicit maturity; design × AI without turning into a design portfolio. |
| [wattenberger.com](https://wattenberger.com/) | Short video previews of projects; a "thinking about" section. |
| [geoffreylitt.com](https://www.geoffreylitt.com/) | Projects grouped by theme, not date (the model for `track`). |
| [thesephist.com](https://thesephist.com/) | A restrained, text-led site still reads as senior. |
| [emilkowal.ski](https://emilkowal.ski/) · [rauno.me](https://rauno.me/) | The bar for polish without ornament. |
| [simonwillison.net](https://simonwillison.net/) | Content types and heavy tagging, if writing volume grows. |
| [takram.com](https://www.takram.com/) | Mirrored multilingual URLs; tone reference for `/ja`. |
