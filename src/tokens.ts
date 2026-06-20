/**
 * Keep only valid design-token entries — keys must start with `--` (a CSS custom
 * property). Anything else (e.g. `color`) is dropped so `options.tokens` can only
 * set tokens, never arbitrary CSS properties on the host element.
 */
export function filterTokenEntries(tokens?: Record<string, string>): [string, string][] {
  if (!tokens) return []
  return Object.entries(tokens).filter(([key]) => key.startsWith('--'))
}
