import { resolveLink } from './presets'
import { CSS } from './styles'
import type { VibeTipInstance, VibeTipOptions } from './types'

const DEFAULT_ACCENT = '#FFDD00'

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

export function createWidget(options: VibeTipOptions): VibeTipInstance {
  if (!options || !Array.isArray(options.links) || options.links.length === 0) {
    throw new Error('[vibetip] options.links must contain at least one payment link')
  }

  const host = document.createElement('div')
  host.setAttribute('data-vibetip-widget', '')
  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = CSS
  shadow.appendChild(style)

  const root = el('div', 'vt-root')
  root.setAttribute('data-pos', options.position ?? 'bottom-right')
  shadow.appendChild(root)

  // Theme: explicit value wins; 'auto' tracks the OS scheme live
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const applyTheme = () => {
    const theme = options.theme ?? 'auto'
    const resolved = theme === 'auto' ? (media.matches ? 'dark' : 'light') : theme
    root.setAttribute('data-theme', resolved)
  }
  applyTheme()
  media.addEventListener('change', applyTheme)

  // Panel
  const panel = el('div', 'vt-panel')
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-label', options.name ?? 'Support')

  const closeBtn = el('button', 'vt-close', '✕')
  closeBtn.setAttribute('aria-label', 'Close')
  panel.appendChild(closeBtn)

  if (options.name) panel.appendChild(el('div', 'vt-name', options.name))
  panel.appendChild(
    el('div', 'vt-message', options.message ?? '이 프로젝트가 마음에 드셨다면 후원해 주세요!'),
  )

  const linksWrap = el('div', 'vt-links')
  for (const raw of options.links) {
    const link = resolveLink(raw)
    const a = el('a', 'vt-link')
    a.href = link.url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.appendChild(el('span', 'vt-link-emoji', link.icon))
    a.appendChild(el('span', undefined, link.label))
    a.appendChild(el('span', 'vt-link-arrow', '↗'))
    linksWrap.appendChild(a)
  }
  panel.appendChild(linksWrap)

  if (!options.hideBranding) {
    const footer = el('div', 'vt-footer')
    const brand = el('a', undefined, 'Powered by VibeTip')
    brand.href = 'https://github.com/vibetip/vibetip'
    brand.target = '_blank'
    brand.rel = 'noopener noreferrer'
    footer.appendChild(brand)
    panel.appendChild(footer)
  }
  root.appendChild(panel)

  // Floating button
  const fab = el('button', 'vt-fab')
  fab.style.background = options.accent ?? DEFAULT_ACCENT
  fab.setAttribute('aria-haspopup', 'dialog')
  fab.appendChild(el('span', 'vt-fab-emoji', '☕'))
  const buttonLabel = options.buttonLabel ?? 'Tip'
  if (buttonLabel) {
    fab.appendChild(el('span', undefined, buttonLabel))
  } else {
    fab.classList.add('vt-icon-only')
  }
  root.appendChild(fab)

  let isOpen = false
  const setOpen = (next: boolean) => {
    isOpen = next
    root.classList.toggle('vt-open', next)
    fab.setAttribute('aria-expanded', String(next))
  }

  fab.addEventListener('click', () => setOpen(!isOpen))
  closeBtn.addEventListener('click', () => setOpen(false))

  const onDocClick = (e: MouseEvent) => {
    if (isOpen && !e.composedPath().includes(host)) setOpen(false)
  }
  const onKeydown = (e: KeyboardEvent) => {
    if (isOpen && e.key === 'Escape') setOpen(false)
  }
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)

  document.body.appendChild(host)

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
