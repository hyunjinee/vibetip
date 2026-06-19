export const CSS = `
:host{all:initial}
.vt-root,.vt-root *,.vt-root *::before,.vt-root *::after{box-sizing:border-box;margin:0;padding:0}
.vt-root{--vt-accent:#FFDD00;--vt-pop:cubic-bezier(.34,1.56,.64,1);--vt-on-accent:#191F28;--vt-bg:#F7F8FA;--vt-card:#fff;--vt-card-hover:#fff;--vt-chip:#F2F4F6;--vt-chip-hover:#fff;--vt-text:#191F28;--vt-text-2:#4E5968;--vt-text-3:#8B95A1;--vt-line:#02204714;--vt-ring:#3182F6;--vt-sh-fab:0 2px 5px #191F2817,0 12px 28px #191F2830;--vt-sh-panel:0 0 0 1px #0220470A,0 8px 24px #191F2812,0 32px 72px #191F2833;--vt-sh-card:0 0 0 1px #02204712,0 12px 36px #191F2814;--vt-scrim:#191F2866;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard Variable",Pretendard,"Noto Sans KR","Segoe UI","Malgun Gothic",sans-serif;font-size:15px;line-height:1.45;color:var(--vt-text);-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:100%}
.vt-root[data-theme=dark]{--vt-bg:#202228;--vt-card:#292C34;--vt-card-hover:#30343E;--vt-chip:#373B45;--vt-chip-hover:#3D424D;--vt-text:#F2F4F6;--vt-text-2:#B0B8C1;--vt-text-3:#7D8692;--vt-line:#FFFFFF14;--vt-ring:#4D9DFF;--vt-sh-fab:0 2px 6px #00000059,0 12px 30px #00000080;--vt-sh-panel:0 0 0 1px #FFFFFF10,0 8px 24px #00000052,0 32px 72px #0000008C;--vt-sh-card:0 0 0 1px #FFFFFF12,0 14px 38px #00000045;--vt-scrim:#00000080}
.vt-fab{position:fixed;bottom:24px;z-index:2147483001;display:inline-flex;align-items:center;height:52px;padding:0 20px;border:0;border-radius:26px;background:var(--vt-accent);color:var(--vt-on-accent);font:inherit;font-size:15px;font-weight:750;letter-spacing:-.01em;line-height:1;cursor:pointer;box-shadow:var(--vt-sh-fab);transition:transform .35s var(--vt-pop),box-shadow .3s ease,filter .2s ease,opacity .2s ease,padding .3s ease}
[data-pos=bottom-right] .vt-fab{right:24px}
[data-pos=bottom-left] .vt-fab{left:24px}
.vt-fab:hover{transform:translateY(-3px) scale(1.025);box-shadow:var(--vt-sh-fab),0 18px 38px #191F2830;filter:brightness(1.025)}
.vt-fab:active{transform:translateY(0) scale(.95);transition-duration:.12s}
.vt-fab>span{display:inline-block;max-width:90px;overflow:hidden;white-space:nowrap;transition:max-width .3s ease,opacity .15s ease}
.vt-fab::after{content:"✕";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:600;opacity:0;transform:rotate(90deg) scale(.4);transition:transform .3s var(--vt-pop),opacity .15s ease}
.vt-open .vt-fab>span{max-width:0;opacity:0}
.vt-open .vt-fab::after{opacity:1;transform:none}
.vt-panel{position:fixed;bottom:96px;z-index:2147483000;width:344px;max-height:calc(100vh - 132px);overflow-y:auto;overscroll-behavior:contain;padding:12px;border:1px solid var(--vt-line);border-radius:28px;background:var(--vt-bg);box-shadow:var(--vt-sh-panel);word-break:keep-all;overflow-wrap:break-word;visibility:hidden;opacity:0;transform:translateY(16px) scale(.94);transition:transform .4s cubic-bezier(.26,1.25,.4,1),opacity .22s ease,visibility 0s .4s}
[data-pos=bottom-right] .vt-panel{right:24px;transform-origin:calc(100% - 48px) calc(100% + 42px)}
[data-pos=bottom-left] .vt-panel{left:24px;transform-origin:48px calc(100% + 42px)}
.vt-open .vt-panel{visibility:visible;opacity:1;transform:none;transition-delay:0s}
.vt-close{position:absolute;top:18px;right:18px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:0;border-radius:50%;background:var(--vt-card);color:var(--vt-text-3);font:inherit;font-size:13px;line-height:1;cursor:pointer;box-shadow:0 0 0 1px var(--vt-line);transition:background .15s ease,color .15s ease,transform .2s var(--vt-pop)}
.vt-close:hover{background:var(--vt-card-hover);color:var(--vt-text)}
.vt-close:active{transform:scale(.88)}
.vt-header{position:relative;display:flex;align-items:flex-start;min-height:68px;padding:8px 42px 14px 8px}
.vt-heading{min-width:0;padding-top:1px}
.vt-eyebrow{font-size:10px;font-weight:800;line-height:1.25;letter-spacing:.11em;text-transform:uppercase;color:var(--vt-text-3)}
.vt-name{margin-top:3px;font-size:18px;font-weight:750;letter-spacing:-.025em;line-height:1.3}
.vt-message{margin-top:3px;font-size:13.5px;line-height:1.5;color:var(--vt-text-2)}
.vt-links{display:flex;flex-direction:column;gap:8px}
.vt-link{display:flex;align-items:center;gap:12px;min-height:62px;padding:10px;border:1px solid var(--vt-line);border-radius:19px;background:var(--vt-card);color:var(--vt-text);font-size:15px;font-weight:650;letter-spacing:-.015em;text-decoration:none;box-shadow:0 1px 2px #191F2808;transition:border-color .2s ease,background .2s ease,transform .25s var(--vt-pop),box-shadow .2s ease}
a.vt-link:hover{border-color:color-mix(in srgb,var(--vt-accent) 70%,var(--vt-line));background:var(--vt-card-hover);transform:translateY(-2px);box-shadow:0 8px 18px #191F2812}
a.vt-link:active{transform:scale(.98);box-shadow:none}
.vt-link-emoji{flex:none;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:19px;border-radius:13px;background:var(--vt-chip);transition:background .2s ease,transform .25s var(--vt-pop)}
a.vt-link:hover .vt-link-emoji{background:var(--vt-chip-hover);transform:scale(1.06) rotate(-3deg)}
.vt-link-label{min-width:0}
.vt-link-arrow{flex:none;display:flex;align-items:center;justify-content:center;width:30px;height:30px;margin-left:auto;border-radius:50%;background:var(--vt-bg);color:var(--vt-text-3);transition:transform .2s ease,color .15s ease,background .2s ease}
a.vt-link:hover .vt-link-arrow{transform:translate(2px,-2px);background:var(--vt-accent);color:var(--vt-on-accent)}
.vt-link.vt-dead{background:transparent;border:1.5px dashed var(--vt-line);padding:9px;color:var(--vt-text-3);font-size:12.5px;font-weight:500;line-height:1.5;cursor:default;box-shadow:none}
.vt-dead .vt-link-emoji{background:var(--vt-card);font-size:17px}
.vt-footer{padding:13px 0 3px;text-align:center}
.vt-footer a{font-size:10.5px;font-weight:600;letter-spacing:.02em;color:var(--vt-text-3);text-decoration:none;transition:color .15s ease}
.vt-footer a::before{content:"";display:inline-block;width:5px;height:5px;margin:0 7px 1px 0;border-radius:50%;background:var(--vt-accent)}
.vt-footer a:hover{color:var(--vt-text);text-decoration:underline;text-decoration-color:var(--vt-accent);text-decoration-thickness:2px;text-underline-offset:3px}
[data-mode=inline] .vt-fab,[data-mode=inline] .vt-close{display:none}
[data-mode=inline] .vt-panel{position:static;visibility:visible;opacity:1;transform:none;transition:none;width:100%;max-width:400px;max-height:none;border-radius:26px;box-shadow:var(--vt-sh-card)}
[data-mode=inline] .vt-header{padding-right:8px}
@media (max-width:479px){
[data-mode=floating] .vt-fab{bottom:16px}
[data-mode=floating][data-pos=bottom-right] .vt-fab{right:16px}
[data-mode=floating][data-pos=bottom-left] .vt-fab{left:16px}
[data-mode=floating] .vt-panel{left:0;right:0;bottom:0;width:auto;max-width:none;max-height:88vh;max-height:88dvh;border-width:1px 0 0;border-radius:28px 28px 0 0;opacity:1;padding:14px 12px calc(10px + env(safe-area-inset-bottom,0px));transform:translateY(100%);transform-origin:50% 100%;transition:transform .45s cubic-bezier(.32,.72,0,1),visibility 0s .45s}
[data-mode=floating].vt-open .vt-panel{transform:none;transition-delay:0s}
[data-mode=floating] .vt-panel::before{content:"";position:absolute;top:10px;left:50%;width:40px;height:4px;margin-left:-20px;border-radius:2px;background:var(--vt-line)}
[data-mode=floating] .vt-header{padding-top:18px}
[data-mode=floating] .vt-close{top:28px}
[data-mode=floating]::after{content:"";position:fixed;inset:0;z-index:2147482999;background:var(--vt-scrim);opacity:0;pointer-events:none;transition:opacity .35s ease}
[data-mode=floating].vt-open::after{opacity:1}
[data-mode=floating].vt-open .vt-fab{opacity:0;transform:scale(.6);pointer-events:none}
}
.vt-root :is(a,button):focus-visible{outline:2px solid var(--vt-ring);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
.vt-root,.vt-root::before,.vt-root::after,.vt-root *,.vt-root *::before,.vt-root *::after{transition:none!important;animation:none!important}
}
.vt-link-arrow svg{display:block}
`
