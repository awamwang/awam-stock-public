import { join } from 'node:path'
import { rmSync } from 'node:fs'
import { defineConfig, Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import Vue from '@vitejs/plugin-vue'
// import Eslint from 'vite-plugin-eslint'
import Legacy from '@vitejs/plugin-legacy'
import Inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import pkg from './package.json'
import { electronPlugins, useNodeJsInElectronRenderer } from './vite.config.electron'

// import startSocketServer from './src/server/socket'
const isDevlopment = process.env.NODE_ENV !== 'production'
const isKraken = process.env.KRAKEN === 'true'

let krakenRollupOptions = {}
const fullElectronPlugins: any[] = []
if (isKraken) {
  krakenRollupOptions = {
    input: 'src/main.ts',
    format: 'cjs',
    output: {
      entryFileNames: `[name].js`,
      manualChunks: {},
    },
  }
} else {
  if (process.env.NO_ELECTRON !== 'true') {
    if (!isKraken) {
      fullElectronPlugins.push(
        /**
         * Electron-Config
         */
        ...electronPlugins
        // useNodeJsInElectronRenderer()
      )
    }
  } else {
    // startSocketServer()
  }
}
const devPlugins: Array<Plugin> = []
if (isDevlopment) {
  devPlugins.push(
    tsconfigPaths(),
    Inspect()
    // Eslint({
    //   exclude: ['**/packages/shared/**', '**/packages/model/**', /node_modules/],
    // })
  )
}

rmSync('dist', { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  envDir: join(__dirname, 'envs'),
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      '@C': join(__dirname, 'src/components/'),
      '@V': join(__dirname, 'src/views'),
      '@U': join(__dirname, 'src/utils'),
    },
  },
  plugins: [
    Vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: [
        // presets
        'vue',
        'vue-router',
        'pinia',
        // custom
        {
          vue: ['withDefaults', 'defineProps', 'defineEmits'],
          axios: [
            // default imports
            ['default', 'axios'], // import { default as axios } from 'axios',
          ],
          'vue-class-component': ['Vue', ['Options', 'VueOptions'], ['Vue', 'VueClass'], ['mixins', 'vueMixin']],
          '@awamwang/vue-socket.io-extended/decorator': [['default', 'Socket']],
          '@awamstock/shared/browser': ['_'],
          '@/stores/global': ['useGlobalStore'],
          '@/stores/block': ['useBlockStore'],
          '@/stores/environment': ['useEnvironmentStore'],
          '@/stores/ding-pan': ['useDingPanStore'],
          '@/stores/stock-pool': ['useStockPoolStore'],
          '@/composables/func/useNotify': [['default', 'useNotify']],
        },
      ],
      dirs: [],
      dts: './typings/auto-imports.d.ts',
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      dirs: ['src/components'],
      dts: './typings/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    Legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
    }),
    ...devPlugins,
    ...fullElectronPlugins,
  ],
  // esbuild: {
  //   // tsconfig: './tsconfig.build.json',
  // },
  optimizeDeps: {},
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
  build: {
    // emptyOutDir: true,
    sourcemap: isDevlopment ? 'inline' : false,
    ...(isKraken ? { minify: true, outDir: './dist-kraken', target: 'modules', rollupOptions: krakenRollupOptions } : {}),
  },
})
