---
title: 用 VitePress 搭建自己的极简博客
date: 2026-08-01
category: 技术
tags:
  - VitePress
  - 前端
description: 从零配置一个 VitePress 博客主题：栏目、文章数据加载与极简样式。
---

VitePress 不仅可以写文档，也很适合做个人博客。这篇文章记录这个主题的关键实现思路。

<!-- more -->

## 为什么选 VitePress

对比主流的博客方案，VitePress 的优势在于：

1. **原生支持 Vue 组件**，主题定制非常灵活
2. **构建期静态生成**，页面加载快，SEO 友好
3. **自带本地搜索、大纲、明暗切换**，省去大量重复工作

## 主题的结构

这个主题采用「沿用默认外壳 + 插槽增强」的思路，没有重写整套 Layout：

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
}
```

在 `Layout.vue` 里通过插槽注入文章元信息和阅读进度条：

```vue
<DefaultTheme.Layout>
  <template #doc-before><PostMeta /></template>
  <template #layout-top><ReadingProgress /></template>
</DefaultTheme.Layout>
```

## 文章数据加载

用 `createContentLoader` 扫描 `posts/` 目录，构建期生成全站文章索引：

```ts
import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/**/*.md', {
  excerpt: '<!-- more -->',
  transform(raw) {
    return raw
      .map(({ url, frontmatter, excerpt }) => ({
        url,
        title: frontmatter.title,
        date: String(frontmatter.date),
        category: frontmatter.category,
        excerpt,
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
```

分类、标签、归档页面都基于同一份数据分组渲染，一处更新，全站联动。

## 文章 frontmatter 约定

每篇文章在开头声明元信息，格式如下：

```yaml
---
title: 文章标题
date: 2026-08-01
category: 技术
tags: [VitePress, 前端]
description: 一段简短描述，会显示在首页卡片上
---
```

正文中用 `<!-- more -->` 标记摘要截断点。这样首页就能直接展示摘要，不需要单独维护。

## 小结

整个主题没有复杂的依赖，核心就是「数据加载 + 插槽 + 一组样式」。如果你也想搭建自己的博客，这套结构值得参考。
