export type LinkType = 'kakaopay'

export interface TipLink {
  /** KakaoPay transfer URL the visitor will be sent to */
  url: string
  /** Payment platform. VibeTip currently supports KakaoPay only. */
  type?: LinkType
  /** Override the button text */
  label?: string
  /** Override the button emoji/icon */
  icon?: string
}

export interface VibeTipOptions {
  /** Creator or project name shown in the panel header */
  name?: string
  /** Short message under the name, e.g. "이 앱이 마음에 들었다면 커피 한 잔!" */
  message?: string
  /** KakaoPay transfer links. Objects can override the button label and icon. */
  links: Array<string | TipLink>
  /** Accent color for the floating button. Default: #FFDD00 (coffee yellow) */
  accent?: string
  /** Corner for the floating button. Default: bottom-right */
  position?: 'bottom-right' | 'bottom-left'
  /**
   * Render inline inside this element (CSS selector or element) instead of a
   * floating button — the panel becomes a static card in the page flow.
   */
  mount?: string | HTMLElement
  /** Color scheme. Default: auto (follows prefers-color-scheme) */
  theme?: 'light' | 'dark' | 'auto'
  /** Text next to the coffee icon on the floating button. Empty string for icon-only. */
  buttonLabel?: string
  /** Hide the "Powered by VibeTip" footer line */
  hideBranding?: boolean
}

export interface VibeTipInstance {
  open(): void
  close(): void
  destroy(): void
}
