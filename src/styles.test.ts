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

test('QR 배경은 스캔 대비를 위해 #fff 고정이다 (토큰 아님)', () => {
  // A custom property here would leak ambient page CSS in (all:initial does not
  // reset custom properties), and the QR SVG paints white anyway — so it is a
  // hardcoded literal, not a token.
  expect(CSS).not.toContain('--vt-qr-bg')
  expect(CSS).toMatch(/\.vt-qr-code\{[^}]*background:#fff/)
})
