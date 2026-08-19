<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { formatDate, slugify } from '../utils'

const { frontmatter } = useData()

const fm = computed(() => frontmatter.value as Record<string, any>)
// 有 title 的文章页 / about 等页面渲染标题；有 date 的文章页额外渲染元信息行
const showTitle = computed(() => Boolean(fm.value.title))
const isPost = computed(() => Boolean(fm.value.date))
const tags = computed<string[]>(() => (Array.isArray(fm.value.tags) ? fm.value.tags : []))
</script>

<template>
  <div v-if="showTitle" class="post-header" :class="{ 'is-about': !isPost }">
    <div v-if="isPost" class="post-meta">
      <time class="post-meta-date">{{ formatDate(fm.date) }}</time>
      <template v-if="fm.category">
        <span class="post-meta-sep">·</span>
        <a class="post-meta-category" :href="`/category/#${slugify(fm.category)}`">{{ fm.category }}</a>
      </template>
      <template v-if="tags.length">
        <span class="post-meta-sep">·</span>
        <span class="post-meta-tags">
          <a v-for="tag in tags" :key="tag" class="post-meta-tag" :href="`/tags/#${slugify(tag)}`">{{ tag }}</a>
        </span>
      </template>
    </div>
    <h1 class="post-title">{{ fm.title }}</h1>
  </div>
</template>
