import { expect, test } from 'bun:test'
import { CSS } from './styles'

test('토큰 기본값을 :host에 선언한다', () => {
  // Tokens must live on :host (not .vt-root) so consumer overrides on the host
  // element win, while ambient :root tokens stay isolated.
  expect(CSS).toContain(':host{')
  expect(CSS).toMatch(/:host\{[^}]*--vt-bg:/)
  expect(CSS).toMatch(/:host\{[^}]*--vt-accent:/)
})

test('다크 토큰을 :host([data-theme=dark])에 선언한다', () => {
  expect(CSS).toContain(':host([data-theme=dark])')
  expect(CSS).not.toContain('.vt-root[data-theme=dark]')
})

test('--vt-radius 토큰을 정의하고 패널에 사용한다', () => {
  expect(CSS).toContain('--vt-radius:')
  expect(CSS).toContain('var(--vt-radius)')
  // No hardcoded 28px panel radius literal anymore.
  expect(CSS).not.toMatch(/\.vt-panel\{[^}]*border-radius:28px/)
})

test('QR 배경을 토큰(fallback #fff)으로 둔다', () => {
  expect(CSS).toContain('var(--vt-qr-bg,#fff)')
})
