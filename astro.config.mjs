import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import mermaid from "astro-mermaid";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
   plugins: [tailwindcss()],
 },

  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "github-dark",
    }
  },

  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },

  site: 'https://www.fluvialdiligence.com',
  integrations: [ sitemap(), mdx(), mermaid()],
  adapter: cloudflare()
});