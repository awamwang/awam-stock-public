import path from 'path'
import esbuild, { BuildOptions } from 'esbuild'
import { copy } from 'esbuild-plugin-copy'
import { exec, execSync } from 'child_process'
import rimraf from 'rimraf'

export function copyFiles(subPath = '', copyOptions: BuildOptions = {}) {
  esbuild
    .build({
      outdir: `dist`,
      plugins: [
        copy({
          // resolveFrom: 'cwd',
          assets: {
            from: ['./src/locales/*.json'],
            to: ['./locales/'],
          },
          keepStructure: true,
        }),
        copy({
          // resolveFrom: 'cwd',
          assets: {
            from: ['./src/locales/*'],
            to: ['./esm/locales'],
            keepStructure: true,
          },
        }),
      ],
      ...copyOptions,
    })
    .catch(() => process.exit(1))

  rimraf.sync('dist/*.json')
  rimraf.sync('dist/esm/*.json')
}

// let watch = false
// if (process.argv.length) {
//   if (process.argv.includes('-w')) {
//     watch = true
//   }
// }

// export default function build(options: { baseDir: string; subPaths?: string[]; buildIsolate?: boolean; cjsOptions?: BuildOptions; esmOptions?: BuildOptions }) {
//   const { baseDir, subPaths = [''], buildIsolate, cjsOptions, esmOptions } = options

//   const commonOptions: BuildOptions = {
//     bundle: true,
//     watch,
//     external: ['./node_modules/*'],
//     platform: 'node',
//     loader: {
//       '.ts': 'ts',
//     },
//     tsconfig: path.resolve(baseDir, '../tsconfig.build.json'),
//     treeShaking: true,
//     sourcemap: 'linked',
//   }

//   function buildCjs(subPath = '', cjsOptions: BuildOptions = {}) {
//     esbuild
//       .build({
//         ...commonOptions,
//         format: 'cjs',
//         entryPoints: [path.resolve(baseDir, `../src${subPath}/index.ts`)],
//         outfile: `dist${subPath}/index.cjs.js`,
//         ...cjsOptions,
//       })
//       .catch(() => process.exit(1))
//   }

//   function buildEsm(subPath = '', esmOptions: BuildOptions = {}) {
//     esbuild
//       .build({
//         ...commonOptions,
//         entryPoints: [path.resolve(baseDir, `../src${subPath}/index.ts`)],
//         format: 'esm',
//         outfile: `dist${subPath}/index.esm.js`,
//         ...esmOptions,
//       })
//       .catch(() => process.exit(1))
//   }

//   function buildBrowser(subPath = '') {
//     esbuild
//       .build({
//         ...commonOptions,
//         entryPoints: [path.resolve(baseDir, `../src${subPath}/index.ts`)],
//         minify: true,
//         outfile: `dist${subPath}/index.broswer.js`,
//       })
//       .catch(() => process.exit(1))
//   }

//   if (watch) {
//     console.log('Watching...')
//     exec('tsc -w -p tsconfig.build.json')
//   } else {
//     console.log('Compile ts...')
//     execSync('tsc -p tsconfig.build.json --emitDeclarationOnly')
//     if (buildIsolate) {
//       execSync('tsc -p tsconfig.isolate.json')
//     }
//   }

//   subPaths.forEach((subPath) => {
//     buildCjs(subPath, cjsOptions)
//   })
//   subPaths.forEach((subPath) => {
//     buildEsm(subPath, esmOptions)
//   })
//   subPaths.forEach(buildBrowser)
// }
