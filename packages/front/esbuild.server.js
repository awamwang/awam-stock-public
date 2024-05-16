const { rmSync } = require('fs')
const esbuild = require('esbuild')

// Automatically exclude all node_modules from the bundled version
// const { nodeExternalsPlugin } = require('esbuild-node-externals')

rmSync('public/server/', {
  recursive: true,
  force: true,
})

esbuild.build({
  entryPoints: ['src/server/index.ts'],
  outfile: 'public/server/index.js',
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: true,
  target: 'node16',
  plugins: []
}).catch((err) => {
  console.log(err)
  process.exit(1)
})