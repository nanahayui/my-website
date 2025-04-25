import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'

import remarkLinkCard from 'remark-link-card'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), icon()],

  markdown: {
    output: 'server',
    adapter: cloudflare(),
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [
      [
        remarkLinkCard,
        {
          shortenUrl: true,
        },
      ],
    ],
  },

  adapter: cloudflare(),
})
