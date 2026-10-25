import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = 'https://fastagi.dev';
const github = 'https://github.com/fastagi';
const releases = `${github}/keepbuild-releases/releases`;
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const arrow = '<svg class="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const external = '<svg class="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M6 7h11v11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const logo = '<img class="brand-icon" src="/assets/favicon.svg" width="31" height="31" alt="">FastAGI';
const pathFor = (lang, page = '') => `${lang === 'zh' ? '/zh' : ''}/${page ? `${page}/` : ''}`;
const copy = {
  en: {
    lang: 'en', title: 'FastAGI — Less setup. More building.', description: 'Practical tools for developers. Explore FastBuild, the full-stack starter kit; KeepBuild for macOS developer cleanup; and FastBase, a database client in development.',
    skip: 'Skip to content', tools: 'Our tools', approach: 'Our approach', menu: 'Menu', locale: '中文', back: 'All tools', explore: 'Explore the tools', viewGithub: 'View GitHub', viewProduct: 'Explore', source: 'Source code', docs: 'Read the docs',
    eyebrow: 'FOR PEOPLE WHO BUILD', hero: ['Less setup.', 'More building.'], intro: 'A full-stack foundation. A cleaner Mac. A home for your data. Practical tools that help you get on with the work.', index: 'THE FASTAGI TOOLKIT', collection: 'THREE TOOLS. ONE MINDSET.',
    diagram: 'Architecture sketch', illustration: 'Workflow illustration · sample data', console: 'Admin Console', web: 'Customer Web', workspace: 'Workspace', projects: 'Projects', history: 'History', ignored: 'Ignored', candidates: 'Review candidates', review: 'Review',
    principleTitle: 'Good tools get out of your way.', principleLabel: 'HOW WE BUILD', principles: [
      ['A useful starting point.', 'Start with the foundations in place. Spend your attention on the application, query, or project in front of you.'],
      ['Clear boundaries.', 'Each tool has a focused job. Product pages explain what is available today and what is still in development.'],
      ['Room to make it yours.', 'FastBuild is MIT-licensed and ready to adapt. Our other tools list their current source and release availability individually.']
    ],
    closing: 'Your next project starts here.', closingText: 'Start with FastBuild. Make the foundation your own.', closingCta: 'Explore FastBuild', footer: 'Tools for people who build.', footerStatus: 'Built with care. Released at their own pace.', github: 'GitHub', websiteSource: 'Website source', available: 'Available today', features: 'A closer look', how: 'GET STARTED', faq: 'A few useful details.', other: 'MORE FROM FASTAGI', copy: 'Copy', copied: 'Copied', copyFailed: 'Select and copy below',
    products: {
      fastbuild: {
        name: 'FastBuild', icon: 'F', badge: 'MIT · OPEN SOURCE', category: 'FULL-STACK STARTER KIT', short: 'The head start your next app deserves.', tagline: 'From first commit to your own application.', description: 'A Go API, a Next.js customer app, and a separate Admin Console. Authentication, permissions, audit, and deployment foundations, already in place.', meta: 'Go / Next.js / React', availability: 'Public source · MIT license. Use the starter as the foundation for your own application.',
        features: [ ['Three surfaces. One foundation.', 'A modular Go API, a server-rendered Next.js customer app, and a Vite Admin Console communicate through shared HTTP contracts.'], ['Start small. Add what you need.', 'Accounts, API keys, and audit come by default. Enable organizations, permissions, notifications, private assets, usage, settings, or webhooks as needed.'], ['Own your starting point.', 'Initialize a downstream project with your own name and module path. Install source-based plugins, themes, and blocks as your application grows.'] ],
        setupTitle: 'Make it your starting point.', setupText: 'Clone the starter and follow the repository quick start to configure your project. The docs cover initialization, local development, and deployment.', setupNote: 'Prerequisites: Docker Compose, Go, Node.js, and Corepack. Check the README for current supported versions before running.',
        faq: [ ['Is this a finished SaaS application?', 'FastBuild is a full-stack starter kit. It provides reusable foundations and optional business starters; your application supplies the product-specific workflows.'], ['Can I use just one frontend?', 'Yes. The customer Web application and Admin Console are independently deployable. A downstream application can use either or both.'], ['What is included in the license?', 'The FastBuild repository is published under the MIT license. Consult its LICENSE file and retain applicable copyright and license notices when distributing copies.'] ]
      },
      keepbuild: {
        name: 'KeepBuild', icon: 'K', badge: 'macOS · v0.2.0', category: 'DEVELOPER WORKSPACE UTILITY', short: 'A little less clutter. A lot more focus.', tagline: 'Keep your development space in order.', description: 'A native macOS tool for reviewing development cache files, managing cleanup history, and checking the processes using your ports.', meta: 'Native macOS / Swift', availability: 'macOS 14+ · Public v0.2.0 release packages. The source repository is currently private.',
        features: [ ['Review before you clean.', 'Scan selected development projects, review supported cache candidates, and use a read-only preview before confirming a move to the Trash.'], ['Keep track of your changes.', 'Use ignore lists and operation history. The restore flow checks file identity and skips items it cannot safely verify.'], ['See what is running.', 'Inspect port usage and confirm before ending a process owned by your user. Menu-bar monitoring keeps system information close at hand.'] ],
        setupTitle: 'Try the macOS release.', setupText: 'The release page includes DMG and ZIP packages. Read the release notes and check compatibility before installing.', releaseTitle: 'KeepBuild v0.2.0', releaseText: 'macOS 14 or later. Public distribution packages are available on GitHub.', releaseCta: 'View releases & downloads',
        faq: [ ['Does cleanup permanently delete files?', 'The documented cleanup flow moves confirmed items to the system Trash. It does not empty the Trash. Moving files there does not immediately free disk space.'], ['Does it scan my whole Mac?', 'The documented project cleanup workflow scans selected projects using supported rules. It is not a promise of system-wide or automatic cleanup.'], ['Is KeepBuild open source?', 'The release repository is public, but the application source repository is currently private. Public downloads and open source are different availability states.'] ]
      },
      fastbase: {
        name: 'FastBase', icon: 'B', badge: 'IN DEVELOPMENT', category: 'DATABASE CLIENT', short: 'Your data. A clearer view.', tagline: 'A focused place to work with your data.', description: 'A cross-platform database client built with Tauri, React, and Rust. Explore schemas, preview tables, and write SQL in one workspace.', meta: 'Tauri / React / Rust', availability: 'Development preview · Source currently private. No public download or release is linked yet.',
        features: [ ['Connect to your databases.', 'The current MVP includes PostgreSQL, MySQL, and SQLite connections, connection testing, and saved connection settings.'], ['Find your way around.', 'Browse schemas, tables, and columns. Preview table data without writing a query for every first look.'], ['Get to the query.', 'A multi-statement SQL editor displays query results in a grid. The current MVP limits each result set to its first 1,000 rows.'] ],
        setupTitle: 'Taking shape, one query at a time.', setupText: 'FastBase is in development. This page describes the current MVP scope, rather than a publicly released application.', releaseTitle: 'Development preview', releaseText: 'There is no public download or source link yet. Follow FastAGI on GitHub for public project activity.', releaseCta: 'Explore FastAGI on GitHub',
        faq: [ ['Can I download FastBase today?', 'This website does not yet provide a public FastBase download. We will add a release link when a public package is available.'], ['Which databases are in the MVP?', 'The repository describes PostgreSQL, MySQL, and SQLite support. These are FastBase client capabilities and are separate from FastBuild’s PostgreSQL-only backend.'], ['Is the source public?', 'The source repository is currently private, and no public open-source license has been verified. We do not label FastBase as open source at this stage.'] ]
      }
    }
  },
  zh: {
    lang: 'zh-CN', title: 'FastAGI — 少些准备，多些创造。', description: '为开发者打造实用工具。了解 FastBuild 全栈开发脚手架、KeepBuild macOS 开发环境清理工具，以及正在开发的 FastBase 数据库客户端。',
    skip: '跳到正文', tools: '产品', approach: '我们的理念', menu: '菜单', locale: 'EN', back: '全部产品', explore: '探索产品', viewGithub: '查看 GitHub', viewProduct: '了解', source: '查看源码', docs: '阅读文档',
    eyebrow: '为创造者而造', hero: ['少些准备，', '多些创造。'], intro: '应用开发的起点，整洁有序的 Mac，清晰易用的数据工作台。用实用的工具，把时间留给真正想做的事。', index: 'FASTAGI 工具集', collection: '三个工具，同一种理念。',
    diagram: '架构示意', illustration: '工作流程示意 · 示例数据', console: '管理控制台', web: '用户应用', workspace: '工作空间', projects: '项目', history: '历史', ignored: '忽略名单', candidates: '检查清理候选', review: '待检查',
    principleTitle: '好的工具，让你专注于工作。', principleLabel: '我们的理念', principles: [
      ['从有用的起点开始。', '让基础工作先准备好，把注意力留给眼前的应用、查询和项目。'],
      ['能力清晰，状态透明。', '每个工具解决具体的问题。产品页明确说明现在能做什么，哪些还在开发中。'],
      ['留出自由创造的空间。', 'FastBuild 采用 MIT 许可证，你可以按需改造。其他产品分别标注源码和版本的开放情况。']
    ],
    closing: '下一个项目，从这里开始。', closingText: '从 FastBuild 出发，构建属于你的应用。', closingCta: '了解 FastBuild', footer: '为 AI 时代的开发者打造工具。', footerStatus: '认真打磨，逐步发布。', github: 'GitHub', websiteSource: '官网源码', available: '当前能力', features: '进一步了解', how: '开始使用', faq: '你可能想了解', other: '更多 FASTAGI 工具', copy: '复制', copied: '已复制', copyFailed: '请选中文本复制',
    products: {
      fastbuild: {
        name: 'FastBuild', icon: 'F', badge: 'MIT · 已开源', category: '全栈开发脚手架', short: '让下一个应用，轻松起步。', tagline: '从第一次提交，到你的应用。', description: 'Go API、Next.js 用户应用与独立管理控制台。登录、权限、审计和部署基础已经准备好，直接开始业务开发。', meta: 'Go / Next.js / React', availability: '源码公开 · MIT 许可证。以脚手架为起点，构建属于你的应用。',
        features: [ ['三端独立，基础一致。', '模块化 Go API、支持服务端渲染的 Next.js 用户应用，以及 Vite 管理控制台，通过共享 HTTP 契约协作。'], ['按需启用，逐步扩展。', '默认提供账户、API 密钥和审计。组织、权限、通知、私有文件、用量、设置和 Webhook 等能力可按需启用。'], ['代码落在自己的项目里。', '初始化你的项目名称与模块路径。通过源码形式安装插件、主题和页面区块，随着产品发展继续扩展。'] ],
        setupTitle: '作为你的项目起点。', setupText: '克隆脚手架，按仓库快速开始文档配置项目。文档包含项目初始化、本地开发和部署说明。', setupNote: '需要 Docker Compose、Go、Node.js 和 Corepack。运行前请在 README 中确认当前版本要求。',
        faq: [ ['这是一个完整的 SaaS 产品吗？', 'FastBuild 是全栈开发脚手架，提供通用基础和可选业务模块。具体产品的业务流程由你的下游应用实现。'], ['能否只使用其中一个前端？', '可以。用户 Web 应用和管理控制台可以独立部署，下游应用可以选择其中一个，也可以同时使用。'], ['采用什么许可证？', 'FastBuild 仓库采用 MIT 许可证。请查阅仓库 LICENSE 文件，分发副本时保留适用的版权和许可证声明。'] ]
      },
      keepbuild: {
        name: 'KeepBuild', icon: 'K', badge: 'macOS · v0.2.0', category: '开发环境管理工具', short: '少一点杂乱，多一点专注。', tagline: '让开发环境，保持井井有条。', description: '原生 macOS 工具，用于检查开发缓存、管理清理历史，以及查看哪些进程占用了端口。', meta: '原生 macOS / Swift', availability: 'macOS 14+ · v0.2.0 安装包已公开。应用源码仓库当前为私有。',
        features: [ ['先检查，再清理。', '扫描选定的开发项目，查看支持的缓存候选项，先进行只读预演，再确认移入系统废纸篓。'], ['操作有记录。', '提供忽略名单和操作历史。恢复流程检查文件身份，跳过无法验证的项目。'], ['知道什么正在运行。', '查看端口占用，在确认后结束当前用户的进程。菜单栏监控让系统信息随时可见。'] ],
        setupTitle: '体验 macOS 版本。', setupText: '发布页提供 DMG 和 ZIP 安装包。安装前请阅读发布说明并确认系统兼容性。', releaseTitle: 'KeepBuild v0.2.0', releaseText: '需要 macOS 14 或更高版本。可在 GitHub 获取公开发布的安装包。', releaseCta: '查看版本与下载',
        faq: [ ['清理会永久删除文件吗？', '文档中的清理流程将确认的项目移入系统废纸篓，不会清空废纸篓。移入废纸篓也不代表磁盘空间会立即释放。'], ['会扫描整台 Mac 吗？', '当前项目清理流程按支持的规则扫描你选择的项目，不承诺全盘扫描或自动清理。'], ['KeepBuild 开源了吗？', '发布包仓库已公开，应用源码仓库目前仍为私有。提供公开下载与开放源码是不同的状态。'] ]
      },
      fastbase: {
        name: 'FastBase', icon: 'B', badge: '开发中', category: '数据库客户端', short: '你的数据，一目了然。', tagline: '专注处理数据的工作空间。', description: '基于 Tauri、React 和 Rust 的跨平台数据库客户端。在一个工作空间里浏览结构、预览表数据并编写 SQL。', meta: 'Tauri / React / Rust', availability: '开发预览 · 源码当前私有，暂未提供公开下载或版本链接。',
        features: [ ['连接常用数据库。', '当前 MVP 包含 PostgreSQL、MySQL 和 SQLite 连接、连接测试与连接配置保存。'], ['快速了解数据结构。', '浏览数据库 Schema、表和字段。直接预览表数据，减少初次查看时的重复查询。'], ['专注编写 SQL。', '多语句 SQL 编辑器以表格展示查询结果。当前 MVP 每个结果集最多展示前 1,000 行。'] ],
        setupTitle: '一步一步，打磨数据体验。', setupText: 'FastBase 正在开发。本页介绍的是当前 MVP 范围，尚不是已经公开发布的应用。', releaseTitle: '开发预览', releaseText: '暂未提供公开下载或源码链接。你可以在 GitHub 关注 FastAGI 的公开项目动态。', releaseCta: '访问 FastAGI GitHub',
        faq: [ ['现在可以下载 FastBase 吗？', '本网站暂未提供 FastBase 的公开下载。公开安装包可用后，我们会在这里补充版本链接。'], ['MVP 支持哪些数据库？', '仓库介绍包含 PostgreSQL、MySQL 和 SQLite。这属于 FastBase 客户端的能力，与 FastBuild 后端仅使用 PostgreSQL 的范围独立。'], ['源码公开了吗？', '源码仓库目前为私有，尚未确认公开的开源许可证，因此现阶段不将 FastBase 标注为已开源。'] ]
      }
    }
  }
};

function link(href, text, className = 'text-link', outside = false) {
  return `<a class="${className}" href="${escape(href)}">${escape(text)}${outside ? external : arrow}</a>`;
}
function productTop(id, p) {
  return `<div class="product-top"><span class="product-icon icon-${id === 'fastbuild' ? 'build' : id === 'keepbuild' ? 'keep' : 'base'}" aria-hidden="true">${p.icon}</span><span class="product-name">${p.name}</span><span class="badge">${p.badge}</span></div>`;
}
function windowBar(label) { return `<div class="window-bar"><i></i><i></i><i></i><span>${label}</span></div>`; }
function architecture(t) {
  return `<div class="architecture" role="img" aria-label="${escape(t.diagram)}: Go API, Next.js, Admin Console, PostgreSQL">
    <div class="diagram-label">${t.diagram} / FASTBUILD</div>
    <div class="window terminal">${windowBar('~/your-next-project')}<div class="terminal-body"><div><span class="prompt">❯</span> make dev</div><div class="dim">✓ API &nbsp; ✓ Web &nbsp; ✓ Admin</div></div></div>
    <div class="diagram-connect"></div><div class="diagram-surfaces">
      <div class="window">${windowBar('NEXT.JS')}<div class="mini-app"><div class="mini-title">${t.web}</div><div class="mini-lines"><b></b><b></b></div><div class="mini-tags"><b>SSR</b><b>React</b></div></div></div>
      <div class="window">${windowBar('VITE')}<div class="mini-app"><div class="mini-title">${t.console}</div><div class="mini-lines"><b></b><b></b></div><div class="mini-tags"><b>Admin</b><b>React</b></div></div></div>
    </div><div class="diagram-connect"></div><div class="api-strip"><span>Go API</span><span>Auth · Roles · Audit</span></div><div class="database-strip">↓ &nbsp; PostgreSQL</div>
  </div>`;
}
function preview(id, t) {
  if (id === 'fastbuild') return architecture(t);
  if (id === 'keepbuild') return `<div class="preview preview-keep" role="img" aria-label="${t.illustration}: KeepBuild"><div class="preview-caption">${t.illustration}</div><div class="window">${windowBar('KeepBuild')}<div class="cleaner-body"><div class="cleaner-sidebar"><div class="selected">${t.projects}</div><div>${t.history}</div><div>${t.ignored}</div></div><div class="cleaner-files"><strong>${t.candidates}</strong><div class="file-row">.build<span>${t.review}</span></div><div class="file-row">.pytest_cache<span>${t.review}</span></div><div class="file-row">.ruff_cache<span>${t.review}</span></div></div></div></div></div>`;
  return `<div class="preview preview-base" role="img" aria-label="${t.illustration}: FastBase"><div class="preview-caption">${t.illustration}</div><div class="window">${windowBar('FastBase / local · PostgreSQL')}<div class="query"><em>SELECT</em> name, status<br><em>FROM</em> <b>projects</b><br><em>ORDER BY</em> name;</div><table class="sample-table" aria-hidden="true"><thead><tr><th>name</th><th>status</th></tr></thead><tbody><tr><td>hello_world</td><td>active</td></tr><tr><td>next_idea</td><td>draft</td></tr></tbody></table></div></div>`;
}
function layout(lang, page, title, description, content) {
  const t = copy[lang], home = pathFor(lang), canonical = origin + pathFor(lang, page);
  const otherLang = lang === 'en' ? 'zh' : 'en';
  return `<!doctype html>
<html lang="${t.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f5f5f0"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="${origin}${pathFor('en', page)}"><link rel="alternate" hreflang="zh-CN" href="${origin}${pathFor('zh', page)}"><link rel="alternate" hreflang="x-default" href="${origin}${pathFor('en', page)}"><meta property="og:type" content="website"><meta property="og:site_name" content="FastAGI"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/assets/social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'FastAGI', url: origin, description: copy.en.description, inLanguage: ['en', 'zh-CN'] })}</script></head>
<body><a class="skip" href="#main">${t.skip}</a><header class="site-header"><div class="shell header-inner"><a class="wordmark" href="${home}" aria-label="FastAGI home">${logo}</a><button class="menu-toggle" type="button" data-menu-toggle aria-controls="navigation" aria-expanded="false">${t.menu}</button><nav class="nav" id="navigation" aria-label="${lang === 'zh' ? '主导航' : 'Main navigation'}"><a href="${home}#tools">${t.tools}</a><a href="${home}#approach">${t.approach}</a><a class="nav-github" href="${github}">GitHub ${external}</a><a class="language" href="${pathFor(otherLang, page)}" lang="${copy[otherLang].lang}" aria-label="${lang === 'zh' ? 'Switch to English' : '切换到中文'}">${t.locale}</a></nav></div></header>
<main id="main">${content}</main><footer class="footer shell"><div class="footer-top"><a class="wordmark" href="${home}">${logo}</a><div class="footer-links"><a href="${home}#tools">${t.tools}</a><a href="${github}">${t.github}</a><a href="${github}/fastagi.dev">${t.websiteSource}</a><a href="${pathFor(otherLang, page)}" lang="${copy[otherLang].lang}">${t.locale}</a></div></div><div class="footer-bottom"><span>© 2026 FastAGI. ${t.footer}</span><span>${t.footerStatus}</span></div></footer></body></html>`;
}
function principleCards(items) {
  return `<div class="principle-grid">${items.map(([title, text], index) => `<article><span class="principle-number">0${index + 1} /</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>`;
}
function homePage(lang) {
  const t = copy[lang], p = t.products.fastbuild;
  const body = `<section class="hero shell"><p class="eyebrow mono"><span class="status-dot"></span>${t.eyebrow}</p><div class="hero-main"><h1>${t.hero[0]}<span>${t.hero[1]}</span></h1><div class="hero-aside"><p>${t.intro}</p><div class="hero-actions">${link('#tools', t.explore, 'button')}${link(github, 'GitHub', 'text-link', true)}</div></div></div><div class="hero-bottom mono"><span>${t.index}</span><span>${t.collection} ${arrow}</span></div></section>
  <section class="tools shell" id="tools" aria-label="${t.tools}"><article class="product-feature"><div class="feature-copy">${productTop('fastbuild', p)}<h2>${p.short}</h2><p>${p.description}</p><div class="hero-actions">${link(pathFor(lang, 'fastbuild'), `${t.viewProduct} FastBuild`, 'button')}${link(`${github}/fastbuild`, t.source, 'text-link', true)}</div><div class="stack"><span>Go</span><span>Next.js</span><span>React</span><span>PostgreSQL</span></div></div>${architecture(t)}</article>
  <div class="product-pair">${['keepbuild', 'fastbase'].map(id => { const p = t.products[id]; return `<article class="product-card"><div class="card-copy">${productTop(id, p)}<h2>${p.short}</h2><p>${p.description}</p><div class="card-bottom">${link(pathFor(lang, id), `${t.viewProduct} ${p.name}`)}<span>${p.meta}</span></div></div>${preview(id, t)}</article>`; }).join('')}</div></section>
  <section class="principles shell" id="approach"><div class="section-heading"><h2>${t.principleTitle}</h2><span class="mono">${t.principleLabel}</span></div>${principleCards(t.principles)}</section>
  <section class="closing shell"><div><h2>${t.closing}</h2><p>${t.closingText}</p></div>${link(pathFor(lang, 'fastbuild'), t.closingCta, 'button light')}</section>`;
  return layout(lang, '', t.title, t.description, body);
}
function detailPage(lang, id) {
  const t = copy[lang], p = t.products[id];
  const cta = id === 'fastbuild' ? link(`${github}/fastbuild`, t.source, 'button', true) : id === 'keepbuild' ? link(releases, p.releaseCta, 'button', true) : link('#availability', lang === 'zh' ? '了解当前进展' : 'Current availability', 'button');
  const command = 'git clone https://github.com/fastagi/fastbuild.git\ncd fastbuild\n# Follow README.md to initialize your project';
  const setup = id === 'fastbuild' ? `<div><div class="code-box"><div class="code-head"><span>TERMINAL</span><button class="copy" type="button" data-copy="quickstart" data-label="${t.copy}" data-success="${t.copied}" data-failure="${t.copyFailed}" aria-live="polite">${t.copy}</button></div><pre><code id="quickstart">${escape(command)}</code></pre></div><p class="setup-note">${p.setupNote}</p></div>` : `<div class="release-box"><strong>${p.releaseTitle}</strong><p>${p.releaseText}</p>${link(id === 'keepbuild' ? releases : github, p.releaseCta, 'button outline', true)}</div>`;
  const body = `<div class="shell"><section class="detail-hero"><a class="breadcrumb" href="${pathFor(lang)}#tools">${arrow}${t.back}</a><div class="detail-grid"><div class="detail-copy">${productTop(id, p)}<h1>${p.tagline}</h1><p>${p.description}</p><div class="hero-actions">${cta}${id === 'fastbuild' ? link(`${github}/fastbuild#quick-start`, t.docs) : ''}</div><div class="availability">${p.availability}</div></div><div class="detail-visual">${preview(id, t)}</div></div></section>
  <section class="detail-features"><div class="section-heading"><h2>${t.features}</h2><span class="mono">${p.category}</span></div>${principleCards(p.features)}</section>
  <section class="getting-started" id="availability"><div><span class="mono">${t.how}</span><h2>${p.setupTitle}</h2><p>${p.setupText}</p></div>${setup}</section>
  <section class="faq"><h2>${t.faq}</h2><div>${p.faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></section>
  <nav class="other-tools" aria-label="${t.other}"><span class="mono muted">${t.other}</span><div>${Object.keys(t.products).filter(key => key !== id).map(key => link(pathFor(lang, key), t.products[key].name)).join('')}</div></nav></div>`;
  return layout(lang, id, `${p.name} — ${p.category} | FastAGI`, p.description, body);
}

const routes = [];
for (const lang of Object.keys(copy)) {
  for (const page of ['', ...Object.keys(copy[lang].products)]) {
    const route = pathFor(lang, page);
    const directory = resolve('dist', '.' + route);
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), page ? detailPage(lang, page) : homePage(lang));
    routes.push(route);
  }
}
await writeFile('dist/404.html', layout('en', '', 'Page not found | FastAGI', 'Find your way back to the FastAGI toolkit.', `<section class="error-page shell"><p class="mono">404 / NOT FOUND</p><h1>A small detour.</h1><p>This page is not here. Your next tool might be.</p>${link('/', 'Back to FastAGI', 'button')}</section>`).replace('<meta name="theme-color"', '<meta name="robots" content="noindex"><meta name="theme-color"'));
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>\n`);
console.log(`Built ${routes.length} localized pages, 404, robots.txt, and sitemap.xml.`);
