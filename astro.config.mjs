// @ts-check
import { readFileSync } from 'node:fs';
import { env } from 'node:process';
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { sections } from './src/lib/markdown-sections';

/**
 * Puts the theme script in <head> of every page, ahead of first paint. Injected here rather than
 * written inline in the layout so the CSP below carries its hash along with every other script.
 * @type {import('astro').AstroIntegration}
 */
const themeInit = {
  name: 'theme-init',
  hooks: {
    'astro:config:setup': ({ injectScript }) => {
      injectScript('head-inline', readFileSync(new URL('./src/scripts/theme-init.js', import.meta.url), 'utf8'));
    }
  }
};

export default defineConfig({
  // Update this to your production domain before deploying (or set SITE_URL in CI).
  site: env.SITE_URL || 'https://example.com',

  // Clean URLs without trailing slashes. If using Cloudflare Workers, wrangler.jsonc sets
  // html_handling to drop-trailing-slash so dist/about/index.html is served at /about.
  trailingSlash: 'never',

  integrations: [themeInit, mdx(), sitemap()],

  markdown: {
    // Every h2 in a doc becomes a section on the grid, like the rest of the site.
    processor: satteri({ hastPlugins: [sections()] }),
    shikiConfig: {
      // Both themes are emitted as CSS variables; the stylesheet picks one with light-dark().
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false
    }
  },

  security: {
    // A <meta> policy on every page: scripts only from this origin or with a build-time hash.
    // Only applied by build and preview, not by the dev server.
    csp: {
      directives: ["default-src 'self'", "base-uri 'self'", "object-src 'none'", "form-action 'none'"],
      styleDirective: {
        // Shiki tokens and the trace lanes are positioned with style attributes.
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' }
        ]
      }
    }
  },

  env: {
    schema: {
      // Read at build time to draw the live GitHub commit field when githubUsers is set.
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true })
    }
  }
});
