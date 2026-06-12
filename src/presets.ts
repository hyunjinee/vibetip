import type { LinkType, TipLink } from './types'

interface Preset {
  label: string
  icon: string
  /** hostname fragments used for auto-detection */
  hosts: string[]
}

export const PRESETS: Record<LinkType, Preset> = {
  buymeacoffee: { label: 'Buy Me a Coffee', icon: '☕', hosts: ['buymeacoffee.com'] },
  kofi: { label: 'Ko-fi', icon: '❤️', hosts: ['ko-fi.com'] },
  github: { label: 'GitHub Sponsors', icon: '💜', hosts: ['github.com/sponsors'] },
  patreon: { label: 'Patreon', icon: '🎨', hosts: ['patreon.com'] },
  stripe: { label: '카드로 후원하기', icon: '💳', hosts: ['buy.stripe.com', 'checkout.stripe.com'] },
  paypal: { label: 'PayPal', icon: '🅿️', hosts: ['paypal.com', 'paypal.me'] },
  toss: { label: '토스로 보내기', icon: '💸', hosts: ['toss.me', 'supertoss.com'] },
  kakaopay: { label: '카카오페이 송금', icon: '💛', hosts: ['qr.kakaopay.com', 'link.kakaopay.com'] },
  custom: { label: '후원하기', icon: '🙌', hosts: [] },
}

export function detectType(url: string): LinkType {
  let normalized: string
  try {
    const u = new URL(url)
    normalized = u.hostname.replace(/^www\./, '') + u.pathname
  } catch {
    return 'custom'
  }
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
}

export function resolveLink(link: string | TipLink): ResolvedLink {
  const obj: TipLink = typeof link === 'string' ? { url: link } : link
  const type = obj.type ?? detectType(obj.url)
  const preset = PRESETS[type] ?? PRESETS.custom
  return {
    url: obj.url,
    type,
    label: obj.label ?? preset.label,
    icon: obj.icon ?? preset.icon,
  }
}
