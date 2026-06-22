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

test('mount은 비반응성 — 바꿔도 위젯을 옮기지 않는다 (read-once 계약)', () => {
  const a = document.createElement('div')
  const b = document.createElement('div')
  document.body.append(a, b)

  const { rerender } = render(createElement(VibeTip, { links: [URL], mount: a }))
  expect(a.querySelector('[data-vibetip-widget]')).not.toBeNull()

  rerender(createElement(VibeTip, { links: [URL], mount: b }))
  expect(a.querySelector('[data-vibetip-widget]')).not.toBeNull() // 그대로 a에
  expect(b.querySelector('[data-vibetip-widget]')).toBeNull() // b로 이동하지 않음
})

test('재생성 후에도 동일한 ref가 새 인스턴스를 제어한다', () => {
  const ref = createRef<VibeTipHandle>()
  const { rerender } = render(createElement(VibeTip, { links: [URL], name: 'A', ref }))
  const first = host()

  rerender(createElement(VibeTip, { links: [URL], name: 'B', ref }))
  const second = host()
  expect(second).not.toBe(first)

  ref.current!.open() // 재생성 전부터 들고 있던 ref가 새 인스턴스를 연다
  expect(second!.shadowRoot!.querySelector('.vt-root')!.classList.contains('vt-open')).toBe(true)
})

test('useVibeTip: 재생성 후에도 첫 핸들이 새 인스턴스를 제어한다', () => {
  const handles: VibeTipHandle[] = []
  function Harness({ name }: { name: string }) {
    handles.push(useVibeTip({ links: [URL], name }))
    return null
  }
  const { rerender } = render(createElement(Harness, { name: 'A' }))
  const first = host()

  rerender(createElement(Harness, { name: 'B' }))
  const second = host()
  expect(second).not.toBe(first)

  handles[0].open() // 첫 렌더에 받은 핸들
  expect(second!.shadowRoot!.querySelector('.vt-root')!.classList.contains('vt-open')).toBe(true)
})
