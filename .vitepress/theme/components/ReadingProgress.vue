<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 仅文章页显示阅读进度条
const isPost = computed(() => Boolean(frontmatter.value.date))

const progress = ref(0)
let raf = 0

function update() {
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  progress.value = max > 0 ? Math.min(1, el.scrollTop / max) : 0
}

function onScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div v-if="isPost" class="reading-progress" :style="{ width: `${progress * 100}%` }" aria-hidden="true" />
</template>
