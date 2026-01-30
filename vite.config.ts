import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import postcssOKLabFunction from '@csstools/postcss-oklab-function'
import postcssNesting from 'postcss-nesting'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.endsWith('.md')) {
          const content = readFileSync(id, 'utf-8')
          return {
            code: `export default ${JSON.stringify(content)}`,
            map: null
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0'
  },
  css: {
    postcss: {
      plugins: [
        postcssOKLabFunction(),
        postcssNesting(),
      ],
    },
  }
})
