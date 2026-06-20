import { expect, test } from 'bun:test'
import { filterTokenEntries } from './tokens'

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
