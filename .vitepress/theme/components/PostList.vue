<script setup lang="ts">
import type { Post } from '../posts.data'

withDefaults(
  defineProps<{
    posts: Post[]
    /** 是否展示摘要（首页卡片用） */
    showSummary?: boolean
    /** 是否在标题旁展示分类小标签（首页用） */
    showCategory?: boolean
  }>(),
  {
    showSummary: false,
    showCategory: false,
  },
)
</script>

<template>
  <ul v-if="posts.length" class="post-list">
    <li v-for="post in posts" :key="post.url" class="post-item">
      <time class="post-item-date" :datetime="post.date">{{ post.date }}</time>
      <div class="post-item-main">
        <a class="post-item-title" :href="post.url">
          {{ post.title }}
          <span v-if="showCategory && post.category" class="post-item-category">{{ post.category }}</span>
        </a>
        <p v-if="showSummary && (post.description || post.excerpt)" class="post-item-summary">
          <span v-if="post.description">{{ post.description }}</span>
          <span v-else v-html="post.excerpt" />
        </p>
      </div>
    </li>
  </ul>
  <p v-else class="post-list-empty">暂无文章</p>
</template>
