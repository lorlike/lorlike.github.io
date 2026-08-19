<script setup lang="ts">
import { computed } from 'vue'
import { data as posts, type Post } from '../posts.data'
import { slugify } from '../utils'
import PostList from './PostList.vue'

// 一篇文章可有多个标签，按标签分别归组
const tags = computed(() => {
  const map = new Map<string, Post[]>()
  for (const post of posts) {
    for (const tag of post.tags) {
      const name = tag.trim()
      if (!name) continue
      if (!map.has(name)) map.set(name, [])
      map.get(name)!.push(post)
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, list]) => ({ name, id: slugify(name), count: list.length, posts: list }))
})
</script>

<template>
  <div class="blog-page">
    <h1 class="blog-title">标签</h1>
    <p class="blog-subtitle">{{ tags.length }} 个标签</p>

    <nav class="chip-list">
      <a v-for="tag in tags" :key="tag.id" class="chip" :href="`#${tag.id}`">
        {{ tag.name }}
        <span class="chip-count">{{ tag.count }}</span>
      </a>
    </nav>

    <section v-for="tag in tags" :key="tag.id" class="blog-group" :id="tag.id">
      <h2 class="blog-group-title">{{ tag.name }}</h2>
      <PostList :posts="tag.posts" />
    </section>
  </div>
</template>
