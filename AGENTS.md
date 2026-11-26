## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Build, check, format:

```
pnpm run build
pnpm run check
pnpm run format
```

Package management:

- Always use `pnpm add <pkg>` (or `pnpm add -D <pkg>`) and `pnpm remove <pkg>` to manage dependencies.
- Never manually edit dependency blocks in `package.json` to prevent lockfile desynchronization.

## Structure

- Docs are MDX files in `src/content/docs/`, validated by the schema in `src/content.config.ts`. The file name is the URL id. Every `##` heading becomes a section on the grid (`src/lib/markdown-sections.ts`); code fences go through `CodeBlock.astro`. `src/pages/rss.xml.ts` feeds the same collection.
- Site identity, navigation, social links, and optional GitHub handles live in `src/data/site.ts`. Bio prose lives in `src/data/about.ts`. The career trace is data in `src/data/trace.ts`, with months written `YYYY-MM`.
- `src/lib/` holds build-time helpers only (dates, docs queries, trace geometry, schema.org helpers, the GitHub fetch). There is no client-side framework; the few scripts are plain `<script>` tags in components, plus `src/scripts/theme-init.js`, which `astro.config.mjs` injects into `<head>`.
- `src/layouts/Layout.astro` is the document shell and already renders the meta bar and footer. Pages only provide what goes inside `<main>`.
- Page navigation uses native cross-document view transitions (`@view-transition` in the design system), not Astro's `ClientRouter`. Scripts run once per page load.
- Theme: tokens use `light-dark()` and follow the system. `data-theme="light|dark"` on `<html>` pins a choice; the head script applies the saved one before paint.
- Env: `GITHUB_TOKEN` is declared in `astro.config.mjs` and read from `astro:env/server`. Never read `process.env` directly.
- CSP: `security.csp` in `astro.config.mjs` writes a policy into every page. Component `<script>` tags are hashed automatically; anything else inline needs `injectScript('head-inline', …)` or a hash in `scriptDirective.hashes`. The policy only applies to `build` and `preview`, not `dev`. The Shiki warning it prints on every build is expected: style attributes are allowed.
- Static assets output to `dist/` with `trailingSlash: 'never'` and generated `robots.txt` (`src/pages/robots.txt.ts`), `sitemap-index.xml`, and `rss.xml`. Optional Cloudflare Workers static assets configuration lives in `wrangler.jsonc` (`drop-trailing-slash`) and `public/_headers`.

## Design System & Architecture

The site follows Wim Crouwel / Dutch structural functionalism.

- **Design system files**: Tokens, specs, and visual guidelines live in [`design-system/`](design-system/):
  - Design tokens: `design-system/tokens/` (`colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`)
  - Full design specification: `design-system/README.md`
  - Master stylesheet: `design-system/styles.css`
  - Token reference cards: `design-system/guidelines/*.html`, plain HTML rendered against `styles.css`
- **Components**: Native Astro components live in `src/components/` with CSS classes prefixed with `ag-*` ("Astro Grid"). Components carry no styles of their own; every class is defined in `design-system/components/components.css`.
- **Rules**:
  - 12-column visible hairline grid (`--line-grid`), zero gutter, text offset by `--inset: 8px`.
  - Lines as the only ornament (rules open sections and rows; no cards, fills, shadows, or rounded corners).
  - Ink on paper palette; green (`oklch(0.62 0.16 150)`) is the only hue, reserved exclusively for the single active/now item.
  - Lowercase interface (nav, labels, dates, types); prose and doc titles use sentence case.
  - Always refer directly to `design-system/tokens/` for token definitions rather than hardcoding or duplicating values. Type is set with the `--type-*` recipes; mono text always pairs `font: var(--type-mono)` with `font-stretch: var(--wdth-mono)`; full-width grid placement is `grid-column: var(--col-full)`.
  - Content columns (`ag-section__body`, `ag-posthead__body`, `ag-trace__body`) are subgrids of the eight content columns: children run line to line by default and `.ag-prose` spans `--col-prose` (six columns). Small steps are tokens too: `--gap-tight` (4px) between stacked mono lines, `--gap-inline` (8px) beside a mark or arrow, `--mark` (8px) for the square, `--row-h` (40px) for every mono row.
