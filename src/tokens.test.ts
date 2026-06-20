import { expect, test } from 'bun:test'
import { filterTokenEntries, parseTokens } from './tokens'

test('-- 접두 키만 통과시킨다', () => {
  expect(
    filterTokenEntries({ '--vt-bg': '#000', color: 'red', '--vt-radius': '8px' }),
  ).toEqual([
    ['--vt-bg', '#000'],
    ['--vt-radius', '8px'],
  ])
})

test('undefined와 빈 객체는 빈 배열', () => {
  expect(filterTokenEntries(undefined)).toEqual([])
  expect(filterTokenEntries({})).toEqual([])
})

test('-- 가 아닌 키만 있으면 빈 배열', () => {
  expect(filterTokenEntries({ color: 'red', background: 'blue' })).toEqual([])
})

test('parseTokens: 유효한 JSON 객체를 파싱한다', () => {
  expect(parseTokens('{"--vt-bg":"#000","--vt-radius":"8px"}')).toEqual({
    '--vt-bg': '#000',
    '--vt-radius': '8px',
  })
})

test('parseTokens: 잘못된 JSON은 undefined (위젯 안 깨짐)', () => {
  expect(parseTokens('{bad')).toBeUndefined()
})

test('parseTokens: 객체가 아니면 undefined', () => {
  expect(parseTokens('5')).toBeUndefined()
  expect(parseTokens('"x"')).toBeUndefined()
  expect(parseTokens('null')).toBeUndefined()
  expect(parseTokens('[1,2]')).toBeUndefined()
})

test('parseTokens: 빈 입력은 undefined', () => {
  expect(parseTokens(undefined)).toBeUndefined()
  expect(parseTokens('')).toBeUndefined()
})
