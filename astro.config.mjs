import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'

import remarkLinkCard from 'remark-link-card'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), icon()],
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
