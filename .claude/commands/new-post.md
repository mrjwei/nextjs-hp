# New Post from Obsidian

Convert an Obsidian markdown file into a published MDX post on this site.

**Usage:** `/new-post <obsidian-file-path>`

The argument `$ARGUMENTS` is the absolute path to the Obsidian `.md` file.

## Steps

### 1. Read the source file

Read the Obsidian file at `$ARGUMENTS` in full, including all content and any embedded image references (Obsidian syntax: `![[image.png]]` or standard `![alt](path)`).

### 2. Determine the slug and category

- Derive a **slug** from the file name: lowercase, spaces replaced with hyphens, special characters removed. Example: `"My Article On React.md"` → `my-article-on-react`.
- Infer the **category subfolder** from the article's topic/tags. Match against the existing subfolders used in `app/writings/posts/`:
  - `security/` — cryptography, auth, MCP, security topics
  - `design/` — UX/UI design, process, case studies
  - `devops/` — deployment, CI/CD, infrastructure
  - `ml/` — machine learning, data science, numpy/pandas
  - `number-systems/` — binary, number theory
  - `LingoBun/` — LingoBun product posts
  - `AI/` — broad AI topics (not dev-specific)
  - *(root)* — general dev, React, JavaScript, CSS, tools, tutorials that don't fit a specific category
- If no existing category fits well, place it at the root level.

### 3. Handle images and assets

- Scan the Obsidian source for all image references. Obsidian uses `![[filename.ext]]` as well as standard `![alt](path)` syntax.
- For each referenced image, look for the file in the Obsidian vault. The vault root can be inferred from the path of the source file (typically 2–3 levels up). Also check common Obsidian attachment folders: `attachments/`, `assets/`, `_attachments/`, or the same directory as the note.
- Create the destination folder: `public/<slug>/` (e.g., `public/my-article-on-react/`).
- Copy each image file into `public/<slug>/`.
- In the MDX output, replace Obsidian image syntax with:

```mdx
<figure style={{ textAlign: "center" }}>
  <img
    src="/<slug>/filename.ext"
    alt="alt text or caption"
    style={{ marginBottom: "8px" }}
  />
  <figcaption>Caption if available</figcaption>
</figure>
```

If no caption is present in the source, omit the `<figcaption>` tag.

### 4. Generate the MDX frontmatter

Produce a frontmatter block following this exact schema (match what existing posts use):

```mdx
---
title: "..."
slug: "..."          # only include if the post is in a subfolder
publishedAt: "YYYY-MM-DD"   # today's date
summary: "..."       # 1–2 sentence summary of the article
tags: ["tag1", "tag2"]      # infer from content; use existing tag vocabulary where possible
---
```

- **title**: use the Obsidian file's H1 heading if present, otherwise derive from the filename.
- **slug**: include this field only when the post lives in a subfolder (matches existing conventions).
- **publishedAt**: use today's date.
- **summary**: write a concise 1–2 sentence summary that captures the main point.
- **tags**: infer relevant tags from content. Common tags used on this site: `dev`, `ai`, `design`, `security`, `tutorial`, `casestudy`, `process`, `reflection`, `devops`, `datascience`, `git`, `vibecoding`, `lingobun`, `react`, `javascript`, `css`, `ux`, `ml`.

### 5. Assess and improve the content quality

Before converting, read the article critically and apply the following improvements. The goal is a polished, accurate, publish-ready post — not a literal transcription of the source.

**5a. Detect the state of the article**

Classify the article into one or more of these states and handle each accordingly:

- **Draft / unfinished outline**: signs include bullet-point skeletons, placeholder text (e.g. "TODO", "flesh this out", "add example here"), incomplete sentences, or sections that exist only as headings. → Flesh out the content: expand bullet points into full prose paragraphs, complete unfinished thoughts, write out any missing examples or explanations implied by the outline. Fill gaps in a way that is consistent with the author's voice and the surrounding content.

- **Messy / needs refinement**: signs include rambling paragraphs, repetition, poor structure, abrupt transitions, or informal language inconsistent with a published article. → Tighten the prose: cut repetition, improve sentence flow, ensure transitions between sections are smooth, and align the tone with the existing posts on this site (clear, direct, first-person where appropriate, no unnecessary filler).

- **Incorrect or inaccurate content**: signs include factual errors you can identify (wrong API names, outdated behavior, incorrect technical descriptions, broken logic in explanations). → Correct the errors. If you are confident the information is wrong, fix it and note the correction in your final report. If you are uncertain, flag it in the report rather than silently changing it.

These states are not mutually exclusive — an article can be all three. Apply all relevant improvements.

**5b. Preserve the author's intent and voice**

- Do not change the article's thesis, conclusions, or opinions — only improve clarity and correctness.
- Preserve personal anecdotes, first-person perspective, and the author's examples unless they are factually wrong.
- Do not add new opinions or conclusions the author did not express.
- Do not pad the article with generic filler just to increase length.

### 6. Convert the body content

Transform the (now improved) Obsidian markdown body into MDX, following the style of existing posts:

- **Table of contents**: If the article has multiple H2 sections (after fleshing out), generate a TOC as a bulleted list of anchor links immediately after the frontmatter, before the first paragraph. Use the format already used in existing posts:
  ```
  - [Section Title](#section-title)
  ```
  Anchor IDs are the heading text lowercased with spaces replaced by hyphens.

- **Headings**: convert `#` H1 (if it's just the title) to nothing; `##` H2 and below are kept as-is.
- **Bold / italic / code**: preserve as standard markdown — MDX supports it natively.
- **Code blocks**: preserve fenced code blocks with their language tags.
- **Links**: convert Obsidian `[[wikilinks]]` to plain text (or a relative MDX link if the target is clearly another post on this site). External markdown links `[text](url)` are kept as-is.
- **Callouts / admonitions**: Obsidian callouts (`> [!NOTE]`) have no direct MDX equivalent — convert them to a plain blockquote or a bold lead-in sentence, whichever preserves the meaning better.
- **Horizontal rules**: keep as `---` if they appear in the body (not the frontmatter delimiter).
- **Paragraph spacing**: match existing posts — no extra blank lines between paragraphs beyond the standard one.

### 7. Write the output file

Write the final MDX to:
- `app/writings/posts/<category>/<slug>.mdx` if a category was chosen
- `app/writings/posts/<slug>.mdx` if placed at root

### 8. Report back

After writing, print:
- The output MDX file path
- The public assets folder path (if any images were copied)
- **Content changes made**: summarize what was improved — e.g. "expanded 3 outline sections into prose", "fixed incorrect event name `checkout.session.completed` → `invoice.payment_succeeded`", "tightened introduction paragraph"
- **Flagged uncertainties**: any factual claims you were unsure about and left unchanged for review
- A list of any images that were referenced in the source but could not be found on disk
- Any Obsidian-specific syntax that couldn't be automatically converted
