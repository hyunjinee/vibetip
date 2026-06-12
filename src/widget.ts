import { resolveLink } from './presets'
import { CSS } from './styles'
import type { VibeTipInstance, VibeTipOptions } from './types'

const DEFAULT_ACCENT = '#FFDD00'
const REPO_URL = 'https://github.com/hyunjinee/vibetip'

// 이모지 대신 inline SVG — OS별 렌더링 차이가 없고 currentColor로 accent에 자동 대응.
// 열림 상태의 ✕ 전환은 CSS(.vt-fab::after)가 처리한다.
const ICON_SPARK =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2l2.6 6.9L22 12l-7.4 3.1L12 22l-2.6-6.9L2 12l7.4-3.1z"/></svg>'

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
  root.style.setProperty('--vt-accent', options.accent ?? DEFAULT_ACCENT)
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
  panel.setAttribute('role', inline ? 'region' : 'dialog')
  panel.setAttribute('aria-label', options.name ?? 'Support')

  let closeBtn: HTMLButtonElement | null = null
  if (!inline) {
    closeBtn = el('button', 'vt-close', '✕')
    closeBtn.setAttribute('aria-label', 'Close')
    panel.appendChild(closeBtn)
  }

  if (options.name) panel.appendChild(el('div', 'vt-name', options.name))
  panel.appendChild(
    el('div', 'vt-message', options.message ?? '이 프로젝트가 마음에 드셨다면 후원해 주세요!'),
  )

  const linksWrap = el('div', 'vt-links')
  for (const raw of options.links) {
    const link = resolveLink(raw)
    if (link.deadNotice) {
      // 종료된 서비스 링크: 깨진 버튼 대신 교체 안내를 보여준다
      console.warn(`[vibetip] dead payment link (${link.url}): ${link.deadNotice}`)
      const dead = el('div', 'vt-link vt-dead')
      dead.appendChild(el('span', 'vt-link-emoji', '⚠️'))
      dead.appendChild(el('span', undefined, link.deadNotice))
      linksWrap.appendChild(dead)
      continue
    }
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
    brand.href = REPO_URL
    brand.target = '_blank'
    brand.rel = 'noopener noreferrer'
    footer.appendChild(brand)
    panel.appendChild(footer)
  }
  root.appendChild(panel)

  // Floating button (floating 모드 전용)
  let fab: HTMLButtonElement | null = null
  let fabEmoji: HTMLSpanElement | null = null
  if (!inline) {
    fab = el('button', 'vt-fab')
    fab.setAttribute('aria-haspopup', 'dialog')
    fabEmoji = el('span', 'vt-fab-emoji')
    fabEmoji.innerHTML = ICON_SPARK
    fab.appendChild(fabEmoji)
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
    if (!next && refocus) fab!.focus()
  }

  fab?.addEventListener('click', () => setOpen(!isOpen))
  closeBtn?.addEventListener('click', () => setOpen(false, true))

  const onDocClick = (e: MouseEvent) => {
    if (isOpen && !e.composedPath().includes(host)) setOpen(false)
  }
  const onKeydown = (e: KeyboardEvent) => {
    if (isOpen && e.key === 'Escape') setOpen(false, true)
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
