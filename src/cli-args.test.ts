import { expect, test } from 'bun:test'
import { parseArgs } from './cli-args'

test('플래그를 파싱한다', () => {
  const a = parseArgs(['--link', 'https://qr.kakaopay.com/x', '--name', '홍길동'])
  expect(a.link).toBe('https://qr.kakaopay.com/x')
  expect(a.name).toBe('홍길동')
})

test('-h는 help를 켠다', () => {
  expect(parseArgs(['-h']).help).toBe(true)
  expect(parseArgs(['--help']).help).toBe(true)
})

test('알 수 없는 옵션은 throw', () => {
  expect(() => parseArgs(['--nope', 'x'])).toThrow('unknown option')
})

test('값 없는 플래그는 throw', () => {
  expect(() => parseArgs(['--link'])).toThrow('missing value')
})

test('잘못된 theme은 throw', () => {
  expect(() => parseArgs(['--theme', 'blue'])).toThrow("'light' or 'dark'")
})
