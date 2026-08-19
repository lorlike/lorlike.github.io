---
title: 几个实用的小 CSS 技巧
date: 2026-05-28
category: 技术
tags:
  - CSS
  - 前端
description: 工作中积累的几个 CSS 小技巧，简洁实用，随手可用。
---

整理几个工作中经常用到的 CSS 技巧，都不复杂，但很实用。

<!-- more -->

## 两行文字截断

单行截断大家都熟悉，两行截断需要配合 `-webkit-box`：

```css
.text-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

这个博客首页的文章摘要就是用它实现的。

## 平滑滚动到锚点

页面内锚点跳转想加上平滑效果，一行代码即可：

```css
html {
  scroll-behavior: smooth;
}
```

配合 `scroll-margin-top`，可以避免跳转后内容被固定导航遮挡：

```css
.section {
  scroll-margin-top: 88px;
}
```

## 表格数字对齐

日期、数量这类数字，用 `tabular-nums` 可以让它们按等宽对齐，翻页时不会抖动：

```css
.price,
.date {
  font-variant-numeric: tabular-nums;
}
```

## 细分割线

比 `border: 1px solid #eee` 更柔和的做法，是用一像素半透明分割线，深浅模式都能自适应：

```css
.divider {
  border-bottom: 1px solid var(--vp-c-divider);
}
```

## 小结

好的 CSS 往往很小，但能明显提升体验。以后攒够了再更新一篇。
