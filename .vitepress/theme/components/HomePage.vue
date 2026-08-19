<script setup lang="ts">
import { useData } from 'vitepress'
import { data as posts } from '../posts.data'
import PostList from './PostList.vue'

const { site } = useData()
const RECENT_LIMIT = 8
</script>

<template>
  <div class="blog-page">
    <header class="blog-intro">
      <h1 class="blog-title">{{ site.title }}</h1>
      <p class="blog-subtitle">{{ site.description }}</p>
    </header>

    <h2 class="blog-section-title">最近文章</h2>
    <PostList :posts="posts.slice(0, RECENT_LIMIT)" show-summary show-category />

    <div class="blog-more">
      <a class="blog-more-link" href="/archives">全部文章 →</a>
    </div>
  </div>
</template>
