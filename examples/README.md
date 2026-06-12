# VibeTip Examples

각 예제는 **독립 실행 가능한 폴더**입니다 — 폴더째 복사해서 그대로 쓰셔도 됩니다. 예제는 npm에 게시된 `vibetip` 버전을 사용합니다 (CI는 HEAD 빌드 tarball로 덮어써서 검증).

| 예제 | 보여주는 것 | 실행 |
|---|---|---|
| [`vanilla/`](./vanilla) | 스크립트 태그 한 줄 (빌드 없음) — 가장 쉬운 길 | `index.html` 더블클릭 |
| [`react-vite/`](./react-vite) | ESM `init()` + React `useEffect` 마운트/언마운트, `open/close/destroy` 핸들 | `npm install && npm run dev` |
| [`nextjs/`](./nextjs) | App Router에서 SSR-안전하게 쓰는 `'use client'` 래퍼 패턴 | `npm install && npm run dev` |

StackBlitz에서 바로 열기:

- [vanilla](https://stackblitz.com/fork/github/hyunjinee/vibetip/tree/main/examples/vanilla?file=index.html&title=VibeTip%20Vanilla)
- [react-vite](https://stackblitz.com/fork/github/hyunjinee/vibetip/tree/main/examples/react-vite?file=src%2FApp.tsx&title=VibeTip%20React)
- [nextjs](https://stackblitz.com/fork/github/hyunjinee/vibetip/tree/main/examples/nextjs?file=app%2Fvibetip.tsx&title=VibeTip%20Next.js)
