#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { extname } from 'node:path'
import { renderCardSvg } from './card'
import { parseArgs } from './cli-args'

const USAGE = `vibetip image — 카카오페이 후원 카드 이미지 생성

사용법:
  npx vibetip image --link <kakaopay-url> [옵션]

옵션:
  --link <url>          (필수) qr.kakaopay.com / link.kakaopay.com 송금 URL
  --out <path>          출력 경로 (기본: vibetip-card)
                        .svg → SVG만 / .png → PNG / 확장자 없음 → .svg(+가능하면 .png)
  --name <text>         카드에 표시할 이름
  --message <text>      메시지 한 줄
  --label <text>        라벨 (기본: 카카오페이로 후원)
  --accent <color>      포인트 색 (기본: #FFDD00)
  --theme <light|dark>  (기본: light)
  -h, --help            이 도움말`

const PNG_HINT = 'PNG를 만들려면 @resvg/resvg-js 가 필요합니다: npm i -D @resvg/resvg-js'

async function svgToPng(svg: string): Promise<Uint8Array | null> {
  try {
    const mod = await import('@resvg/resvg-js')
    return new mod.Resvg(svg).render().asPng()
  } catch (err) {
    const e = err as { code?: string; message?: string }
    if (e.code === 'ERR_MODULE_NOT_FOUND' || /Cannot find (module|package)/.test(e.message ?? '')) {
      return null
    }
    throw err
  }
}

export async function run(argv: string[]): Promise<void> {
  if (argv[0] !== 'image') {
    console.log(USAGE)
    return
  }
  const args = parseArgs(argv.slice(1))
  if (args.help) {
    console.log(USAGE)
    return
  }
  if (!args.link) {
    throw new Error(`--link 가 필요합니다.\n\n${USAGE}`)
  }

  const svg = renderCardSvg({
    url: args.link,
    name: args.name,
    message: args.message,
    label: args.label,
    accent: args.accent,
    theme: args.theme,
  })

  const out = args.out ?? 'vibetip-card'
  const ext = extname(out).toLowerCase()

  if (ext === '.svg') {
    writeFileSync(out, svg)
    console.log(`✓ ${out}`)
    return
  }
  if (ext === '.png') {
    const png = await svgToPng(svg)
    if (!png) throw new Error(PNG_HINT)
    writeFileSync(out, png)
    console.log(`✓ ${out}`)
    return
  }
  writeFileSync(`${out}.svg`, svg)
  console.log(`✓ ${out}.svg`)
  const png = await svgToPng(svg)
  if (png) {
    writeFileSync(`${out}.png`, png)
    console.log(`✓ ${out}.png`)
  } else {
    console.log(`(PNG 건너뜀) ${PNG_HINT}`)
  }
}

run(process.argv.slice(2)).catch((err) => {
  console.error(`[vibetip] ${err instanceof Error ? err.message : err}`)
  process.exit(1)
})
