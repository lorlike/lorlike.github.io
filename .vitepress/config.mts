import { defineConfig } from 'vitepress'

// 站点名称与描述在首页简介与导航品牌处展示，按需修改
const siteTitle = "Lorlike's Blog"
const siteDescription = '记录代码与生活的点点滴滴'
const base = '/' 

export default defineConfig({
  lang: 'zh-CN',
  title: siteTitle,
  description: siteDescription,
  base,
  cleanUrls: true,

  // 仓库 README 只给 GitHub 用，不参与站点构建
  srcExclude: ['README.md', 'README.zh-CN.md'],

  // 页面 md 统一放在 pages/ 文件夹，通过 rewrite 保持路由不变
  rewrites: {
    'pages/:rest': ':rest',
  },

  head: [['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' }]],

  themeConfig: {
    // 站点品牌名（导航左上角）
    siteTitle,

    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/category' },
      { text: '归档', link: '/archives' },
      { text: '标签', link: '/tags' },
      { text: '关于', link: '/about' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lorlike' },
    ],

    // 文章大纲（右侧目录）
    outline: {
      level: [2, 3],
      label: '目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    // 博客无侧栏
    // sidebar: undefined,

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Powered by VitePress Theme Minimalism',
      copyright: "© 2026-present Lorlike's Blog",
    },
  },
})
