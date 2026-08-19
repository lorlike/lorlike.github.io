# Contributing

Thanks for your interest in improving this project! This guide covers the basics.

[简体中文](#简体中文) | [English](#english)

---

## English

### Reporting Issues

- Search existing issues before opening a new one.
- Use the issue templates (Bug Report / Feature Request).
- Include the VitePress / Node / pnpm version and a minimal reproduction (a repo link or a few lines of Markdown).

### Development Setup

```bash
git clone https://github.com/<you>/theme-dev.git
cd theme-dev
pnpm install
pnpm dev
```

Recommended Node version: 18+ (VitePress requirement).

### Pull Requests

1. Fork & create a branch from `main`:

   ```bash
   git checkout -b feat/my-feature
   ```

2. Keep the change focused — one concern per PR.
3. Code style:
   - 2-space indentation, no tabs.
   - Use TypeScript for `.ts` / `.vue` files in `.vitepress/theme/`.
   - Keep comments concise — Chinese is fine for in-theme comments; English is preferred for anything user-facing in README / docs.
4. Verify before pushing:

   ```bash
   pnpm build
   ```

   The build must succeed with no errors.

5. Open a PR against `main` and fill in the template.

### Commit Messages

Conventional Commits style:

```
<type>: <subject>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`, `ci`.

Examples:
- `feat: add RSS feed generator`
- `fix: correct tag count on tags page`
- `docs: clarify frontmatter usage in README`

### Scope

This project intentionally stays **minimal**. Before proposing large features (auth, comments, CMS integration…), please open a discussion issue first to align on whether it belongs in core.

---

## 简体中文

### 报告问题

- 先搜索现有 Issue，避免重复。
- 使用 Issue 模板（Bug 报告 / Feature 请求）。
- 附上 VitePress / Node / pnpm 版本与最小复现（仓库链接或几行 Markdown）。

### 本地开发

```bash
git clone https://github.com/<you>/theme-dev.git
cd theme-dev
pnpm install
pnpm dev
```

推荐 Node 版本：18+（VitePress 要求）。

### 提交 Pull Request

1. Fork 后从 `main` 拉新分支：

   ```bash
   git checkout -b feat/my-feature
   ```

2. 改动保持聚焦 —— 一个 PR 只解决一件事。
3. 代码风格：
   - 2 空格缩进，禁用 tab。
   - `.vitepress/theme/` 下的 `.ts` / `.vue` 文件使用 TypeScript。
   - 注释简洁 —— 主题内部代码用中文注释可以；README / 文档等面向用户的内容优先英文。
4. 推送前自检：

   ```bash
   pnpm build
   ```

   构建必须无错误通过。

5. 向 `main` 提 PR 并按模板填写。

### Commit 信息

遵循 Conventional Commits：

```
<type>: <subject>

[可选正文]
```

类型：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`chore`、`ci`。

示例：
- `feat: 新增 RSS 生成器`
- `fix: 修正标签页文章计数`
- `docs: README 中补充 frontmatter 说明`

### 范围

本项目刻意保持**极简**。在提交大型功能（鉴权、评论、CMS 接入…）之前，请先开一个讨论型 Issue 对齐是否应该进入核心。
