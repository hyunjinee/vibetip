import { afterEach, beforeEach, expect, test } from 'bun:test'
import { cleanup, render } from '@testing-library/react'
import { createElement, createRef } from 'react'
import { type VibeTipHandle, VibeTip, useVibeTip } from './react'

const URL = 'https://qr.kakaopay.com/x'

beforeEach(() => {
  document.body.innerHTML = ''
})
afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

function host(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('[data-vibetip-widget]')
}

test('마운트하면 host가 생기고 언마운트하면 사라진다', () => {
  const { unmount } = render(createElement(VibeTip, { links: [URL] }))
  expect(host()).not.toBeNull()
  unmount()
  expect(host()).toBeNull()
})

test('ref.open()/close()가 패널을 토글한다', () => {
  const ref = createRef<VibeTipHandle>()
  render(createElement(VibeTip, { links: [URL], ref }))
  const root = host()!.shadowRoot!.querySelector('.vt-root')!
  expect(root.classList.contains('vt-open')).toBe(false)
  ref.current!.open()
  expect(root.classList.contains('vt-open')).toBe(true)
  ref.current!.close()
  expect(root.classList.contains('vt-open')).toBe(false)
})

test('같은 옵션이면 재생성 안 하고, 옵션이 바뀌면 재생성한다', () => {
  // links가 매 렌더 새 배열이어도 직렬화 키가 같으면 재생성하지 않아야 한다 (#1 버그 가드).
  const { rerender } = render(createElement(VibeTip, { links: [URL], name: 'A' }))
  const first = host()
  expect(first).not.toBeNull()

  rerender(createElement(VibeTip, { links: [URL], name: 'A' }))
  expect(host()).toBe(first)

  rerender(createElement(VibeTip, { links: [URL], name: 'B' }))
  expect(host()).not.toBe(first)
  expect(first!.isConnected).toBe(false)
})

test('useVibeTip: 핸들로 열고, 렌더 간 동일 참조, 언마운트 시 정리', () => {
  const handles: VibeTipHandle[] = []
  function Harness() {
    handles.push(useVibeTip({ links: [URL] }))
    return null
  }
  const { rerender, unmount } = render(createElement(Harness))
  expect(host()).not.toBeNull()

  const root = host()!.shadowRoot!.querySelector('.vt-root')!
  handles[0].open()
  expect(root.classList.contains('vt-open')).toBe(true)

  rerender(createElement(Harness))
  expect(handles[1]).toBe(handles[0])

  unmount()
  expect(host()).toBeNull()
})
