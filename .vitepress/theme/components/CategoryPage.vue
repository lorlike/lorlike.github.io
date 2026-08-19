<script setup lang="ts">
import { computed } from 'vue'
import { data as posts, type Post } from '../posts.data'
import { slugify } from '../utils'
import PostList from './PostList.vue'

const categories = computed(() => {
  const map = new Map<string, Post[]>()
  for (const post of posts) {
    const name = post.category?.trim() || '未分类'
    if (!map.has(name)) map.set(name, [])
    map.get(name)!.push(post)
  }
  return [...map.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, list]) => ({ name, id: slugify(name), count: list.length, posts: list }))
})
</script>

<template>
  <div class="blog-page">
    <h1 class="blog-title">分类</h1>
    <p class="blog-subtitle">{{ posts.length }} 篇文章 · {{ categories.length }} 个分类</p>

    <nav class="chip-list">
      <a v-for="cat in categories" :key="cat.id" class="chip" :href="`#${cat.id}`">
        {{ cat.name }}
        <span class="chip-count">{{ cat.count }}</span>
      </a>
    </nav>

    <section v-for="cat in categories" :key="cat.id" class="blog-group" :id="cat.id">
      <h2 class="blog-group-title">{{ cat.name }}</h2>
      <PostList :posts="cat.posts" />
    </section>
  </div>
</template>
