---
title: vitepress搭建博客并使用workflow自动部署到github pages上
date: 2026-07-29 17:24:28
tags: 
---

# vitepress搭建博客

# 前置准备

- [Node.js](https://nodejs.org/) 22 及以上版本
- 通过命令行界面 (CLI) 访问 VitePress 的终端
- 支持 [Markdown](https://en.wikipedia.org/wiki/Markdown) 语法的编辑器

# 创建项目

新建并进入目录执行

```bash
pnpm add -D vitepress@next
pnpm vitepress init
```

```bash
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./
│
◇  Where should VitePress look for your markdown files?
│  ./
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
◇  Add a prefix for VitePress npm scripts?
│  Yes
│
◇  Prefix for VitePress npm scripts:
│  blog
│
└  Done! Now run pnpm run blog:dev and start writing.
```

# 添加Git版本控制



# 使用workflow部署到github pages上

## 创建workflow文件夹及其CI/CD流程文件

```yaml
# .github/workflows/deploy.yaml
name: Deploy

on:
  push:
    branches: [main, master]
  workflow_dispatch: # 允许手动触发

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - uses: pnpm/action-setup@v6
        name: Install pnpm
        with:
          version: 11
          cache: true
      - name: Install and Build
        run: pnpm install && pnpm docs:build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: docs/.vitepress/dist

```

