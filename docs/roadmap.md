# jessewei.net — roadmap

> **10 Oct 2026:** the positioning in §1 (audience, one-line positioning, vocabulary) is superseded by `docs/plans/2026-10-10-positioning-rebalance.md` — hybrid product designer & engineer, with AI as the current edge rather than the title. Implement that plan's phases; §2 onwards still applies.

*This is the canonical plan for this repo. It replaces `docs/roadmap/2026-09-ai-repositioning-brushup.md` (23 Sep 2026) and `docs/roadmap/month-1-evidence-and-spine.md` (14 Sep 2026). Last updated 2 Oct 2026.*

Positioning source of truth (Notes vault): `Career/Job hunting/⭐️ai-engineering-pivot-2026Q4.md` and `career-profile-{en,ja}.md`. The design-first framing of the Q4 portfolio roadmap (`⭐️portfolio-roadmap-2026Q4.md`) is superseded for this site.

Related docs: `docs/publish.md` (content model, frontmatter, publishing), `docs/baseline.md` (Lighthouse/build checks), `docs/templates/case-study.mdx` (case-study skeleton).

---

## 1. Positioning

**Audience, in priority order**

1. Hiring managers and recruiters for **Forward Deployed Engineer / AI Solutions Engineer / Applied AI (生成AI) Engineer** roles, mostly in Tokyo and some in Australia. They spend 30–90 seconds on the site to answer one question: *has this person shipped LLM systems for real users, and can they prove the quality?*
2. Japanese hiring managers reading `/ja`. Same question, plus evidence of 上流工程 and Japanese-language delivery.
3. Later, behind a feature flag (§5): Japanese SME owners looking for AI + design help.

**One-line positioning** (use these verbatim; don't paraphrase them in new places)

- EN: *Applied AI engineer who ships LLM systems into real business workflows — from messy Japanese documents to evaluated, production-ready pipelines — with a decade of product experience that makes those systems usable and adopted.*
- JA: *生成AI/LLMシステムを実際の業務に実装するアプライドAIエンジニア。日本語の複雑な文書処理から、評価設計を伴う本番運用可能なパイプライン構築まで一貫して担当。10年のプロダクト経験を活かし、「使われるAI」を作る。*

**Vocabulary**

- Use: LLM pipelines, evaluation, ground truth, retrieval, orchestration, guardrails, human-in-the-loop, cost/latency, deployed for a client, production.
- Avoid in new copy: "design leadership", "design culture", "vibe coding", "AI literacy", "未経験". Design gets a **differentiator sentence**, never the headline.
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
- **Home**: hero (from `profile.ts`) → proof strip (static) → selected projects (one card per project) → How I work (static) → posts. Both lists show `highlights` pins first, then the latest.
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

Until items 1–3 are live, Home's "Selected projects" shows LingoBun, AI+Sec (the two security-pipeline posts) and the AI-guidelines audit. That is the current state.

1. [ ] **Capstone evals**: "Most detection gaps were logging gaps", plus the scoring rule that inflated accuracy (75.0% → 97.9%). Can be published once the supervisor approves. Reuse the IFN738 visual pack.
2. [ ] **DEN**: letting an LLM write regulatory records, and deciding where it isn't allowed to. ◎/○/★ → code / LLM / human; eval harness results. Needs 加納社長's written permission for naming and screenshots (seed data only).
3. [ ] **KOD**: LLM document checking (anonymised). Architecture diagram, text-vs-vector warning-symbol extraction, rule engine, Japanese requirements. Needs KOD's OK on what can be named.
4. [x] **LingoBun** reframed as AI product hardening (`featured: 1`).
5. [ ] **WAmazing** (design track): its outcome number is the strongest (200+/week → ~4), but it shouldn't be featured above the AI work. Placeholder now lives outside the repo.
6. [ ] **GoNOW design-ops**: "Eleven versions of one yellow badge" post and the case study. Both carried over from the Month-1 plan. Lower priority than 1–3 under the AI positioning.
7. [ ] Translate every case study pinned in `highlights` (via `/publish-pipeline`: set `requireTranslate` on its vault note).

### Tracked elsewhere (no work in this repo)

- Case-study drafting: Notes vault.
- Studio verification layer, token pipeline and a11y gate: `design_workflows/studio` repo.
- LinkedIn overhaul.

---

## 4. Decisions

**Open** (Claude Code should ask Jesse, not guess):

1. **Permissions**: what may be named or shown for KOD, DEN and the capstone. This drives `confidential`, the client wording and the diagrams.
2. **Languages**: the proof strip says EN · 日本語 · 中文, but `person.ts` `knowsLanguage` also lists Korean. Confirm whether Korean (and French) belong on the site.
3. **CV**: publish the PDFs on the site, or send them on request?
4. **Availability statement**: removed with `/now`. If it comes back, decide whether to mention visa sponsorship for Australia.

**Resolved**

- Contact: `mailto:jesseweijapan@gmail.com`, in the footer and About.
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
