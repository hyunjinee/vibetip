/**
 * Keep only valid design-token entries — keys must start with `--` (a CSS custom
 * property). Anything else (e.g. `color`) is dropped so `options.tokens` can only
 * set tokens, never arbitrary CSS properties on the host element.
 */
export function filterTokenEntries(tokens?: Record<string, string>): [string, string][] {
  if (!tokens) return []
  return Object.entries(tokens).filter(([key]) => key.startsWith('--'))
}

/**
 * Parse a `data-tokens` JSON string into a tokens object. Returns undefined on
 * missing / invalid / non-object input, so a malformed attribute degrades to
 * "no overrides" instead of throwing and taking the whole widget down with it.
 */
export function parseTokens(raw?: string): Record<string, string> | undefined {
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>
    }
  } catch {
    // A bad data-tokens attribute should never break initialization.
  }
  return undefined
}
