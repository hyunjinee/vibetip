# VibeTip React 컴포넌트 구현 플랜

> **실행:** package.json/build.ts/react.ts 강결합 → **인라인 TDD**. 각 태스크 red→green→commit.

**목표:** `import { VibeTip, useVibeTip } from 'vibetip/react'` — 코어 0-runtime-dep 유지, React optional peerDependency.

**참조 spec:** `docs/superpowers/specs/2026-06-22-vibetip-react-component-design.md`

---

## Task 1: devDependencies

**Files:** Modify `package.json`, `bun.lock`.

- [ ] `bun add -d react react-dom @types/react @testing-library/react`
- [ ] `bun test` 기존 27개 통과(회귀 없음) 확인
- [ ] commit

## Task 2: `src/react.ts` — 컴포넌트 + 훅 (TDD)

**Files:** Create `src/react.ts`, `src/react.test.ts`.

- [ ] **test(red):** `src/react.test.ts` (happy-dom + @testing-library/react, JSX 없이 `createElement`):
  - 마운트 → `document.body`에 `[data-vibetip-widget]` 생성; `unmount()` → 제거
  - `ref.current.open()` → `host.shadowRoot` 의 `.vt-root`에 `vt-open` 클래스
  - 같은 props로 rerender → host 노드 동일; `name` 변경 rerender → host 노드 교체
  - `useVibeTip()` → 핸들 `open()` 동작 + 렌더 간 동일 참조 + unmount 정리
- [ ] **green:** `src/react.ts` (spec §6의 코드: `'use client'`, `optionsKey`, `VibeTip` forwardRef, default export, `useVibeTip`)
- [ ] `bun test src/react.test.ts` green
- [ ] commit

## Task 3: 패키징 — exports/peer + build.ts + 가드

**Files:** Modify `package.json`, `build.ts`.

- [ ] `package.json`: `exports`에 `./react`(types-first) + `"./package.json"` 추가; `peerDependencies:{"react":">=16.8.0"}` + `peerDependenciesMeta:{"react":{"optional":true}}`
- [ ] `build.ts`: `react` 엔트리(`src/react.ts`, esm, `external:['react','react-dom','react/jsx-runtime']`, minify, sourcemap) 추가; 성공 체크 루프에 포함; `console.log`에 `dist/react.js` 추가
- [ ] `'use client'` 보존: `src/react.ts` 첫 줄 디렉티브 유지. `bun run build` 후 `dist/react.js`가 `"use client"`로 시작하는지 확인 — 아니면 `banner:'"use client";'` 추가
- [ ] `build.ts` 가드: `dist/react.js` 가 `"use client"`로 시작 안 하면 throw (위젯 8KB/attachShadow 가드는 현행 유지)
- [ ] `bun run build` 성공 + `dist/react.d.ts` 생성(`tsc --emitDeclarationOnly`) + react 미번들(`grep -c 'use client' dist/react.js`, react가 external인지 `grep -c 'react' 흔적은 import 형태`)
- [ ] `tsc --noEmit` 통과
- [ ] commit

## Task 4: 문서 + 예제

**Files:** Modify `README.md`, `examples/nextjs/app/vibetip.tsx`.

- [ ] README: "React" 섹션(또는 기존 "Examples" 인근) — `vibetip/react` import, `<VibeTip ref tokens>` + `useVibeTip` 예시, optional peer 설명, prop 변경=재생성(memoize 권장) 주의. 기존 내용 보존.
- [ ] `examples/nextjs/app/vibetip.tsx`: 수동 보일러플레이트 → `import { VibeTip } from 'vibetip/react'` 시연으로 교체(예제는 메인 CI 밖).
- [ ] commit

## Task 5: changeset + 최종 검증

**Files:** Create `.changeset/*.md`.

- [ ] `bun run build`(가드 통과) · `bun test` 전체 green · `tsc --noEmit` 통과
- [ ] (가능하면) 브라우저로 `<VibeTip>`/`useVibeTip` 동작 시각 확인
- [ ] changeset(minor): "feat: add vibetip/react (VibeTip component + useVibeTip hook)"
- [ ] commit
