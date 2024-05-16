import { join } from 'path'
import { builtinModules } from 'module'
// import renderer from 'vite-plugin-electron/renderer'
import electron, { defineConfig } from 'vite-plugin-electron'
import resolve from 'vite-plugin-resolve'
import lib2esm from 'lib-esm'
// import { nodeResolve } from '@rollup/plugin-node-resolve'xR
// import esmodule from 'vite-plugin-esmodule'
import _ from '@awamstock/shared'
import pkg from './package.json'

// const NodeDependencies = ['ffi-napi', 'ref-napi', 'ref-struct-di', 'ref-wchar-napi', 'xlsx', 'fs-extra', 'dot-env', 'socket.io', 'koa', 'koa-router']
const NodeDependencies = ['socket.io', 'koa', 'koa-router']
// const NeedCompileDependencies = ['element-plus', 'dayjs']
const dependencies = Object.keys(pkg.dependencies || {})
// const dependencies = Object.keys(pkg.dependencies || {}).filter((d) => !NeedCompileDependencies.includes(d))
// const dependencies = Object.keys(pkg.dependencies || {}).filter((d) => !NodeDependencies.includes(d))

const external = [
  'electron',
  ...builtinModules,
  // (🎯-①): For use Node.js package in Electron-Main, Preload-Script
  ...dependencies,
]
// console.log(external)

export function useNodeJsInElectronRenderer() {
  const entries = NodeDependencies.reduce((memo, moduleId) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const members = Object.keys(require(moduleId))
    const snippet_of_cjs2esm = lib2esm({
      // CJS lib name
      require: moduleId,
      // export memebers
      exports: members,
      // { format: 'cjs' }
    })
    return Object.assign(memo, { [moduleId]: snippet_of_cjs2esm })
  }, {} as Parameters<typeof resolve>[0])

  // (🎯-②): For use Node.js package in Electron-Renderer
  return resolve(entries)
}

export const electronPlugins = [
  electron([
    {
      entry: join(__dirname, 'electron/main/index.ts'),
      vite: {
        build: {
          // For debug
          sourcemap: 'inline',
          outDir: join(__dirname, 'dist/electron/main'),
          rollupOptions: {
            external,
          },
        },
      },
    },
    {
      entry: join(__dirname, 'electron/preload/index.ts'),
      vite: {
        build: {
          // For debug
          sourcemap: 'inline',
          outDir: join(__dirname, 'dist/electron/preload'),
          rollupOptions: {
            external,
          },
        },
      },
    },
    // Enables use of Node.js API in the Renderer-process
    // renderer: {},
  ]),
]

export const electronPlugins1 = [
  // useNodeJsInElectronRenderer(),
  // nodeResolve(),
  // esmodule([
  //   'execa',
  //   // '@awamstock/model',
  //   // '@awamstock/shared',
  //   // 🌱 this means that you have explicit specified the entry file
  //   // { 'file-type': 'file-type/index.js' },
  // ]),
]
