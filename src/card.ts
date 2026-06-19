import { correction, generate } from 'lean-qr'
import { detectType } from './presets'

export interface CardOptions {
  /** 검증된 카카오페이 송금 URL */
  url: string
  name?: string
  message?: string
  /** 기본: "카카오페이로 후원" */
  label?: string
  /** 기본: #FFDD00 */
  accent?: string
  /** 기본: light */
  theme?: 'light' | 'dark'
}

const THEMES = {
  light: { bg: '#ffffff', text: '#191f28', sub: '#6b7684', border: '#02204714', brand: '#8b95a1' },
  dark: { bg: '#202228', text: '#f2f4f6', sub: '#b0b8c1', border: '#ffffff1a', brand: '#7d8692' },
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ESCAPES[c])
}

function qrPath(url: string): { path: string; size: number } {
  const code = generate(url, { minCorrectionLevel: correction.M })
  const size = code.size
  let path = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (code.get(x, y)) path += `M${x} ${y}h1v1h-1z`
    }
  }
  return { path, size }
}

const W = 420
// 폰트 패밀리 안의 따옴표는 속성값(이중따옴표) 안에 들어가므로 미리 이스케이프한다.
const FONT =
  '-apple-system, BlinkMacSystemFont, &quot;Apple SD Gothic Neo&quot;, &quot;Noto Sans KR&quot;, sans-serif'

export function renderCardSvg(opts: CardOptions): string {
  detectType(opts.url) // 카카오페이가 아니면 throw
  const t = THEMES[opts.theme === 'dark' ? 'dark' : 'light']
  const accent = opts.accent ?? '#FFDD00'
  const label = opts.label ?? '카카오페이로 후원'
  const { path, size } = qrPath(opts.url)

  const frame = 236
  const frameX = (W - frame) / 2
  const frameY = 28
  const inner = 212
  const innerOffset = (frame - inner) / 2
  const quiet = 2

  const parts: string[] = []
  let cursor = frameY + frame + 40

  if (opts.name) {
    parts.push(
      `<text x="${W / 2}" y="${cursor}" text-anchor="middle" font-size="24" font-weight="800" fill="${t.text}">${esc(opts.name)}</text>`,
    )
    cursor += 34
  }
  if (opts.message) {
    parts.push(
      `<text x="${W / 2}" y="${cursor}" text-anchor="middle" font-size="15" fill="${t.sub}">${esc(opts.message)}</text>`,
    )
    cursor += 30
  }

  cursor += 8
  const pillH = 48
  const pillX = 36
  const pillW = W - pillX * 2
  parts.push(
    `<rect x="${pillX}" y="${cursor}" width="${pillW}" height="${pillH}" rx="14" fill="${esc(accent)}"/>` +
      `<text x="${W / 2}" y="${cursor + pillH / 2 + 6}" text-anchor="middle" font-size="17" font-weight="800" fill="#191f28">${esc(label)}</text>`,
  )
  cursor += pillH + 30

  parts.push(
    `<text x="${W / 2}" y="${cursor}" text-anchor="middle" font-size="12" fill="${t.brand}">Powered by VibeTip</text>`,
  )
  cursor += 24

  const H = cursor

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">` +
    `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="28" fill="${t.bg}" stroke="${t.border}"/>` +
    `<rect x="${frameX}" y="${frameY}" width="${frame}" height="${frame}" rx="20" fill="#ffffff" stroke="${t.border}"/>` +
    `<svg x="${frameX + innerOffset}" y="${frameY + innerOffset}" width="${inner}" height="${inner}" viewBox="${-quiet} ${-quiet} ${size + quiet * 2} ${size + quiet * 2}" shape-rendering="crispEdges">` +
    `<path d="${path}" fill="#111111"/></svg>` +
    parts.join('') +
    `</svg>`
  )
}
