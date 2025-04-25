import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'
import react from '@astrojs/react'
import remarkLinkCard from 'remark-link-card'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), mdx(), icon(), react()],
  adapter: cloudflare(),
  markdown: {
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
})
