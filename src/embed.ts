/**
 * Script-tag entry point. Auto-initializes from data attributes:
 *
 * <script src="https://unpkg.com/vibetip/dist/vibetip.iife.js"
 *   data-name="Jin"
 *   data-message="커피 한 잔이면 충분해요"
 *   data-links="https://buymeacoffee.com/jin, https://toss.me/jin"
 *   data-accent="#FFDD00"
 *   data-position="bottom-right"
 *   data-theme="auto"></script>
 *
 * data-links accepts a comma-separated URL list or a JSON array of TipLink objects.
 */
import { init } from './index'
import type { TipLink, VibeTipOptions } from './types'

export { init }
export type { VibeTipOptions }

function parseLinks(raw: string): Array<string | TipLink> {
  const trimmed = raw.trim()
  if (trimmed.startsWith('[')) {
    return JSON.parse(trimmed) as TipLink[]
  }
  return trimmed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const script = document.currentScript as HTMLScriptElement | null
const linksAttr = script?.dataset.links

if (script && linksAttr) {
  try {
    init({
      name: script.dataset.name,
      message: script.dataset.message,
      links: parseLinks(linksAttr),
      accent: script.dataset.accent,
      position: script.dataset.position as VibeTipOptions['position'],
      theme: script.dataset.theme as VibeTipOptions['theme'],
      buttonLabel: script.dataset.buttonLabel,
      hideBranding: script.dataset.hideBranding != null,
    })
  } catch (err) {
    console.error('[vibetip] failed to auto-initialize:', err)
  }
}
