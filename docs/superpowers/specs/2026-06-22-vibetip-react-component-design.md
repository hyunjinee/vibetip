# VibeTip React 컴포넌트 설계 (vibetip/react)

**작성일:** 2026-06-22
**상태:** 설계 확정 대기 (사용자 리뷰 전)
**선행:** 스타일 커스터마이징(0.5.0) 완료. 여기서 만든 `tokens`가 props로 흐른다.

---

## 1. 목표

React 유저가 `import { VibeTip } from 'vibetip/react'` 한 줄로 위젯을 쓰게 한다. 코어는 **런타임 의존성 0개**·스크립트태그 유저 영향 0을 유지한다.

## 2. 현재 DX와 동기

지금 React 유저는 `useRef` + `useEffect(() => { tip.current = init(...); return () => tip.current?.destroy() }, [])`를 매번 손으로 짠다(`examples/nextjs/app/vibetip.tsx`). 명령형 라이프사이클·SSR `'use client'` 처리·옵션 stringly-typed가 마찰. 코어의 `init() → {open,close,destroy}` 구조는 래핑에 이미 완벽하다.

## 3. 결정 (Decisions)

- **단일 패키지 + 서브패스.** 별도 `vibetip-react` 패키지 대신 `vibetip/react` 서브패스(Swiper `swiper/react` 선례). 코어 표면이 작고 안정적.
- **React = optional peerDependency.** `peerDependenciesMeta.react.optional:true` → `npm i vibetip`(스크립트태그/바닐라) 유저는 경고도, React 설치도 없음. React는 `vibetip/react`를 import하는 프로젝트만 끌어온다. **절대 번들에 넣지 않는다(external).**
- **컴포넌트 + 훅 둘 다.** `<VibeTip>`(선언형, 주력) + `useVibeTip()`(JSX/ref 없이 명령형 제어).
- **prop 변경 = v1 재생성.** 코어에 `update()`는 없음. 직렬화 키가 바뀌면 destroy+re-init. 코어 변경 0. (대안인 코어 `update()`는 후속.)
- **래퍼에 JSX 없음 → `src/react.ts`.** 컴포넌트는 `return null`(코어가 자체적으로 host를 `document.body`/`mount`에 부착). 따라서 `.tsx`도, tsconfig `jsx` 설정도 불필요.

## 4. 비목표 (Non-goals)

- **FAB 숨김("내 버튼으로만 열기") — v1 범위 밖.** 위젯 신규 모드가 필요. 훅은 "open/close 명령형 제어 + 라이프사이클"용이며 기본 FAB는 그대로 뜬다. 후속 위젯 옵션(예: `trigger:'none'`)으로 검토.
- **코어 `update()` / 인-플레이스 갱신** — 후속.
- **CJS 빌드** — ESM-only(코어와 동일, App Router/Vite 타깃엔 충분).
- **`react-dom` peer** — 래퍼는 react 훅만 쓰고 react-dom API는 안 씀 → peer는 `react`만.

## 5. 패키징 상세

### 5.1 `package.json`

```jsonc
"exports": {
  ".": { "types": "./dist/index.d.ts", "import": "./dist/vibetip.js" },
  "./react": { "types": "./dist/react.d.ts", "import": "./dist/react.js" },
  "./package.json": "./package.json"        // exports가 allowlist가 되면 필요
},
"peerDependencies": { "react": ">=16.8.0" },
"peerDependenciesMeta": { "react": { "optional": true } }
```
- `types`는 각 조건 블록에서 **반드시 첫 번째**(Node16/NodeNext/Bundler 해석).
- `main`/`module`/`types`(코어용 레거시 필드)는 유지.
- devDependencies 추가: `react`, `react-dom`, `@types/react`, `@testing-library/react`(테스트용, 전부 devDep → 런타임 0-dep 유지).

### 5.2 `build.ts`

```ts
const react = await Bun.build({
  entrypoints: ['src/react.ts'],
  outdir: 'dist',
  naming: 'react.js',
  format: 'esm',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  minify: true,
  sourcemap: 'linked',
})
```
- 성공 체크 루프(`[esm, iife, cli]`)에 `react` 추가.
- **`'use client'` 디렉티브 보존:** `src/react.ts` 첫 줄에 `'use client'`. 번들 후에도 살아있는지 가드로 검증; 미니파이가 지우거나 옮기면 Bun `banner: '"use client";'` 옵션으로 재주입.
- **빌드 가드:** 기존 8KB/`attachShadow` 가드는 위젯 번들(`vibetip.js`/`vibetip.iife.js`)에만 적용(현행 유지). `dist/react.js`엔 **별도 가드**: `reactCode.startsWith('"use client"')` 아니면 throw. (얇은 래퍼라 크기/attachShadow 체크는 부적합.)
- `console.log`에 `dist/react.js` 추가.

### 5.3 `tsconfig.json`

- 변경 거의 없음. `include:["src"]`라 `src/react.ts`가 `tsc --emitDeclarationOnly`로 `dist/react.d.ts`를 생성.
- `import ... from 'react'` 타입은 `@types/react`(node_modules)로 해석됨 — `types:["bun-types","node"]` 배열은 *글로벌 자동 포함*만 제한하므로 명시 import엔 영향 없음.
- 테스트는 `react.test.ts`에서 JSX 없이 `createElement` 사용 → 기존 `exclude:["src/**/*.test.ts"]` 그대로, `.tsx`·jsx 설정 불필요.

## 6. API 설계 — `src/react.ts`

```ts
'use client'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { init } from './index'
import type { VibeTipInstance, VibeTipOptions } from './types'

export type VibeTipProps = VibeTipOptions
export type VibeTipHandle = Pick<VibeTipInstance, 'open' | 'close'>

// mount는 HTMLElement일 수 있어(직렬화 불가) 키에서 제외. 나머지(links/tokens 등)는
// 직렬화 가능. 이 키가 바뀔 때만 re-init → 부모의 매 렌더 새 객체로 인한 재생성 방지.
function optionsKey(options: VibeTipOptions): string {
  const { mount, ...rest } = options
  return JSON.stringify(rest)
}

export const VibeTip = forwardRef<VibeTipHandle, VibeTipProps>(function VibeTip(props, ref) {
  const instanceRef = useRef<VibeTipInstance | null>(null)
  const key = optionsKey(props)

  useEffect(() => {
    const instance = init(props)
    instanceRef.current = instance
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useImperativeHandle(ref, () => ({
    open: () => instanceRef.current?.open(),
    close: () => instanceRef.current?.close(),
  }), [])

  return null
})

export default VibeTip   // App Router: import VibeTip from 'vibetip/react'

export function useVibeTip(options: VibeTipOptions): VibeTipHandle {
  const instanceRef = useRef<VibeTipInstance | null>(null)
  const key = optionsKey(options)

  useEffect(() => {
    const instance = init(options)
    instanceRef.current = instance
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // 안정적인 핸들(렌더마다 새 객체 X)
  const handleRef = useRef<VibeTipHandle | null>(null)
  if (!handleRef.current) {
    handleRef.current = {
      open: () => instanceRef.current?.open(),
      close: () => instanceRef.current?.close(),
    }
  }
  return handleRef.current
}
```

**핵심 버그 방지:** `useEffect` deps를 원시 `[props]`/`[options]`로 두면 부모가 `links={[url]}`처럼 매 렌더 새 배열을 넘길 때마다 재생성됨(이 래퍼류 #1 버그). 직렬화 `key`가 동등성 가드. `optionsKey`는 내부 구현이라 export하지 않고, **관측 가능한 재생성 동작**(아래 테스트)으로 검증.

## 7. 테스트 전략 (TDD)

`@testing-library/react` + happy-dom(기존 preload). JSX 회피 위해 `createElement` 사용 → `src/react.test.ts`.

1. **마운트/언마운트:** `render(createElement(VibeTip,{links:[URL]}))` → `document.body`에 `[data-vibetip-widget]` host 생성. `unmount()` → host 제거(destroy 호출).
2. **ref 명령형:** `ref` 연결 후 `ref.current.open()` → `host.shadowRoot .vt-root`에 `vt-open` 클래스. `close()` → 해제.
3. **재생성 키(가장 중요):** mount 후 host 노드 참조 캡처 → 같은 props로 `rerender` → host 노드 **동일**(재생성 X). `name` 바꿔 `rerender` → host 노드 **교체**(이전 노드 DOM에서 사라짐). #1 버그 가드.
4. **`useVibeTip`:** 훅을 쓰는 테스트 컴포넌트 렌더 → 반환 핸들 `open()` 동작, `unmount` 시 정리. 핸들이 렌더 간 동일 참조(stable)인지 확인.
5. **빌드 가드:** `dist/react.js`가 `"use client"`로 시작. 위젯 번들 가드 영향 없음.
6. **`tsc --noEmit`** 통과(`@types/react` 설치 후).

> happy-dom + testing-library가 bun test에서 막히면 `react-dom/client` createRoot + `act`로 폴백(동일 검증).

## 8. 문서/예제

- **README:** "React" 사용법 섹션 — `vibetip/react` import, `<VibeTip ref tokens>` + `useVibeTip` 예시, optional peerDep 설명, prop 변경 시 재생성(옵션 memoize 권장) 주의.
- **`examples/nextjs/app/vibetip.tsx`:** 손으로 짠 `useRef`+`useEffect` 보일러플레이트를 `import { VibeTip } from 'vibetip/react'`로 교체(목표 API 시연). 예제는 메인 CI 밖이라 빌드 영향 없음(0.6.0 게시/링크 후 실제 설치).

## 9. 버전/호환성

**MINOR(0.6.0).** 전부 additive: 새 서브패스·새 peer(optional). 코어 `.`/IIFE/CLI 변화 0. changeset(minor).

## 10. 리스크

- **`'use client'` 디렉티브가 미니파이에서 유실/이동** → 빌드 가드로 강제(유실 시 banner 재주입). 0.3.0 IIFE 붕괴와 같은 방어 패턴.
- **testing-library/happy-dom 호환** → 폴백(react-dom/client + act) 준비.
- **prop 변경 재생성 시 열림/QR 상태 리셋** → 문서화(옵션 stabilize 권장). 후속 코어 `update()`로 해소 가능.
- **peer 누락 경고** → `optional:true`로 차단(스크립트태그 유저 무경고 확인이 검증 항목).
