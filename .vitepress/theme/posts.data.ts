import { createContentLoader } from 'vitepress'
import { formatDate } from './utils'

export interface Post {
  /** 文章链接，如 /posts/hello-world */
  url: string
  title: string
  /** YYYY-MM-DD 字符串，来自 frontmatter.date */
  date: string
  category?: string
  tags: string[]
  description?: string
  /** 渲染后的 HTML 摘要（frontmatter 中写 <!-- more --> 标记时才有） */
  excerpt?: string
}

declare const data: Post[]
export { data }

/**
 * 扫描 posts/ 目录下的全部文章。
 * 摘要约定：正文用 `<!-- more -->` 截断，截断前的内容会渲染为卡片摘要；
 * 未写该标记的文章卡片只展示标题与日期（更克制）。
 */
export default createContentLoader('posts/**/*.md', {
  includeSrc: true,
  excerpt: '<!-- more -->',
  transform(raw): Post[] {
    return raw
      .filter(({ frontmatter }) => frontmatter.published !== false)
      .map(({ url, frontmatter, excerpt, src }) => ({
        url,
        title: (frontmatter.title as string) ?? '未命名',
        date: formatDate(frontmatter.date),
        category: frontmatter.category as string | undefined,
        tags: (frontmatter.tags as string[]) ?? [],
        description: frontmatter.description as string | undefined,
        excerpt: src?.includes('<!-- more -->') ? excerpt : undefined,
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
