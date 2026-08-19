<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import PostMeta from './components/PostMeta.vue'
import PostPager from './components/PostPager.vue'
import ReadingProgress from './components/ReadingProgress.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <!-- 文章页：标题上方显示 日期 · 分类 · 标签 元信息 + 标题 -->
    <template #doc-before><PostMeta /></template>
    <!-- 文章页：正文下方按日期显示 上一篇 / 下一篇 -->
    <template #doc-after><PostPager /></template>
    <!-- 文章页：页面顶部细阅读进度条 -->
    <template #layout-top><ReadingProgress /></template>
  </DefaultTheme.Layout>
</template>
