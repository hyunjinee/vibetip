// Re-points every examples/*/package.json "vibetip" range at the current
// package version. Runs as part of `npm run version-packages`, so the bump
// lands inside the changesets "Version Packages" PR.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const range = `^${version}`

const examplesDir = join(root, 'examples')
if (!existsSync(examplesDir)) process.exit(0)

for (const name of readdirSync(examplesDir)) {
  const manifestPath = join(examplesDir, name, 'package.json')
  if (!existsSync(manifestPath)) continue
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (!manifest.dependencies?.vibetip || manifest.dependencies.vibetip === range) continue
  manifest.dependencies.vibetip = range
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`examples/${name}: vibetip -> ${range}`)
}
