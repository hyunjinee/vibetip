import { createWidget } from './widget.js'
import type { VibeTipInstance, VibeTipOptions } from './types.js'

export type { VibeTipOptions, VibeTipInstance, TipLink, LinkType } from './types.js'

/** Mount the VibeTip floating button. Call once after the DOM is ready. */
export function init(options: VibeTipOptions): VibeTipInstance {
  if (document.readyState === 'loading') {
    let instance: VibeTipInstance | null = null
    let destroyed = false
    document.addEventListener('DOMContentLoaded', () => {
      if (!destroyed) instance = createWidget(options)
    })
    return {
      open: () => instance?.open(),
      close: () => instance?.close(),
      destroy: () => {
        destroyed = true
        instance?.destroy()
      },
    }
  }
  return createWidget(options)
}
