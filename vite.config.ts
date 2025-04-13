import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const pathSrc = path.resolve(__dirname, 'src')

// https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_PUBLIC_PATH,
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
      // 按需打包
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 一家人就要整整齐齐
            if (id.includes('/node_modules/vue/') || id.includes('/node_modules/vue-router/') || id.includes('/node_modules/pinia/')) {
              //return 'vue'
            } else if (id.includes('/node_modules/vue-i18n/')) {
              //return 'vue-i18n'
            } else if (id.includes('/node_modules/element-plus/') || id.includes('/node_modules/@element-plus/')) {
              return 'element-plus'
            }
          },
        }
      },
    },
    plugins: [
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        // 自定义图标
        // addbook：更改了iconoir的图标，把书本中的÷改成了+
        // exit：是@element-plus/icons-vue/SwitchButton
        customCollections: {
          custom: {
            addbook: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M4 19V5a2 2 0 0 1 2-2h13.4a.6.6 0 0 1 .6.6v13.114M6 17h14M6 21h14"/><path stroke-linejoin="round" d="M6 21a2 2 0 1 1 0-4"/><path d="M 9 10 h6"/><path stroke-linejoin="round" d="M 12 13 V7"/></g></svg>',
            exit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M352 159.872V230.4a352 352 0 1 0 320 0v-70.528A416.128 416.128 0 0 1 512 960a416 416 0 0 1-160-800.128z"></path><path fill="currentColor" d="M512 64q32 0 32 32v320q0 32-32 32t-32-32V96q0-32 32-32"></path></svg>'
          },
        },
      }),
      vue({
        template: {
          compilerOptions: {
            // 自定义HTML语义
            isCustomElement: (tag) => tag === 'xxsmall'
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
          IconsResolver({
            // 自动加载图标：通过 i-collection-icon 方式直接加载到 <el-icon> 组件
            // 如果是动态加载：比如显示dropdown中，需要使用import...的方式
            enabledCollections: ['iconoir'],
            customCollections: ['custom'],
          }),
        ],
        dts: 'src/components.d.ts',
      }),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            // 自动加载图标的前缀
            prefix: 'i',
          }),
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
      open: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:6767',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    }
  }
})
