export const CSS = `
:host {
  all: initial;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
}
.vt-root {
  position: fixed;
  bottom: 20px;
  z-index: 2147483000;
  --vt-bg: #ffffff;
  --vt-fg: #18181b;
  --vt-muted: #71717a;
  --vt-border: #e4e4e7;
  --vt-hover: #f4f4f5;
}
.vt-root[data-theme="dark"] {
  --vt-bg: #1c1c1f;
  --vt-fg: #fafafa;
  --vt-muted: #a1a1aa;
  --vt-border: #303034;
  --vt-hover: #28282c;
}
.vt-root[data-pos="bottom-right"] { right: 20px; }
.vt-root[data-pos="bottom-left"] { left: 20px; }

.vt-fab {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.vt-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.22);
}
.vt-fab:active { transform: translateY(0); }
.vt-fab.vt-icon-only { padding: 12px 14px; }
.vt-fab-emoji { font-size: 18px; line-height: 1; }

.vt-panel {
  position: absolute;
  bottom: calc(100% + 12px);
  width: 300px;
  background: var(--vt-bg);
  color: var(--vt-fg);
  border: 1px solid var(--vt-border);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  padding: 20px;
  opacity: 0;
  transform: translateY(8px) scale(0.97);
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.vt-root[data-pos="bottom-right"] .vt-panel { right: 0; }
.vt-root[data-pos="bottom-left"] .vt-panel { left: 0; }
.vt-root.vt-open .vt-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.vt-name {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 4px;
}
.vt-message {
  font-size: 13px;
  line-height: 1.5;
  color: var(--vt-muted);
  margin-bottom: 14px;
}
.vt-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.vt-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: 1px solid var(--vt-border);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vt-fg);
  text-decoration: none;
  transition: background 0.12s ease, border-color 0.12s ease;
}
.vt-link:hover {
  background: var(--vt-hover);
  border-color: var(--vt-muted);
}
.vt-link-emoji { font-size: 17px; line-height: 1; }
.vt-link-arrow {
  margin-left: auto;
  color: var(--vt-muted);
  font-size: 13px;
}
.vt-dead {
  cursor: default;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.4;
  color: var(--vt-muted);
  border-style: dashed;
}
.vt-dead:hover { background: transparent; border-color: var(--vt-border); }

.vt-footer {
  margin-top: 14px;
  text-align: center;
}
.vt-footer a {
  font-size: 11px;
  color: var(--vt-muted);
  text-decoration: none;
}
.vt-footer a:hover { text-decoration: underline; }

.vt-close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  color: var(--vt-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
}
.vt-close:hover { color: var(--vt-fg); }

.vt-fab:focus-visible,
.vt-link:focus-visible,
.vt-close:focus-visible {
  outline: 2px solid var(--vt-fg, #18181b);
  outline-offset: 2px;
}

@media (max-width: 380px) {
  .vt-panel { width: calc(100vw - 40px); }
}

@media (prefers-reduced-motion: reduce) {
  .vt-fab, .vt-panel, .vt-link { transition: none; }
}
`
