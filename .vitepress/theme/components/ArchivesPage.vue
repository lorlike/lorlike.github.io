<script setup lang="ts">
import { computed } from 'vue'
import { data as posts, type Post } from '../posts.data'
import PostList from './PostList.vue'

// 按年份归档，年份内按日期倒序
const years = computed(() => {
  const map = new Map<string, Post[]>()
  for (const post of posts) {
    const year = post.date.slice(0, 4) || '其他'
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()].map(([year, list]) => ({ year, count: list.length, posts: list }))
})
</script>

<template>
  <div class="blog-page">
    <h1 class="blog-title">归档</h1>
    <p class="blog-subtitle">共 {{ posts.length }} 篇文章</p>

    <section v-for="group in years" :key="group.year" class="blog-group">
      <h2 class="blog-group-title">
        {{ group.year }}
        <span class="blog-group-count">{{ group.count }}</span>
      </h2>
      <PostList :posts="group.posts" />
    </section>
  </div>
</template>
