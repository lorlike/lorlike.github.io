<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../posts.data'

const route = useRoute()

// 当前文章在按日期倒序排列的列表中的位置
const currentIndex = computed(() => posts.findIndex((p) => p.url === route.path))

// 上一篇 = 更早的一篇；下一篇 = 更新的一篇
const prev = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < posts.length - 1
    ? posts[currentIndex.value + 1]
    : undefined,
)
const next = computed(() =>
  currentIndex.value > 0 ? posts[currentIndex.value - 1] : undefined,
)

const visible = computed(() => currentIndex.value >= 0 && (prev.value || next.value))
</script>

<template>
  <nav v-if="visible" class="post-pager" aria-label="文章分页">
    <a v-if="next" class="post-pager-link" :href="next.url">
      <span class="post-pager-label">下一篇</span>
      <span class="post-pager-title">{{ next.title }}</span>
    </a>
    <a v-if="prev" class="post-pager-link is-prev" :href="prev.url">
      <span class="post-pager-label">上一篇</span>
      <span class="post-pager-title">{{ prev.title }}</span>
    </a>
  </nav>
</template>
