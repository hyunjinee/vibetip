import esbuild from 'esbuild'

const watch = process.argv.includes('--watch')

// ESM build for bundler users (import { init } from 'vibetip')
const esmOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/vibetip.js',
  minify: true,
  sourcemap: true,
}

// IIFE build for the script-tag drop-in (auto-inits from data attributes)
const iifeOptions = {
  entryPoints: ['src/embed.ts'],
  bundle: true,
  format: 'iife',
  globalName: 'VibeTip',
  outfile: 'dist/vibetip.iife.js',
  minify: true,
  sourcemap: true,
}

if (watch) {
  const ctxs = await Promise.all([esbuild.context(esmOptions), esbuild.context(iifeOptions)])
  await Promise.all(ctxs.map((c) => c.watch()))
  console.log('watching...')
} else {
  await Promise.all([esbuild.build(esmOptions), esbuild.build(iifeOptions)])
  console.log('built dist/vibetip.js + dist/vibetip.iife.js')
}
