import { correction, generate } from 'lean-qr'
import { toSvg } from 'lean-qr/extras/svg'
import { resolveLink } from './presets'
import { CSS } from './styles'
import { filterTokenEntries } from './tokens'
import type { VibeTipInstance, VibeTipOptions } from './types'

const REPO_URL = 'https://github.com/hyunjinee/vibetip'

const ICON_ARROW =
  '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M6 14L14 6M8 6h6v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const ICON_QR =
  '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="3" width="5.5" height="5.5" rx="1.2"/><rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2"/><rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2"/><rect x="12.25" y="12.25" width="4" height="4" rx="1"/></svg>'
const ICON_KAKAOPAY =
  '<svg viewBox="0 0 34 34" width="24" height="24" aria-hidden="true"><path d="M17 3.5C9.27 3.5 3 8.51 3 14.7c0 4 2.62 7.5 6.56 9.48l-1.4 4.2c-.17.5.4.9.82.62l5-3.35c.98.18 2 .27 3.02.27 7.73 0 14-5.02 14-11.21C31 8.5 24.73 3.5 17 3.5Z" fill="currentColor"/></svg>'

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

function isMobileDevice(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  const ua = navigator.userAgent
  return (
    nav.userAgentData?.mobile === true ||
    /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  )
}

export function createWidget(options: VibeTipOptions): VibeTipInstance {
  if (!options || !Array.isArray(options.links) || options.links.length === 0) {
    throw new Error('[vibetip] options.links must contain at least one KakaoPay transfer link')
  }
  const links = options.links.map(resolveLink)

  // mount가 주어지면 인라인 카드 모드, 아니면 플로팅 버튼 모드
  const mountTarget = options.mount
    ? typeof options.mount === 'string'
      ? document.querySelector<HTMLElement>(options.mount)
      : options.mount
    : null
  if (options.mount && !mountTarget) {
    throw new Error(`[vibetip] mount target not found: ${String(options.mount)}`)
  }
  const inline = mountTarget != null

  const host = document.createElement('div')
  host.setAttribute('data-vibetip-widget', '')
  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = CSS
  shadow.appendChild(style)

  const root = el('div', 'vt-root')
  root.setAttribute('data-pos', options.position ?? 'bottom-right')
  root.setAttribute('data-mode', inline ? 'inline' : 'floating')
  // Accent + token overrides go on the host element (not .vt-root) so they win
  // over the :host token defaults and over both themes, while ambient page CSS
  // stays isolated. Only set accent when given, so the CSS default / a CSS
  // override survives when it isn't.
  if (options.accent) host.style.setProperty('--vt-accent', options.accent)
  for (const [key, value] of filterTokenEntries(options.tokens)) {
    host.style.setProperty(key, value)
  }
  shadow.appendChild(root)

  // Theme: explicit value wins; 'auto' tracks the OS scheme live
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const applyTheme = () => {
    const theme = options.theme ?? 'auto'
    const resolved = theme === 'auto' ? (media.matches ? 'dark' : 'light') : theme
    host.setAttribute('data-theme', resolved)
  }
  applyTheme()
  media.addEventListener('change', applyTheme)

  // Panel
  const panel = el('div', 'vt-panel')
  panel.setAttribute('part', 'panel')
  panel.setAttribute('role', inline ? 'region' : 'dialog')
  panel.setAttribute('aria-label', options.name ?? 'Support')

  let closeBtn: HTMLButtonElement | null = null
  if (!inline) {
    closeBtn = el('button', 'vt-close', '✕')
    closeBtn.setAttribute('part', 'close')
    closeBtn.setAttribute('aria-label', 'Close')
    panel.appendChild(closeBtn)
  }

  const header = el('div', 'vt-header')
  const heading = el('div', 'vt-heading')
  heading.appendChild(el('div', 'vt-eyebrow', 'VibeTip'))
  if (options.name) heading.appendChild(el('div', 'vt-name', options.name))
  heading.appendChild(
    el('div', 'vt-message', options.message ?? '이 프로젝트가 마음에 드셨다면 후원해 주세요!'),
  )
  header.appendChild(heading)
  panel.appendChild(header)

  const linksWrap = el('div', 'vt-links')
  const qrView = el('div', 'vt-qr-view')
  qrView.hidden = true

  const qrBack = el('button', 'vt-qr-back', '← 송금 방법으로 돌아가기')
  qrBack.type = 'button'
  const qrCode = el('div', 'vt-qr-code')
  const qrTitle = el('div', 'vt-qr-title', '휴대폰으로 QR을 스캔하세요')
  const qrHint = el(
    'div',
    'vt-qr-hint',
    '기본 카메라나 카카오톡 코드스캔으로 찍으면 카카오페이 송금 화면이 열립니다.',
  )
  qrView.append(qrBack, qrCode, qrTitle, qrHint)

  let activeQrTrigger: HTMLButtonElement | null = null
  const hideQr = (refocus = false) => {
    qrView.hidden = true
    linksWrap.hidden = false
    if (refocus) activeQrTrigger?.focus()
    activeQrTrigger = null
  }
  const showQr = (url: string, trigger: HTMLButtonElement) => {
    const svg = toSvg(generate(url, { minCorrectionLevel: correction.M }), document, {
      width: 208,
      height: 208,
      pad: 4,
      on: '#111111',
      off: '#ffffff',
    })
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', '카카오페이 송금 QR코드')
    qrCode.replaceChildren(svg)
    activeQrTrigger = trigger
    linksWrap.hidden = true
    qrView.hidden = false
    qrBack.focus()
  }

  const mobileDevice = isMobileDevice()
  for (const link of links) {
    let paymentControl: HTMLAnchorElement | HTMLButtonElement
    const desktopKakaoPay = link.type === 'kakaopay' && !mobileDevice
    if (desktopKakaoPay) {
      const button = el('button', 'vt-link')
      button.type = 'button'
      button.setAttribute('aria-label', `${link.label} QR코드 보기`)
      button.addEventListener('click', () => showQr(link.url, button))
      paymentControl = button
    } else {
      const anchor = el('a', 'vt-link')
      anchor.href = link.url
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      paymentControl = anchor
    }

    paymentControl.dataset.type = link.type
    paymentControl.setAttribute('part', 'link')
    const paymentIcon = el('span', 'vt-link-emoji')
    if (link.icon) paymentIcon.textContent = link.icon
    else paymentIcon.innerHTML = ICON_KAKAOPAY
    paymentControl.appendChild(paymentIcon)
    paymentControl.appendChild(el('span', 'vt-link-label', link.label))
    const arrow = el('span', 'vt-link-arrow')
    arrow.innerHTML = desktopKakaoPay ? ICON_QR : ICON_ARROW
    paymentControl.appendChild(arrow)
    linksWrap.appendChild(paymentControl)
  }
  panel.appendChild(linksWrap)
  panel.appendChild(qrView)
  qrBack.addEventListener('click', () => hideQr(true))

  if (!options.hideBranding) {
    const footer = el('div', 'vt-footer')
    const brand = el('a', undefined, 'Powered by VibeTip')
    brand.href = REPO_URL
    brand.target = '_blank'
    brand.rel = 'noopener noreferrer'
    footer.appendChild(brand)
    panel.appendChild(footer)
  }
  root.appendChild(panel)

  // Floating button (floating 모드 전용)
  let fab: HTMLButtonElement | null = null
  if (!inline) {
    fab = el('button', 'vt-fab')
    fab.setAttribute('part', 'fab')
    fab.setAttribute('aria-haspopup', 'dialog')
    const buttonLabel = options.buttonLabel ?? 'Tip'
    if (buttonLabel) {
      fab.appendChild(el('span', 'vt-fab-label', buttonLabel))
    } else {
      fab.classList.add('vt-icon-only')
    }
    fab.setAttribute('aria-expanded', 'false')
    root.appendChild(fab)
  }

  let isOpen = inline
  if (inline) root.classList.add('vt-open')

  const setOpen = (next: boolean, refocus = false) => {
    if (inline) return // 인라인 카드는 항상 펼쳐져 있다
    isOpen = next
    root.classList.toggle('vt-open', next)
    fab!.setAttribute('aria-expanded', String(next))
    if (!next) hideQr()
    if (!next && refocus) fab!.focus()
  }

  fab?.addEventListener('click', () => setOpen(!isOpen))
  closeBtn?.addEventListener('click', () => setOpen(false, true))

  const onDocClick = (e: MouseEvent) => {
    if (isOpen && !e.composedPath().includes(host)) setOpen(false)
  }
  const onKeydown = (e: KeyboardEvent) => {
    if (isOpen && e.key === 'Escape') {
      if (!qrView.hidden) hideQr(true)
      else setOpen(false, true)
    }
  }
  if (!inline) {
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKeydown)
  }

  ;(mountTarget ?? document.body).appendChild(host)

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy: () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKeydown)
      media.removeEventListener('change', applyTheme)
      host.remove()
    },
  }
}
