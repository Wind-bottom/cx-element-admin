import { resolve } from 'path'
import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import progress from 'vite-plugin-progress'
import EslintPlugin from 'vite-plugin-eslint'
import { ViteEjsPlugin } from "vite-plugin-ejs"
import { viteMockServe } from 'vite-plugin-mock'
import PurgeIcons from 'vite-plugin-purge-icons'
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      Vue({
        script: {
          // 开启defineModel
          defineModel: true
        }
      }),
      VueJsx(),
      progress(),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [{
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name) => {
            if (name === 'click-outside') {
              return ''
            }
            return `element-plus/es/components/${name.replace(/^el-/, '')}/style/css`
          }
        }]
      }),
      EslintPlugin({
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        include: [resolve(__dirname, 'src/locales/**')]
      }),
      createSvgIconsPlugin({
        iconDirs: [pathResolve('src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true
      }),
      PurgeIcons(),
      viteMockServe({
        ignore: /^\_/,
        mockPath: 'mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer'

          setupProdMockServer()
          `
      }),
      ViteEjsPlugin({
        title: env.VITE_APP_TITLE
      }),
      UnoCSS(),
      // sveltekit(),
    ],

    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "./src/styles/variables.module.less";',
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'],
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      }
    },
    server: {
      port: 4000,
      proxy: {
        '/static/images': {
          // target: 'http://61.111.133.143:15053/static/images/',
          target: 'http://38.180.95.46:15053/static/images/',
          // target: 'http://10.8.9.254:15053/api/',
          // target: 'http://kakaoco.kr/api/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/static\/images/, '')
        },
        '/api': {
          // target: 'http://61.111.133.143:15053/api/',
          target: 'http://38.180.95.46:15053/api/',
          // target: 'http://10.8.9.254:15053/api/',
          // target: 'http://kakaoco.kr/api/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        '/BT': {
          target: 'http://38.180.95.46:15053/BT/',
          // target: 'http://10.8.9.254:15053/BT/',
          // target: 'http://kakaoco.kr/BT/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/BT/, '')
        },
        '/popin_api': {
          target: 'http://38.180.95.46:15053/popin_api/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/popin_api/, '')
        },
        '/upload': {
          target: 'https://s2s.popin.cc/asset/upload',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/upload/, '')
        }
      },
      hmr: {
        overlay: false
      },
      host: '0.0.0.0'
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vue-types',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en',
        '@iconify/iconify',
        '@vueuse/core',
        'axios',
        'qs',
        'echarts',
        'echarts-wordcloud',
        'qrcode',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
        'vue-json-pretty',
        '@zxcvbn-ts/core',
        'dayjs',
        'mockjs'
      ]
    }
  }
}
