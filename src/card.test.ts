import { expect, test } from 'bun:test'
import { renderCardSvg } from './card'

const URL = 'https://qr.kakaopay.com/Ej8TSKM4J'

test('유효한 svg를 반환한다', () => {
  const svg = renderCardSvg({ url: URL })
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg.trimEnd().endsWith('</svg>')).toBe(true)
})

test('QR path를 포함한다', () => {
  const svg = renderCardSvg({ url: URL })
  expect(svg).toContain('<path')
  expect(svg).toMatch(/d="M\d+ \d+h1v1h-1z/)
})

test('이름과 메시지를 이스케이프한다', () => {
  const svg = renderCardSvg({ url: URL, name: '<script>', message: 'a & b' })
  expect(svg).not.toContain('<script>')
  expect(svg).toContain('&lt;script&gt;')
  expect(svg).toContain('a &amp; b')
})

test('카카오페이가 아닌 링크는 거부한다', () => {
  expect(() => renderCardSvg({ url: 'https://paypal.me/x' })).toThrow('unsupported payment link')
})

test('다크 테마는 라이트와 다르다', () => {
  const light = renderCardSvg({ url: URL, theme: 'light' })
  const dark = renderCardSvg({ url: URL, theme: 'dark' })
  expect(light).not.toBe(dark)
})
