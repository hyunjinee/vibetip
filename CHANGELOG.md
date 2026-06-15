# vibetip

## 0.2.0

### Minor Changes

- [`0ee704e`](https://github.com/hyunjinee/vibetip/commit/0ee704ef9f796df6c61b971d9f2c77e664579d1e) Thanks [@hyunjinee](https://github.com/hyunjinee)! - 디자인 전면 개편 + 인라인 마운트 지원

  - K-핀테크 디자인 언어로 전면 리디자인: 토큰 기반 라이트/다크 테마, pill→원형 버튼 모핑, 모바일 바텀시트(그래버·스크림·safe-area), accent 연동 호버 글로우, 한글 줄바꿈 안전(`word-break: keep-all`)
  - `mount` 옵션 신설 — 플로팅 버튼 대신 지정 요소 안에 인라인 카드로 렌더링 (`data-mount` 속성 지원)
  - 플로팅 버튼 아이콘을 이모지(☕)에서 inline SVG 스파크(✦)로 교체 — OS별 렌더링 차이 제거
  - "Powered by VibeTip" 출처 링크를 실제 저장소(hyunjinee/vibetip)로 수정

### Patch Changes

- [`5d667c3`](https://github.com/hyunjinee/vibetip/commit/5d667c3c9e7d557d745a1d75c2d3d0d63ba6dabd) Thanks [@hyunjinee](https://github.com/hyunjinee)! - 빌드 툴체인을 Bun으로 마이그레이션

  - 패키지 매니저 npm → bun (`bun.lock`), 번들러 esbuild → Bun 네이티브 번들러 (런타임 의존성 0개 유지)
  - `embed.ts`가 `globalThis.VibeTip`을 명시적으로 할당 — 번들러별 globalName 옵션에 의존하지 않아 어떤 번들러로도 스크립트 태그 전역(`VibeTip.init`)이 동작
  - CI/Release 워크플로 `oven-sh/setup-bun`으로 전환. 게시는 `changeset publish`가 `npm publish`로 위임하므로 OIDC trusted publishing + provenance 그대로 유지
  - 예제(react-vite, nextjs)의 `vibetip` 의존성이 실수로 로컬 tarball 경로로 커밋돼 있던 것을 `^0.1.0`으로 수정

- [`d9c9e79`](https://github.com/hyunjinee/vibetip/commit/d9c9e7955de2c05a02dbded0b460cc000d197cbb) Thanks [@hyunjinee](https://github.com/hyunjinee)! - 게시된 0.1.0의 dist가 한국 프리셋 반영 이전 빌드였던 문제 수정 — 크티/투네이션/후원한잔 프리셋, supertoss:// 스킴 감지, toss.me 툼스톤 렌더링이 npm 패키지에 포함됩니다.
