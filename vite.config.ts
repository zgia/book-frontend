import path from 'path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
    },
  },
  assetsInclude: ['**/*.cnf'],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use \'~/styles/element/index.scss\' as *;',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/vue/') || id.includes('/node_modules/vue-router/') || id.includes('/node_modules/pinia/')) {
            return 'vue'
          } else if (id.includes('/node_modules/vue-i18n/')) {
            return 'vue-i18n'
          } else if (id.includes('/node_modules/element-plus/') || id.includes('/node_modules/@element-plus/')) {
            return 'element-plus'
          }
        },
      }
    },
  },
  plugins: [
    splitVendorChunkPlugin(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag == 'xxsmall'
        }
      }
    }),
    ElementPlus({
      useSource: true,
      defaultLocale: 'zh-cn',
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver()
      ],
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ]
    }),
  ],
  server: {
    cors: {
      origin: '*',
      credentials: true
    },
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:6767',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
})
