---
name: "finalise-post-draft"
description: "Finalise Jesse's blog post drafts in the Stage lane of Posts.base: proofread, fact-check, flesh out in his voice, add SVG diagrams, then set status to Ready."
---

# Finalise post draft

Jesse writes blog posts as notes in his Obsidian vault and tracks them on a kanban board, `Posts.base`, grouped by the `status` frontmatter property: **Drafting → Stage → Review → Ready → Updated → Published**. When he moves a note into **Stage**, he wants it finished: proofread, fact-checked, filled out where it's incomplete, given diagrams where they help, and set to **Ready**.

This skill covers the *writing* phase. A separate skill, `publish-pipeline`, picks up Ready notes and publishes them. It only proofreads lightly, and it stops on unfinished drafts. So anything this skill leaves half done gets stuck there, and anything it gets wrong goes out under Jesse's name. **When `run-board` (this plugin's scheduled run) calls this skill, `publish-pipeline` stages every note you set Ready in the same run, with no one reviewing it in between. A note whose `scheduledAt` is today, in the past or empty goes live straight away.** Only set Ready when you'd be comfortable with that.

## Where things are

- Vault: `/Users/jessewei/projects/Notes`. In a Cowork session with the folder connected, it's `$HOME/mnt/Notes` in the device shell. Work on the files in place on Jesse's Mac; don't copy them elsewhere to edit them.
- Board: `Notes/Posts.base`. Drafts live anywhere in the vault (e.g. `CAB432/Assignment 3/`, `ML & AI/Transformers/`), not in a single folder.
- The vault is a git repo. Don't commit. Jesse reviews your changes with `git diff` and commits himself.
- Template frontmatter (`Templates/Post.md`):
  ```yaml
  status:
    - Drafting
  scheduledAt:
  requireTranslate: true
  note:
  ```
  `publish-pipeline` writes other properties (`sitePath`, `publishedAt`, `lang`, `translation`, …). Leave them alone.

## Which drafts to process

- **Paths given:** process those notes, whatever their status, but say so if a note isn't in Stage.
- **No paths:** process every note in the Stage lane: the `finalise` lines of
  ```bash
  bash ${CLAUDE_SKILL_DIR}/../publish-pipeline/queue.sh | awk -F'\t' '$1 == "finalise" { print $3 }'
  ```
  (paths relative to the vault; it reads frontmatter only, handles list and scalar `status`, and skips `Templates/`). Plain `grep` finds nothing in the vault (its `.gitignore` is `*`), so don't search it any other way.
- **Nothing in Stage:** say so and stop.
- **Skip translation notes** (filename ending ` (JA)`, or a note that is the translated copy of another). Translation review belongs to `publish-pipeline`. If a draft is *originally* written in Japanese or another language, finalise it in that language using the same process.

**Unattended runs** (a scheduled task or `run-board`, with nobody to answer): wherever this skill says to ask Jesse, leave that note in Stage and put the question in the report instead.

Handle drafts one at a time. Finish one completely, status change included, before starting the next, so an interruption never leaves a half-edited note marked Ready.

## The process for each draft

### 1. Read everything first

Read the whole note, frontmatter included. Then read the `note` property:

- **Writing instructions** (e.g. "tighten the draft, focus on the most important concepts", "use a more engaging title if you can") are extra instructions for this run. They take priority over the defaults in this skill, because they're Jesse's call on this specific post. "Publish it as it is" means proofreading and fact-checking only, with no restructuring.
- **Context** (e.g. `series: Transformers`, `project: Strobe`, a bare number such as `3`, which is usually a part number in a series) tells you what the post belongs to. Use it: read the other posts in the series so terminology and back-references stay consistent.
- **Publishing instructions** (e.g. "add placeholder pages for referenced pages that do not exist yet", anything about the site, scheduling or translation) belong to `publish-pipeline`. Don't act on them.
- **Leave `note` exactly as it is.** `publish-pipeline` reads it too.

### 2. Calibrate to Jesse's voice

Before you change a word, read one or two of Jesse's **Published English** posts. Prefer posts from the same folder or series, otherwise any recent one. Find them with `command grep -rl -- '- Published' --include='*.md' .` in the vault (plain `grep` honours the vault's `.gitignore` and finds nothing) and skip `(JA)` files. Pay attention to how he opens, how long his paragraphs are, and how he moves between sections. The aim is that a reader can't tell which sentences he wrote and which you wrote. The section "Jesse's voice" below has the patterns to look for.

### 3. Diagnose the draft

Decide which of these it is, because it sets how much you're allowed to change:

| State | Signs | What to do |
|---|---|---|
| **Nearly done** | Full prose, clear structure | Line edits only: language, consistency, facts. Leave his sentences alone unless they're wrong or unclear. |
| **Half done** | Some prose, some bullets, sections that are only headings, notes to self, a missing intro or conclusion | Fill the gaps and smooth the joins. Keep his finished sections close to as written. |
| **Outline** | Mostly bullets, questions to self, raw notes, an `Update:` bolted on at the end | Write the post from his points: turn bullets into prose, put them in an order a reader can follow, and add an intro and a close. |
| **Can't be finished** | The point depends on something only Jesse has: results he hasn't recorded, a decision he hasn't made, an experience he hasn't described | Do the parts you can, but **leave status as Stage** and say exactly what's missing. |

Then check the **length** (see "Length" below). If the draft is, or would become, too long *because it covers several separate topics*, don't finalise it. Work out a split instead: proposed titles, which sections go to which post, and how each new post would open and close. Report the split, leave the draft and its status untouched, and move on. If it's long but on a single topic, tighten it.

### 4. Fact-check

Go through the draft and list every checkable claim: numbers, dates, names, quotes and who said them, book and paper details, how an API, service or tool behaves, product features and pricing, and limits and defaults. AI tooling, cloud services and anything else that changes quickly need the most care. A feature Jesse described months ago may have been renamed, moved or removed.

- Verify each claim against a primary source (official docs, the paper, the publisher), using web search or fetch. Use Jesse's linked sources first if the draft has them.
- **Wrong:** fix it with the smallest edit that makes it right. If the correction changes his argument, say so in the report.
- **Can't verify and it matters:** soften the wording ("as far as I could find…") or flag it in the report. Never invent a citation, statistic or quote.
- **Questions he asked himself** in the draft (e.g. "Are there established solutions I don't know?"): research them and answer them in the post if that helps the reader. Answering his own open question is often what turns notes into a post.
- If his post relies on sources, add inline links to them or a short `## References` section, matching what his published posts already do.

Don't fact-check his opinions, experiences or design judgements. Those are his to make.

### 5. Edit

**Language.** Grammar, spelling, typos and punctuation. Use UK/Australian spelling (organisation, optimise, judgement, colour). Product and service names should use their official form and capitalisation (Claude Code, DynamoDB, Next.js).

**Coherence.** Each section should follow from the one before it. The intro should promise what the post actually delivers, and the ending should close the loop the intro opened. Cut or merge sections that repeat each other. Move a section if the post reads better that way, but only when the gain is clear.

**Consistency.** Use one term per concept throughout (don't switch between "function" and "Lambda" for the same thing unless the distinction matters). Keep these consistent too: heading style (sentence case `##`, like his published posts), list punctuation, code formatting for identifiers and commands, tense, and the spelling variant. In a series, use the same terms as the earlier parts.

**Fleshing out** (half done and outline drafts):
- Build from *his* points, examples and opinions. Expand and connect them; don't swap them for your own.
- Never invent first-person experience: things he did, felt, saw at work, results he got. If the post needs a personal beat that isn't in the notes, write around it, or leave the draft in Stage and ask (see the "Can't be finished" row).
- When newer information contradicts older notes (e.g. an `Update:` saying a tool now does what the post was working around), the post should tell that story honestly. Don't present the older view as current.
- Remove notes to self, `TODO`s, hedges like "(or called space?)", and raw links that don't serve the reader.
- Keep a list where a list is the right form (steps, definitions, comparisons). Turn bullets into prose where they're really an argument.

**Leave alone:** Obsidian syntax (`[[wikilinks]]`, `![[embeds]]`, callouts, the tag line such as `#aws #qut` under the frontmatter), images he embedded, code blocks unless they're wrong, and the filename. Renaming breaks links and the pipeline depends on note names. If the title has a typo or could be better (or `note` asks for a better one), suggest it in the report and let Jesse rename.

**Minimum change** means: every edit should fix a real problem or fill a real gap. "I'd have phrased it differently" isn't a reason to edit. When a sentence of his is fine, leave it.

### 6. Visuals

Add a diagram when it explains something prose struggles with: an architecture, a flow or sequence, a before/after, states and transitions, or a comparison of a few options across a few dimensions. Don't add decorative images, and don't add a diagram that just repeats a paragraph. Most posts need zero to three. Check what's already embedded first, and don't duplicate it.

- **Style:** if the `professional-visuals` skill is available, follow its house style (a PNG saved alongside the SVG is fine, but embed the SVG). Otherwise match Jesse's existing SVGs (e.g. those in `CAB432/Assignment 3/assets/`): a light slate background (`#F8FAFC`), white cards with `#CBD5E1` borders, slate text (`#0F172A` titles, `#475569` body), a system sans-serif font stack, a title inside the SVG that states the takeaway in a sentence with a one-line subtitle under it, and green/red/blue only where colour carries meaning (OK / problem / flow).
- **Format:** a self-contained SVG with a `viewBox`, no external fonts or images, and text that fits its boxes. Check it's valid with `xmllint --noout file.svg`. If you can render it (rsvg-convert, cairosvg, a headless browser), look at the render and fix any overlap or clipping.
- **Where:** in the `assets/` folder next to the draft, `<draft's folder>/assets/`. Create the folder if it doesn't exist. Use a descriptive kebab-case filename (`lambda-default-vs-vpc-attached.svg`), and never overwrite an existing file with the same name.
- **Embed** it where it's first relevant, with alt text and an italic caption on the next line, the way his published posts do:
  ```markdown
  ![[assets/lambda-default-vs-vpc-attached.svg|Lambda outside the VPC reaching public AWS APIs, versus attached to the VPC reaching the cache]]
  *Attaching a Lambda to the VPC changes where all of its traffic goes.*
  ```

### 7. Final check, then set Ready

Re-read the whole post from top to bottom as a reader would. Then check:

- No leftover bullets-as-notes, `TODO`s, placeholders, or headings with nothing under them
- Every factual claim was checked, or is flagged in your report
- Every embed points to a file that exists
- Every instruction in `note` was followed (or, if it was a publishing instruction, deliberately left for `publish-pipeline`)
- The length is in range

If all of that holds, change **only** `status` to Ready and keep the YAML list form:

```yaml
status:
  - Ready
```

Edit just that line with a small read-modify-write. Don't rewrite the frontmatter, and don't touch any other property.

## Jesse's voice

His published posts read like a thoughtful practitioner explaining something to a peer. Typical patterns:

- **Opens on something concrete:** a situation, a problem he hit, or a "here's what happened". Then a few sentences on what the post covers. He sometimes gives "the short version" up front.
- **First person, plain and direct.** Short sentences mixed with longer ones. The occasional fragment for rhythm ("Four steps. Simple on paper, but…"). A rhetorical question now and then, not one in every section.
- **Bold lead-in sentences** that open paragraphs in explanatory sections, followed by the explanation.
- **Joins clauses with colons, semicolons and commas.** Em dashes appear in his titles but rarely in body text, so don't add them to the body.
- **Honest about what didn't work** and about trade-offs. He names the constraint ("in our shared AWS account") rather than generalising.
- **Ends by tying back to the opening idea** with a takeaway, often under a heading like "Wrapping up" or a phrase from the post. No generic summary list.
- **Technical posts** define terms as they come up, use real names and values, and put identifiers in code formatting.

Phrasing that would sound unlike him (and like generated text): "delve", "landscape", "realm", "crucial", "robust", "seamless", "leverage", "game-changer", "in today's fast-paced world", "it's worth noting that", "let's dive in", "in conclusion", a triplet of adjectives or clauses in every other sentence, "not just X, but Y" used repeatedly, a summarising moral at the end of every paragraph, emoji, and bold scattered mid-sentence. Read your added paragraphs back next to his. If they're smoother, more generic or more enthusiastic than his, rough them up to match.

## Length

Reader-attention research and common blogging practice put the sweet spot for an in-depth post at roughly a 5–10 minute read (Medium's own data peaked around 7 minutes, about 1,600 words). Jesse's published posts mostly sit between 700 and 1,800 words. Use these as working ranges, not hard rules:

- Focused explainer or opinion piece: **~700–1,500 words**
- In-depth technical or case-study post: **~1,200–2,200 words**
- **Over ~2,500 words:** tighten if it's one topic. If it covers several separate topics, propose a split (see step 3).

Count body words only, excluding frontmatter and code blocks (e.g. `wc -w` after stripping them). Fleshing out an outline should land in these ranges. Don't pad to reach them; a complete 800-word post is fine.

## Report

When you finish, give Jesse a short report per draft. Anything you wrote will be published under his name, so make what you added easy for him to check:

- **Outcome:** set to Ready / left in Stage (and why) / split proposed
- **State found:** nearly done / half done / outline, with word count before → after
- **Fact-check:** claims corrected (old → new, with source), claims you couldn't verify, and questions you answered
- **Added content:** which sections or paragraphs are new or substantially rewritten, so he can read those first
- **Other notable edits:** restructures, cuts and consistency fixes (skip trivial typo fixes)
- **Visuals:** files created and where they're embedded
- **`note`:** which instructions were applied and which were left for `publish-pipeline`
- **Suggestions:** title ideas, a split plan, anything he should decide

End with a reminder that `git diff` in the vault shows every change.