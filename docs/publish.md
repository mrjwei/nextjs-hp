# Publishing workflow (Obsidian -> MDX -> git push)

This repo stores writings in `app/writings/posts/`. A “series” is a subfolder inside that directory.

## Quick start

### Publish from a specific file

```bash
npm run publish "My Post Title" -- --file /absolute/path/to/My Post Title.md
```

### Publish by searching an Obsidian vault

```bash
export OBSIDIAN_VAULT=/absolute/path/to/YourVault
npm run publish "My Post Title"
```

### Publish into a series folder

```bash
npm run publish "My Post Title" -- --series LingoBun --file /absolute/path/to/My Post Title.md
```

## Images (Obsidian assets -> public/<slug>/)

If your Obsidian uses an assets folder (e.g. embeds like `![[image.png]]` stored under `/path/to/vault/assets`), set one of:

```bash
export OBSIDIAN_ASSETS=/absolute/path/to/vault/assets
```

or pass it explicitly:

```bash
npm run publish "My Post Title" -- --assets /absolute/path/to/vault/assets --file /absolute/path/to/My Post Title.md
```

The script copies any referenced `/<slug>/<file>` images into `public/<slug>/`.

## Table of contents

The script auto-generates (or replaces) a TOC block after frontmatter, similar to the output you get from the VS Code “Markdown All in One” extension.

Disable it with:

```bash
npm run publish "My Post Title" -- --no-toc --file /absolute/path/to/My Post Title.md
```

## AI transform (optional)

If `OPENAI_API_KEY` is set, the script will attempt an AI Markdown->MDX transform. Otherwise it falls back to a safe basic conversion.

```bash
export OPENAI_API_KEY=...
# optional
export OPENAI_MODEL=gpt-4o-mini
export OPENAI_BASE_URL=https://api.openai.com/v1
```

## Options

- `--no-ai`: skip AI even if API key is set
- `--dry-run`: print the plan only
- `--no-commit`: write the file but skip git commit/push
- `--no-push`: commit locally but skip git push
- `--resume`: if output exists, update TOC/assets and run git steps
- `--overwrite`: overwrite output file if it exists

## Obsidian syntax handled

- Wiki links: `[[Page]]` or `[[Page|Label]]` -> plain text
- Embeds: `![[image.png]]` -> `![](/<slug>/image.png)`

If you use embeds, put the referenced images under `public/<slug>/`.
