# VibeTip — Next.js (App Router)

SSR 환경에서 안전하게 쓰는 패턴입니다. `app/vibetip.tsx`가 `'use client'` 컴포넌트로 `useEffect` 안에서 `init()`을 호출하고 cleanup에서 `destroy()`합니다. 서버 컴포넌트(`app/page.tsx`)에서는 그 컴포넌트를 렌더링하기만 하면 됩니다.

```bash
bun install
bun run dev
```

npm/pnpm/yarn로도 동일하게 동작합니다 (`npm install && npm run dev`).
