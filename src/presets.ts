import type { LinkType, TipLink } from './types'

interface Preset {
  label: string
  icon: string
  /** hostname(+path) fragments used for auto-detection */
  hosts: string[]
}

// Ordered by priority for the Korean market (수신 가능 + 송금 마찰 기준):
// 카카오페이 → 크티 → 투네이션 → GitHub Sponsors → 후원한잔 → 글로벌 레일.
export const PRESETS: Record<LinkType, Preset> = {
  kakaopay: { label: '카카오페이 송금', icon: '💛', hosts: ['qr.kakaopay.com', 'link.kakaopay.com'] },
  ctee: { label: '크티로 후원', icon: '☕', hosts: ['ctee.kr'] },
  toonation: { label: '투네이션 후원', icon: '🎁', hosts: ['toon.at'] },
  github: { label: 'GitHub Sponsors', icon: '💜', hosts: ['github.com/sponsors'] },
  hanzan: { label: '후원한잔', icon: '🍵', hosts: ['acoffee.shop'] },
  toss: { label: '토스로 보내기 (앱 필요)', icon: '💸', hosts: [] },
  buymeacoffee: { label: 'Buy Me a Coffee', icon: '☕', hosts: ['buymeacoffee.com'] },
  kofi: { label: 'Ko-fi', icon: '❤️', hosts: ['ko-fi.com'] },
  patreon: { label: 'Patreon', icon: '🎨', hosts: ['patreon.com'] },
  stripe: { label: 'Stripe', icon: '💳', hosts: ['buy.stripe.com', 'checkout.stripe.com'] },
  paypal: { label: 'PayPal', icon: '🅿️', hosts: ['paypal.com', 'paypal.me'] },
  custom: { label: '후원하기', icon: '🙌', hosts: [] },
}

// Korean payment rails churn (toss.me 2024-08 종료, Twip 2024-09 종료 등).
// Dead services render as a tombstone notice instead of a broken button.
const DEAD_HOSTS: Array<{ host: string; notice: string }> = [
  {
    host: 'toss.me',
    notice: '토스아이디(toss.me)는 2024-08-01 종료됐어요. 카카오페이 송금코드로 교체하세요.',
  },
  {
    host: 'twip.kr',
    notice: '트윕은 2024-09-30 서비스를 종료했어요. 투네이션 등으로 교체하세요.',
  },
]

export function findDeadNotice(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    const match = DEAD_HOSTS.find((d) => hostname === d.host || hostname.endsWith(`.${d.host}`))
    return match ? match.notice : null
  } catch {
    return null
  }
}

export function detectType(url: string): LinkType {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return 'custom'
  }
  // 토스 송금 딥링크 (supertoss://send?...) — hostname 기반 매칭이 불가능한 커스텀 스킴
  if (u.protocol === 'supertoss:') return 'toss'
  const normalized = u.hostname.replace(/^www\./, '') + u.pathname
  for (const [type, preset] of Object.entries(PRESETS) as Array<[LinkType, Preset]>) {
    if (preset.hosts.some((h) => normalized.startsWith(h))) return type
  }
  return 'custom'
}

export interface ResolvedLink {
  url: string
  type: LinkType
  label: string
  icon: string
  /** Set when the URL points at a discontinued service — render a notice, not a button. */
  deadNotice?: string
}

export function resolveLink(link: string | TipLink): ResolvedLink {
  const obj: TipLink = typeof link === 'string' ? { url: link } : link
  const type = obj.type ?? detectType(obj.url)
  const preset = PRESETS[type] ?? PRESETS.custom
  const deadNotice = findDeadNotice(obj.url)
  return {
    url: obj.url,
    type,
    label: obj.label ?? preset.label,
    icon: obj.icon ?? preset.icon,
    ...(deadNotice ? { deadNotice } : {}),
  }
}
