---
"vibetip": minor
---

React 지원 추가: `vibetip/react` 서브패스로 `<VibeTip>` 컴포넌트와 `useVibeTip()` 훅을 제공합니다. `react`는 optional peerDependency라 스크립트 태그·바닐라 유저는 영향이 없고(코어는 여전히 런타임 의존성 0개), React 유저는 `import { VibeTip } from "vibetip/react"`로 바로 쓸 수 있습니다. 컴포넌트는 직렬화된 옵션 키로 재초기화를 가드해 매 렌더 재생성을 막으며, 빌드는 `'use client'` 디렉티브를 보존(App Router/RSC 호환)합니다.
