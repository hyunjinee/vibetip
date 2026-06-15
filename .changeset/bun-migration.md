---
"vibetip": patch
---

빌드 툴체인을 Bun으로 마이그레이션

- 패키지 매니저 npm → bun (`bun.lock`), 번들러 esbuild → Bun 네이티브 번들러 (런타임 의존성 0개 유지)
- `embed.ts`가 `globalThis.VibeTip`을 명시적으로 할당 — 번들러별 globalName 옵션에 의존하지 않아 어떤 번들러로도 스크립트 태그 전역(`VibeTip.init`)이 동작
- CI/Release 워크플로 `oven-sh/setup-bun`으로 전환. 게시는 `changeset publish`가 `npm publish`로 위임하므로 OIDC trusted publishing + provenance 그대로 유지
- 예제(react-vite, nextjs)의 `vibetip` 의존성이 실수로 로컬 tarball 경로로 커밋돼 있던 것을 `^0.1.0`으로 수정
