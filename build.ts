// Bundles the library with Bun's native bundler (no esbuild dependency).
// Run: `bun run build.ts` (add --watch to rebuild on source changes).
import { chmodSync, readFileSync, watch, writeFileSync } from 'node:fs'

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

  // CLI build (bin: `vibetip`). @resvg/resvg-js stays external so it is loaded
  // dynamically at runtime only when present.
  const cli = await Bun.build({
    entrypoints: ['src/cli.ts'],
    outdir: 'dist',
    naming: 'cli.js',
    format: 'esm',
    target: 'node',
    external: ['@resvg/resvg-js'],
    minify: true,
    sourcemap: 'linked',
  })

  // React wrapper bundle (vibetip/react). React stays external — never bundled —
  // so the core keeps zero runtime dependencies and React users reuse their copy.
  const react = await Bun.build({
    entrypoints: ['src/react.ts'],
    outdir: 'dist',
    naming: 'react.js',
    format: 'esm',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    minify: true,
    sourcemap: 'linked',
    // Minification strips the source's top-of-file directive, so re-inject it as
    // a banner — the built module must start with "use client" to be a Client
    // Component under Next.js App Router / RSC. Guarded below.
    banner: '"use client";',
  })

  for (const result of [esm, iife, cli, react]) {
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

  // The React wrapper must keep its 'use client' directive at the very top so it
  // works as a Client Component under Next.js App Router / RSC; minifiers can
  // strip or relocate top-of-file directives, so fail loudly if it's gone.
  const reactCode = await Bun.file('dist/react.js').text()
  if (!reactCode.startsWith('"use client"') && !reactCode.startsWith("'use client'")) {
    throw new Error(
      `[build] dist/react.js is missing the leading "use client" directive (starts with: ${reactCode.slice(0, 40)}).`,
    )
  }

  // dist/cli.js is the `vibetip` bin: ensure a shebang and the executable bit.
  const cliPath = 'dist/cli.js'
  const cliCode = readFileSync(cliPath, 'utf8')
  if (!cliCode.startsWith('#!')) {
    writeFileSync(cliPath, `#!/usr/bin/env node\n${cliCode}`)
  }
  chmodSync(cliPath, 0o755)

  console.log('built dist/vibetip.js + dist/vibetip.iife.js + dist/cli.js + dist/react.js')
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
