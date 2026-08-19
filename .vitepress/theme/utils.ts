/** 生成用于锚点的 slug（保留中文，空格转短横线） */
export function slugify(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '-')
}

/**
 * 把 frontmatter.date 统一格式化为 YYYY-MM-DD。
 * 解析器可能把它转成 Date 对象（含本地时区），也可能保持字符串。
 */
export function formatDate(d: unknown): string {
  if (!d) return ''
  if (d instanceof Date && !Number.isNaN(d.getTime())) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  const s = String(d)
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s
}
