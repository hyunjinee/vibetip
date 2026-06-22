'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { init } from './index.js'
import type { VibeTipInstance, VibeTipOptions } from './types.js'

export type VibeTipProps = VibeTipOptions
export type VibeTipHandle = Pick<VibeTipInstance, 'open' | 'close'>

// `mount` is excluded from the key: an HTMLElement isn't serializable, and a
// string selector is intentionally treated the same. Consequence: `mount` is
// read once at first init and is NOT reactive — changing it later does not move
// the widget (remount via a React `key` if you need a different target).
// Everything else (links, tokens, …) is serialized, so the widget re-initializes
// only on a material change — not on every parent render that passes a fresh
// options object/array (the #1 bug these wrappers hit).
function optionsKey(options: VibeTipOptions): string {
  const { mount, ...rest } = options
  return JSON.stringify(rest)
}

/**
 * Mounts a VibeTip widget for its lifetime. Props are the same `VibeTipOptions`
 * as `init()`. The widget mounts itself to `document.body` (or `mount`), so this
 * renders nothing. Hold a ref to call `open()` / `close()` imperatively.
 */
export const VibeTip = forwardRef<VibeTipHandle, VibeTipProps>(function VibeTip(props, ref) {
  const instanceRef = useRef<VibeTipInstance | null>(null)
  const key = optionsKey(props)

  useEffect(() => {
    const instance = init(props)
    instanceRef.current = instance
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
    // Re-init only on a material option change (serialized key), not every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useImperativeHandle(
    ref,
    () => ({
      open: () => instanceRef.current?.open(),
      close: () => instanceRef.current?.close(),
    }),
    [],
  )

  return null
})

export default VibeTip

/**
 * Hook variant: manages the widget lifecycle and returns a stable handle to
 * `open()` / `close()` it imperatively, without rendering `<VibeTip>` or wiring
 * a ref. The built-in floating button still renders.
 */
export function useVibeTip(options: VibeTipOptions): VibeTipHandle {
  const instanceRef = useRef<VibeTipInstance | null>(null)
  const key = optionsKey(options)

  useEffect(() => {
    const instance = init(options)
    instanceRef.current = instance
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const handleRef = useRef<VibeTipHandle | null>(null)
  if (!handleRef.current) {
    handleRef.current = {
      open: () => instanceRef.current?.open(),
      close: () => instanceRef.current?.close(),
    }
  }
  return handleRef.current
}
