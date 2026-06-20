import { afterEach, beforeEach, expect, test } from 'bun:test'
import { createWidget } from './widget'

const URL = 'https://qr.kakaopay.com/x'

beforeEach(() => {
  document.body.innerHTML = ''
})
afterEach(() => {
  document.body.innerHTML = ''
})

function host(): HTMLElement {
  const el = document.body.querySelector<HTMLElement>('[data-vibetip-widget]')
  if (!el) throw new Error('host not found')
  return el
}

test('shadowRoot에 part 속성 4개를 노출한다 (floating)', () => {
  const inst = createWidget({ links: [URL] })
  const sr = host().shadowRoot
  expect(sr).not.toBeNull()
  expect(sr?.querySelector('[part="panel"]')).not.toBeNull()
  expect(sr?.querySelector('[part="fab"]')).not.toBeNull()
  expect(sr?.querySelector('[part="close"]')).not.toBeNull()
  expect(sr?.querySelector('[part="link"]')).not.toBeNull()
  inst.destroy()
})

test('theme=dark면 host에 data-theme=dark', () => {
  const inst = createWidget({ links: [URL], theme: 'dark' })
  expect(host().getAttribute('data-theme')).toBe('dark')
  inst.destroy()
})

test('tokens는 -- 키만 host 인라인에 적용한다', () => {
  const inst = createWidget({ links: [URL], tokens: { '--vt-bg': '#000', color: 'red' } })
  expect(host().style.getPropertyValue('--vt-bg')).toBe('#000')
  expect(host().style.color).toBe('')
  inst.destroy()
})

test('accent는 지정 시에만 host 인라인에 설정한다', () => {
  const a = createWidget({ links: [URL] })
  expect(host().style.getPropertyValue('--vt-accent')).toBe('')
  a.destroy()

  const b = createWidget({ links: [URL], accent: '#111' })
  expect(host().style.getPropertyValue('--vt-accent')).toBe('#111')
  b.destroy()
})
