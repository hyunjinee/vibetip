export const CSS = `
:host{all:initial}
.vt-root,.vt-root *,.vt-root *::before,.vt-root *::after{box-sizing:border-box;margin:0;padding:0}
.vt-root{--vt-accent:#FFDD00;--vt-pop:cubic-bezier(.34,1.56,.64,1);--vt-on-accent:#191F28;--vt-bg:#fff;--vt-surface:#F2F4F6;--vt-surface-2:#E9ECEF;--vt-chip:#fff;--vt-chip-shadow:0 1px 2px #191F2812;--vt-text:#191F28;--vt-text-2:#4E5968;--vt-text-3:#8B95A1;--vt-line:#02204717;--vt-ring:#3182F6;--vt-sh-fab:0 2px 6px #191F281A,0 10px 26px #191F282E;--vt-sh-panel:0 0 0 1px #0220470A,0 6px 18px #191F2814,0 28px 64px #191F282E;--vt-sh-card:0 0 0 1px var(--vt-line),0 2px 8px #191F280A,0 12px 32px #191F280F;--vt-scrim:#191F2866;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard Variable",Pretendard,"Noto Sans KR","Segoe UI","Malgun Gothic",sans-serif;font-size:15px;line-height:1.45;color:var(--vt-text);-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:100%}
.vt-root[data-theme=dark]{--vt-bg:#1F2128;--vt-surface:#2A2D35;--vt-surface-2:#343842;--vt-chip:#3B404B;--vt-chip-shadow:none;--vt-text:#E7EAEE;--vt-text-2:#9CA3AD;--vt-text-3:#6E7580;--vt-line:#FFFFFF17;--vt-ring:#4D9DFF;--vt-sh-fab:0 2px 6px #0000004D,0 10px 26px #00000073;--vt-sh-panel:0 0 0 1px #FFFFFF12,0 6px 18px #00000059,0 28px 64px #0000008C;--vt-sh-card:0 0 0 1px #FFFFFF12,0 12px 32px #00000040;--vt-scrim:#00000080}
.vt-fab{position:fixed;bottom:20px;z-index:2147483001;display:inline-flex;align-items:center;height:52px;padding:0 20px;border:0;border-radius:26px;background:var(--vt-accent);color:var(--vt-on-accent);font:inherit;font-size:15px;font-weight:700;letter-spacing:-.01em;line-height:1;cursor:pointer;box-shadow:var(--vt-sh-fab);transition:transform .35s var(--vt-pop),box-shadow .3s ease,filter .2s ease,opacity .2s ease}
[data-pos=bottom-right] .vt-fab{right:20px}
[data-pos=bottom-left] .vt-fab{left:20px}
.vt-fab:hover{transform:translateY(-2px) scale(1.04);box-shadow:var(--vt-sh-fab),0 16px 36px #191F2833;box-shadow:var(--vt-sh-fab),0 16px 36px color-mix(in srgb,var(--vt-accent) 38%,transparent);filter:brightness(1.04)}
.vt-fab:active{transform:translateY(0) scale(.95);transition-duration:.12s}
.vt-fab-emoji{display:inline-flex;align-items:center;justify-content:center;font-size:19px;line-height:1;transition:transform .3s var(--vt-pop),opacity .15s ease}
.vt-fab>span:not(.vt-fab-emoji){display:inline-block;max-width:90px;margin-left:8px;overflow:hidden;white-space:nowrap;transition:max-width .3s ease,margin-left .3s ease,opacity .15s ease}
.vt-fab::after{content:"✕";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:600;opacity:0;transform:rotate(90deg) scale(.4);transition:transform .3s var(--vt-pop),opacity .15s ease}
.vt-open .vt-fab-emoji{transform:rotate(-90deg) scale(.4);opacity:0}
.vt-open .vt-fab>span:not(.vt-fab-emoji){max-width:0;margin-left:0;opacity:0}
.vt-open .vt-fab::after{opacity:1;transform:none}
.vt-panel{position:fixed;bottom:88px;z-index:2147483000;width:320px;max-height:calc(100vh - 120px);overflow-y:auto;overscroll-behavior:contain;padding:24px 20px 14px;border-radius:24px;background:var(--vt-bg);box-shadow:var(--vt-sh-panel);word-break:keep-all;overflow-wrap:break-word;visibility:hidden;opacity:0;transform:translateY(14px) scale(.94);transition:transform .4s cubic-bezier(.26,1.25,.4,1),opacity .22s ease,visibility 0s .4s}
[data-pos=bottom-right] .vt-panel{right:20px;transform-origin:calc(100% - 46px) calc(100% + 42px)}
[data-pos=bottom-left] .vt-panel{left:20px;transform-origin:46px calc(100% + 42px)}
.vt-open .vt-panel{visibility:visible;opacity:1;transform:none;transition-delay:0s}
.vt-close{position:absolute;top:12px;right:12px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:0;border-radius:50%;background:transparent;color:var(--vt-text-3);font:inherit;font-size:14px;line-height:1;cursor:pointer;transition:background .15s ease,color .15s ease,transform .2s var(--vt-pop)}
.vt-close:hover{background:var(--vt-surface);color:var(--vt-text)}
.vt-close:active{transform:scale(.88)}
.vt-name{font-size:17px;font-weight:700;letter-spacing:-.02em;line-height:1.35;padding-right:32px}
.vt-message{margin-top:5px;font-size:14px;line-height:1.55;color:var(--vt-text-2)}
.vt-links{display:flex;flex-direction:column;gap:8px;margin-top:18px}
.vt-link{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:16px;background:var(--vt-surface);color:var(--vt-text);font-size:15px;font-weight:600;letter-spacing:-.01em;text-decoration:none;transition:background .15s ease,transform .2s var(--vt-pop)}
a.vt-link:hover{background:var(--vt-surface-2)}
a.vt-link:active{transform:scale(.97)}
.vt-link-emoji{flex:none;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:19px;border-radius:12px;background:var(--vt-chip);box-shadow:var(--vt-chip-shadow)}
.vt-link-arrow{margin-left:auto;padding-left:8px;color:var(--vt-text-3);font-size:14px;transition:transform .2s ease,color .15s ease}
a.vt-link:hover .vt-link-arrow{transform:translate(2px,-2px);color:var(--vt-text-2)}
.vt-link.vt-dead{background:transparent;border:1.5px dashed var(--vt-line);padding:10px 13px;color:var(--vt-text-3);font-size:13px;font-weight:500;line-height:1.5;cursor:default}
.vt-dead .vt-link-emoji{background:var(--vt-surface);box-shadow:none;font-size:17px}
.vt-footer{margin-top:16px;padding:12px 0 4px;border-top:1px solid var(--vt-line);text-align:center}
.vt-footer a{font-size:11px;font-weight:500;color:var(--vt-text-2);text-decoration:none;transition:color .15s ease}
.vt-footer a:hover{color:var(--vt-text);text-decoration:underline;text-decoration-color:var(--vt-accent);text-decoration-thickness:2px;text-underline-offset:3px}
[data-mode=inline] .vt-fab,[data-mode=inline] .vt-close{display:none}
[data-mode=inline] .vt-panel{position:static;visibility:visible;opacity:1;transform:none;transition:none;width:100%;max-width:380px;max-height:none;border-radius:20px;box-shadow:var(--vt-sh-card)}
[data-mode=inline] .vt-name{padding-right:0}
@media (max-width:479px){
[data-mode=floating] .vt-panel{left:0;right:0;bottom:0;width:auto;max-width:none;max-height:85vh;max-height:85dvh;border-radius:24px 24px 0 0;opacity:1;padding:32px 20px calc(14px + env(safe-area-inset-bottom,0px));transform:translateY(100%);transform-origin:50% 100%;transition:transform .45s cubic-bezier(.32,.72,0,1),visibility 0s .45s}
[data-mode=floating].vt-open .vt-panel{transform:none;transition-delay:0s}
[data-mode=floating] .vt-panel::before{content:"";position:absolute;top:10px;left:50%;width:40px;height:4px;margin-left:-20px;border-radius:2px;background:var(--vt-line)}
[data-mode=floating]::after{content:"";position:fixed;inset:0;z-index:2147482999;background:var(--vt-scrim);opacity:0;pointer-events:none;transition:opacity .35s ease}
[data-mode=floating].vt-open::after{opacity:1}
[data-mode=floating].vt-open .vt-fab{opacity:0;transform:scale(.6);pointer-events:none}
}
.vt-root :is(a,button):focus-visible{outline:2px solid var(--vt-ring);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
.vt-root,.vt-root::before,.vt-root::after,.vt-root *,.vt-root *::before,.vt-root *::after{transition:none!important;animation:none!important}
}
.vt-fab-emoji svg{display:block}
`
