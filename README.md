# VitePress Minimal Blog Theme

![Preview](./.github/assets/preview.png)

[简体中文](./README.zh-CN.md) | English

A minimal, content-first blog theme/template for [VitePress](https://vitepress.dev). Pure white canvas, generous whitespace, restrained accent color — built for writers who want the text to breathe.

> This repository is a **template repository**: clone or fork it, drop your posts into `posts/`, tweak a few config values, and you have a blog. No npm install of a separate theme package required.

## Features

- 📝 **Markdown-first writing** — frontmatter for `title`, `date`, `category`, `tags`, `description`; `<!-- more -->` splits the excerpt shown on cards.
- 🏠 **Five built-in pages** — Home (recent posts), Category, Archives, Tags, About.
- 🎨 **Minimal visual language** — no sidebar noise, single reading column, top reading-progress bar, lightweight meta line (`date · category · tags`) above each post title.
- 🔍 **Local search** out of the box (VitePress built-in).
- 🧭 **Prev/next pager** by date at the bottom of every post.
- 🛠 **`pnpm new:post` CLI** — interactive or non-interactive scaffolding for new posts, with Chinese-friendly slug generation.
- 📄 **Typed data loader** — `posts.data.ts` exposes typed `Post[]` for all components.
- ⚡ **VitePress + Vue 3 + TypeScript** — modern, fast, extensible.

## Tech Stack

| Layer       | Choice              |
| ----------- | ------------------- |
| SSG         | VitePress ^1.6      |
| UI          | Vue 3.5 (SFC)       |
| Language    | TypeScript          |
| Package Mgr | pnpm 11 (corepack) |

## Quick Start

```bash
# 1. Clone (or use GitHub's "Use this template")
git clone https://github.com/<you>/theme-dev.git my-blog
cd my-blog

# 2. Install deps
pnpm install

# 3. Start dev server
pnpm dev
```

Open http://localhost:5173 and start editing.

## Project Structure

```
theme-dev/
├── .vitepress/
│   ├── config.mts            # Site config (title, nav, search…)
│   └── theme/
│       ├── components/        # Blog pages & widgets
│       ├── Layout.vue         # Layout glue (slots into DefaultTheme.Layout)
│       ├── posts.data.ts      # Typed content loader
│       ├── style.css          # Global styles & design tokens
│       ├── utils.ts           # slugify / formatDate helpers
│       └── index.ts           # Theme entry
├── pages/                     # Non-post routes (about, archives, category, tags, home)
├── posts/                     # Your blog posts (Markdown)
├── public/                    # Static assets (favicon…)
├── scripts/
│   ├── templates/post.md      # Default body for `new:post`
│   └── new-post.mjs           # Post scaffolding CLI
└── package.json
```

## Writing a Post

### Interactive

```bash
pnpm new:post
# Prompts: title, category, tags, description
```

### Non-interactive

```bash
pnpm new:post "My Post Title" \
  --category Tech \
  --tags "Vue,CSS" \
  --description "A short summary" \
  --slug my-post \
  --date 2026-08-19
```

The generated file lands in `posts/<slug>.md`. Frontmatter shape:

```yaml
---
title: My Post Title
date: 2026-08-19
category: Tech
tags:
  - Vue
  - CSS
description: A short summary
---
```

Insert `<!-- more -->` in the body — everything above becomes the card excerpt on Home / Category / Tags pages.

## Configuration

All site-level config lives in [.vitepress/config.mts](./.vitepress/config.mts). Edit the two constants at the top:

```ts
const siteTitle = 'Your Site Title'
const siteDescription = 'Your site description'
```

The nav, footer copyright, and outline label are in `themeConfig` below. Replace them as needed. See the [VitePress config reference](https://vitepress.dev/reference/site-config) for the full API.

## Scripts

| Script             | Action                                  |
| ------------------ | --------------------------------------- |
| `pnpm dev`         | Start dev server with HMR               |
| `pnpm build`       | Build static site to `.vitepress/dist` |
| `pnpm preview`     | Preview the built site locally         |
| `pnpm new:post`    | Scaffold a new post (interactive or CLI) |

## Deployment

VitePress outputs static files to `.vitepress/dist`. Push the repo and connect any of:

- **GitHub Pages** — see [VitePress deployment guide](https://vitepress.dev/guide/deploy#github-pages)
- **Netlify** / **Vercel** / **Cloudflare Pages** — set build command `pnpm build`, output dir `.vitepress/dist`

## Contributing

Issues and PRs are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

[MIT](./LICENSE) © Lorlike
