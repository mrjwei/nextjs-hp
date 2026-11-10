# jessewei.net: 3D and motion brush-up (Nov 2026)

*Prepared 10 Nov 2026 from a teardown of https://towers.app/ (the reference Jesse picked) and a read of this repo. Nothing here is implemented yet. Each phase below gets its own branch and PR, per `CLAUDE.md`.*

**Verdict: feasible.** The reference effects use stock web tech (three.js, CSS keyframes, pre-rendered images) that runs fine on Next 14 / React 18 / Vercel. Two things need settling first, and both belong to Jesse: the roadmap's restraint rule (D1) and the order relative to the performance plan (D2).

---

## 0. What towers.app actually does

From its HTML, CSS and JS bundles (fetched 10 Nov 2026):

| Where | Technique | Live 3D? |
|---|---|---|
| Home hero and closing CTA | Pre-rendered isometric 3D art (WebP), plus short MP4 loops (`office-desk.mp4`, `office-phone.mp4`) and a `site.webm` | No: rendered offline, shipped as image/video |
| Home background | Cloud WebPs drifting on long CSS keyframes (`end-sway` 42–50 s alternate, `end-cross` 140 s linear) | No: CSS `transform` only |
| Home "tools" row | Infinite CSS marquee (`roll`, 90 s linear) | No |
| Home UI | Frosted glass panels (`backdrop-filter: blur() saturate()`), small pop-in keyframes, Instrument Serif + Geist + Geist Mono | No |
| `/city` page | A real-time three.js scene (three@0.170 from jsDelivr): a tower where every floor is a company, navigable by wheel/touch/keys and a floor list. Uses `GLTFLoader`, `RoundedBoxGeometry`, `InstancedMesh`, `MeshStandardMaterial`/`MeshPhysicalMaterial`, `RoomEnvironment` + PMREM lighting, fog, shadows, `EffectComposer` with `UnrealBloomPass` + `OutputPass`, AgX/ACES tone mapping, damped (`lerp`/`damp`) camera, `Raycaster` picking, `prefers-reduced-motion` and `visibilitychange` handling, and an `aria-label` on the canvas | Yes |

The takeaway that shapes this plan: **towers keeps the landing page cheap** (images, video, CSS) **and puts the heavy WebGL on a separate page.** No GSAP, Lenis, R3F or Spline in its bundles. This site should copy that split, not its art. Its assets, layout and building metaphor are its own; we take the techniques only.

## 1. Constraints from this repo

- **Roadmap §1, design principle 4 (Restraint):** *"No dark mode, animation library, gradients, stock imagery, emoji, animated counters or employer logo walls."* This plan adds a 3D library and ambient motion, so the principle has to be amended first (D1). The plan below is written to keep the rest of its spirit: the near-monochrome cool-grey palette, one blue accent, Newsreader + Geist, no gradients for decoration, no gimmicks that don't point at the work.
- **Home performance is already the weakest page:** mobile Lighthouse 62, LCP 3.7 s, TBT 1,760 ms (`docs/plans/2026-11-01-performance-seo-traffic.md` §2). Its Phases 1 and 4 (GA4 `lazyOnload`, script-time profiling) haven't landed yet. A WebGL hero must not add to first paint or main-thread time; see the budget in §3.
- **Stack:** Next 14.2 (App Router), React 18.3, Tailwind 4 alpha, no animation library. `@react-three/fiber` v9 needs React 19, and the Next 15 / React 19 upgrade is out of scope (perf plan §7). Client components use the `*.client.tsx` naming.
- **Bilingual:** `components/views/home-view.tsx` is shared by `/` and `/ja`, so both get the same scene. Any visible or accessible text goes in `lib/i18n/dictionaries.ts`.
- **Positioning is data:** the projects shown come from `highlights.projects` in `lib/content/profile.ts`; the scene must read the same list, not hard-code it.

## 2. Concept: "the project stack"

An original take on the reference's "every floor is a company": **a quiet, monochrome stack of rounded slabs, one slab per highlighted project**, in the site's cool greys with the blue accent on one edge light. It says "these are the things I built" without words, and it's built from the same data as the Selected projects grid below it.

- **Idle:** the stack turns very slowly (one revolution in ~60 s) and floats a few pixels; soft studio lighting, faint contact shadow, light fog into the page background.
- **Pointer (desktop):** the camera eases a few degrees toward the cursor (damped, so it never snaps).
- **Scroll:** as the hero scrolls out, the camera dollies up and the slabs separate slightly ("exploded" view), driven by scroll progress, not time.
- **Hover/click (Phase 3, optional):** hovering a slab lifts it and lights its edge in the accent; the matching project card below highlights too, and vice versa. Clicking goes to the project page.
- **Everywhere else:** no 3D. Posts, About and project pages get only the light CSS motion from Phase 1.

Built procedurally (`RoundedBoxGeometry`, standard materials, `RoomEnvironment` lighting), so there are **no 3D model files to make or license** and Claude Code can build all of it. A GLB from Blender stays possible later (D4).

## 3. Technical approach

### Library choice

**Vanilla `three` (exact pinned version), loaded with a dynamic `import()` inside a client component.** No R3F, drei, GSAP or Lenis.

| Option | Verdict |
|---|---|
| Vanilla three.js, dynamic import | **Use.** Same as the reference; one lazy chunk (~150–170 kB gzipped with the addons used); no React-version coupling; easy to keep off the critical path. |
| `@react-three/fiber` v8 + drei | Works with React 18, but adds ~40 kB+ and a dependency that will force a major bump at the React 19 upgrade. Worth it only for a scene with lots of React-driven state; this one has little. |
| Spline embed | Fastest to author, but a heavy runtime (~500 kB+), less control over loading and accessibility, and the scene lives outside git. |
| Pre-rendered video only | Cheapest at runtime, but not interactive and needs an offline 3D tool. Used here as the **fallback poster** (a still), not the main experience. |
| GSAP / Lenis for scroll | Not needed: native `IntersectionObserver`, a rAF-throttled scroll listener and CSS scroll-driven animations cover it. Smooth-scroll hijacking also hurts INP and accessibility. |

Add `three` to `dependencies` and `@types/three` to `devDependencies`, both pinned to exact versions at implementation time (a release at least two weeks old). These are the only new packages in the whole plan.

### Loading strategy (progressive enhancement)

1. **Server render a static poster** in the hero's art slot: a WebP/AVIF still of the scene (`next/image`, explicit width/height, *not* `priority`, so the `<h1>` stays the LCP element). This is what mobile, reduced-motion, no-WebGL and no-JS visitors see, and what Lighthouse sees on first paint.
2. A small client gate (`hero-scene.client.tsx`) decides whether to upgrade. **Upgrade only when all hold:** `prefers-reduced-motion: no-preference`; `(pointer: fine)` and viewport ≥ 768 px; WebGL2 available; `navigator.connection?.saveData !== true`; `navigator.hardwareConcurrency >= 4` when reported.
3. If yes, wait for `load` plus `requestIdleCallback` (fallback `setTimeout` 1.5 s), and only while the hero is in view (`IntersectionObserver`). Then `import("./scene")`, which imports `three`.
4. Render the first frame to the canvas *under* the poster, then cross-fade (opacity, 400 ms). No layout shift: canvas and poster share one fixed-aspect box.
5. At runtime: pause the rAF loop when the hero leaves the viewport or the tab is hidden; cap DPR at `min(devicePixelRatio, 1.75)`; listen for `webglcontextlost` and fall back to the poster; `dispose()` geometry, materials, renderer and listeners on unmount (the App Router keeps layouts mounted across navigations).

### Budget (a PR that breaks one doesn't merge)

- No change to the Home `<h1>` LCP element; mobile Lighthouse Performance on `/` and `/ja` within 2 points of the run before the phase (mobile never loads three.js).
- Desktop: LCP unchanged ±100 ms; TBT increase ≤ 50 ms; CLS stays 0.
- The `three` chunk isn't in any route's First Load JS (`npm run build` output) and loads only on Home.
- Steady state ≥ 55 fps on a mid-range laptop (M1 / recent integrated GPU) in Chrome, Safari and Firefox; no dropped frames while scrolling the rest of the page.
- Poster ≤ 60 kB (AVIF/WebP, 2 widths).

### Accessibility

- The canvas is decorative in Phase 2: `aria-hidden="true"`, no focus. The project cards below are the accessible path to the same content.
- If Phase 3 makes slabs clickable, keyboard users still use the cards (which already link to the same places); the canvas stays out of the tab order and syncs highlight state from card focus as well as hover.
- `prefers-reduced-motion: reduce` → poster only. Phase 1's CSS motion opts in with `no-preference` (see Phase 1).
- The idle rotation runs for more than 5 s next to the hero copy, so WCAG 2.2.2 (Pause, Stop, Hide) applies: **add a small pause/play button in the hero art's corner**, labelled from the dictionaries, its state remembered in `localStorage` (wrapped in try/catch, default playing).

### File layout

```
components/home/hero-scene/
  hero-art.tsx              server: fixed-aspect box + poster <Image>, renders the client gate
  hero-scene.client.tsx     capability gate, lazy load, cross-fade, pause button, IO/visibility
  scene.ts                  plain TS, no React: createProjectStack(canvas, opts) →
                            { start, stop, setPointer, setScrollProgress, setHighlight, dispose }
  capabilities.ts           the upgrade checks from §3
  palette.ts                reads --gray-*/--blue-* from getComputedStyle so tokens stay the source of truth
public/home/
  project-stack-poster.avif / .webp   (+ a 2x width)
scripts/
  (none required; the poster is captured as described in Phase 2)
```

`scene.ts` takes the slab count and labels as plain data (from `highlights.projects` via `HomeView`), so the scene follows profile changes.

## 4. Phases

Ground rules for every phase: own branch, PR into `main`, squash-merge (`CLAUDE.md`). Gates: `npm run lint && npm run typecheck && npm run build` pass; check `/` and `/ja` in the browser at desktop and 375 px widths, and with reduced motion emulated; for Phases 2–3, run the Lighthouse set in perf plan §2 (mobile and desktop for `/`) before and after and append the numbers to `docs/baseline.md`.

### Phase 0: decisions and roadmap amendment (`docs/3d-motion-decisions`)

- [ ] Jesse answers D1–D5 (§5).
- [ ] Amend roadmap §1 principle 4 to the agreed wording (suggested: *"Restraint. Keep the tokens, type and single accent. Motion is quiet, purposeful and off for reduced-motion users; the only 3D is the Home project stack. No dark mode, gradients, stock imagery, emoji, animated counters or logo walls."*). Add this plan to the roadmap's "Related docs" line.
- **Done when:** the roadmap no longer contradicts this plan.

### Phase 1: motion foundations, CSS only (`feat/motion-foundations`)

No new dependencies. Gives the site most of the reference's "alive" feel at almost no cost, and is useful even if Phase 2 never ships.

- [ ] Motion tokens in `app/global.css` next to the existing `--dur-fast/base/slow` and `--ease-out/in-out` (~line 102): `--dur-reveal` (~600 ms), `--ease-emphasis` (a soft out-curve), `--reveal-distance` (12 px).
- [ ] **Section reveal:** Home sections (proof strip, Selected projects, How I work, Selected writing) fade/rise in once as they enter the viewport. Use CSS scroll-driven animations (`animation-timeline: view()`, inside `@supports`) so it costs no JS; browsers without support simply show content (no IO fallback that hides content before JS runs).
- [ ] **Card depth on hover:** project and post cards get a subtle 3D tilt toward the pointer (`perspective` + `rotateX/Y` ≤ 4°, a shadow that follows), via one small client hook used by `WorkCard`/`ArticleCard`. Only for `(hover: hover) and (pointer: fine)` and no reduced motion; nothing on touch.
- [ ] Wrap all of the above in `@media (prefers-reduced-motion: no-preference)`. The existing reduce rule in `app/global.css` (~line 550) shortens `animation-duration`, which scroll-driven animations ignore, so it won't neutralise them on its own.
- The header already has the frosted-glass treatment (`backdrop-blur-md` on `--surface-header`); leave it.
- [ ] Do **not** add the reference's marquee or drifting clouds: they're decoration without evidence, which principle 1 ("Proof before prose") rules out.
- **Done when:** gates pass; CLS stays 0; no content is invisible with JS disabled or in Firefox (no scroll-timeline support by default); reduced motion shows everything static.

### Phase 2: the Home project stack (`feat/hero-project-stack`)

Best started after perf plan Phases 1 and 4 have merged, so before/after numbers aren't confounded (D2).

- [ ] Add `three` and `@types/three` (exact versions).
- [ ] Rework the Home hero into a two-column layout on ≥ 1024 px (copy left, art right, about 55/45); below that, copy only, with the poster under the CTAs at reduced size or omitted (D3). Keep `max-w-[1120px]` and the existing spacing rhythm.
- [ ] `scene.ts`: renderer (antialias, `outputColorSpace` sRGB, AgX tone mapping), perspective camera, `RoomEnvironment` via PMREM, one shadow-casting directional light with a small shadow map, `RoundedBoxGeometry` slabs (one per project, slightly varied heights), a ground plane with a soft contact shadow, light fog matched to `--surface-page`. Materials from `palette.ts`: slabs `--gray-50`→`--gray-200` range, edges/accent light `--blue-500`. No post-processing in this phase; add `UnrealBloomPass` only if the accent edge looks flat and the budget allows.
- [ ] Motion: idle rotation and float (time-based, ~60 s per turn); pointer parallax (damped, ≤ 6°); scroll progress 0→1 across the hero drives camera height and slab separation. All damped with `THREE.MathUtils.damp` so frame rate doesn't change the feel.
- [ ] `hero-scene.client.tsx`: capability gate, deferred import, cross-fade, pause/play button, `IntersectionObserver` + `visibilitychange` pausing, context-loss fallback, full `dispose()` on unmount.
- [ ] **Poster:** add a `?poster` query handling in the client gate (dev only, `process.env.NODE_ENV !== "production"`) that freezes the scene at a fixed angle with a transparent background; capture it at 2x in the browser preview, convert with `sharp` (already a dev dependency) to AVIF and WebP at two widths into `public/home/`. Re-capture whenever the slab count changes (document this in the README).
- [ ] Dictionaries: pause/play labels, poster `alt` ("" since decorative) in EN and JA.
- **Done when:** the §3 budget holds; the scene runs in Chrome, Safari and Firefox on desktop; mobile and reduced-motion show the poster with no three.js request in the network panel; navigating Home → Posts → Home 10 times leaves no growing WebGL contexts or memory (check `renderer.info` and DevTools Memory).

### Phase 3 (optional): linked interaction (`feat/project-stack-interaction`)

- [ ] `Raycaster` hover: lift the slab 4–6 px and light its edge in the accent; show the project name in an HTML label positioned from the slab's projected screen position (HTML, not canvas text, so it uses the site's fonts and stays crisp).
- [ ] Two-way highlight with the Selected projects grid: hovering or focusing a card highlights its slab (a tiny shared store or a `CustomEvent` on `window`; no state library).
- [ ] Click a slab → project page (same href as the card, via `getProjectHref`); fire the existing `work_card_click` GA4 event with `source: "stack"`.
- **Done when:** gates and budget hold; keyboard and screen-reader paths are unchanged (cards); a touch device never gets hover-only affordances.

### Phase 4 (later, separate decision): a dedicated 3D page

The reference's `/city` idea, re-imagined: a `/projects` "stack view" toggle or a `/work-map` page where every project (not just highlights) is a slab, filterable by track, with a list fallback. Only worth doing if Phase 2–3 analytics show people interact with the hero stack (D5). Not planned in detail here.

## 5. Decisions for Jesse

| # | Question | Recommendation |
|---|---|---|
| D1 | Amend roadmap principle 4 to allow one 3D scene and quiet CSS motion? Without this, the plan stops at Phase 1 (which also needs the "no animation" part relaxed, though it adds no library). | Yes, with the wording in Phase 0, which keeps the rest of the restraint rule. |
| D2 | Do Phase 2 after perf plan Phases 1 and 4, or now? | After: Home is already at 62 on mobile, and mixing the two changes would hide what each did. Phase 1 here can go any time. |
| D3 | On mobile, show the static poster in the hero or nothing? | Poster at reduced size under the CTAs if it still reads well at 375 px; otherwise nothing. Decide visually in Phase 2. |
| D4 | Procedural slabs (no model files) or a custom Blender model (GLB, more character, needs authoring and Draco/KTX2 compression)? | Procedural first. Revisit a GLB only if the procedural stack looks too generic. |
| D5 | Is a dedicated 3D page (Phase 4) wanted at all? | Wait for data from Phase 2–3. |

## 6. Out of scope

- Copying towers.app's art, layout, building/floor copy or brand. Techniques only.
- Dark mode, gradients, marquees, drifting decorative layers, custom cursors, smooth-scroll hijacking, page-transition animations.
- R3F/drei, GSAP, Lenis, Spline, Framer Motion.
- The Next 15 / React 19 upgrade (perf plan §7). If it happens later, the vanilla three code needs no changes.
