import type { LinkType, TipLink } from './types'

const KAKAOPAY_HOSTS = new Set(['qr.kakaopay.com', 'link.kakaopay.com'])

export function detectType(url: string): LinkType {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'https:' && KAKAOPAY_HOSTS.has(parsed.hostname)) return 'kakaopay'
  } catch {
    // The shared error below gives callers one consistent failure message.
  }
  throw new Error(
    `[vibetip] unsupported payment link: ${url}. Only KakaoPay transfer links are supported.`,
  )
}

export interface ResolvedLink {
  url: string
  type: LinkType
  label: string
  icon?: string
}

export function resolveLink(link: string | TipLink): ResolvedLink {
  const obj: TipLink = typeof link === 'string' ? { url: link } : link
  const type = detectType(obj.url)
  return {
    url: obj.url,
    type,
    label: obj.label ?? '카카오페이 송금',
    icon: obj.icon,
  }
}
