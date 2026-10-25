# fastagi.dev

The independent FastAGI product website, for **independent developers and small teams**. Leads with **CodingCTO** for team Codex access, followed by **FastBuild**, **KeepBuild**, and **FastBase**, with English and Chinese pages.

## Development

Node.js 22 or newer is sufficient. There are no runtime packages, trackers, external fonts, or frontend framework dependencies.

```sh
npm run build
npm run check
npm run dev
```

Open `http://127.0.0.1:4317`. Set `PORT` to use another local port.

- `scripts/build.mjs` owns page templates, localized copy, routes, sitemap, and metadata.
- `dist/assets/` owns shared CSS, progressive browser interactions, and brand assets.
- Generated HTML in `dist/` is tracked so any static host can serve the checkout directly.
- `scripts/check.mjs` verifies page metadata, local links, anchors, assets, and private-source link boundaries.
- `.openai/hosting.json` records the Sites preview deployment identity. It contains no credentials.

## Pages

| English | Chinese |
| --- | --- |
| `/` | `/zh/` |
| `/codingcto/` | `/zh/codingcto/` |
| `/fastbuild/` | `/zh/fastbuild/` |
| `/keepbuild/` | `/zh/keepbuild/` |
| `/fastbase/` | `/zh/fastbase/` |

## Content boundaries

Product copy was checked against repository metadata and README files on 2026-10-25. This is a content review, not an end-to-end verification of the applications themselves.

- **CodingCTO:** featured product for team Codex account assignments, member-client sign-in, and launching a separately installed official Codex App. Source currently private; no public release or signup is advertised. Core workflows are documented as implemented, with release validation pending. This is not described as an autonomous CTO or an official OpenAI product.
- **FastBuild:** public source, MIT license. Described as a full-stack starter kit, not a finished SaaS product.
- **KeepBuild:** public v0.2.0 release packages; source is currently private. Download buttons lead to release notes and assets, not an unverified direct installer. Cleanup moves confirmed items to the Trash and does not promise immediate space recovery.
- **FastBase:** current MVP in a private repository. No public license or download is advertised. PostgreSQL, MySQL, and SQLite are its own client capabilities, independent of FastBuild's backend constraints.

The product panels are labeled architecture/workflow illustrations. They are original HTML/CSS diagrams using sample data, not application screenshots or claims of live integrations. There are no invented customers, statistics, testimonials, or release promises.

See [docs/CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md) before changing availability claims.

## Deployment

Serve `dist/` as the static document root. Build command: `npm run build`. No server secrets or database are needed. Configure the host to serve `404.html` for unknown paths.

Canonical URLs and the sitemap target `https://fastagi.dev`; attaching that domain and changing DNS are separate hosting operations. A Sites preview URL does not prove the custom domain is connected.

The website source is MIT-licensed. This website's license does not change the licenses or visibility of the featured products. Brand names and marks identify their respective projects.
