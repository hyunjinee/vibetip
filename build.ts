// Bundles the library with Bun's native bundler (no esbuild dependency).
// Run: `bun run build.ts` (add --watch to rebuild on source changes).
import { watch } from 'node:fs'

const watching = process.argv.includes('--watch')

async function build() {
  // ESM build for bundler users (import { init } from 'vibetip')
  const esm = await Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    naming: 'vibetip.js',
    format: 'esm',
    minify: true,
    sourcemap: 'linked',
  })

  // IIFE build for the script-tag drop-in. embed.ts assigns globalThis.VibeTip
  // itself, so no bundler globalName option is needed.
  const iife = await Bun.build({
    entrypoints: ['src/embed.ts'],
    outdir: 'dist',
    naming: 'vibetip.iife.js',
    format: 'iife',
    minify: true,
    sourcemap: 'linked',
  })

  for (const result of [esm, iife]) {
    if (!result.success) {
      for (const log of result.logs) console.error(log)
      throw new AggregateError(result.logs, 'bun build failed')
    }
  }

  // Guard against a silently broken bundle. A correct build inlines the widget
  // (Shadow DOM) and lean-qr; a regression that externalizes ./index emits a
  // ~1.5KB shell with no widget code — exactly what shipped as 0.3.0's IIFE and
  // broke every CDN/script-tag user. Fail loudly before that can be published.
  for (const file of ['dist/vibetip.js', 'dist/vibetip.iife.js']) {
    const code = await Bun.file(file).text()
    if (code.length < 8000 || !code.includes('attachShadow')) {
      throw new Error(
        `[build] ${file} looks broken (${code.length} bytes, attachShadow: ${code.includes(
          'attachShadow',
        )}). The widget code was not bundled — refusing to emit a broken build.`,
      )
    }
  }

  console.log('built dist/vibetip.js + dist/vibetip.iife.js')
}

await build()

if (watching) {
  console.log('watching src/ ...')
  let timer: ReturnType<typeof setTimeout> | undefined
  watch('src', { recursive: true }, () => {
    clearTimeout(timer)
    timer = setTimeout(() => build().catch(console.error), 50)
  })
}
