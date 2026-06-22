# VibeTip

**바이브 코딩으로 만든 앱에 1분 만에 후원 버튼 달기.**

모바일에서는 카카오페이 송금 화면을 열고, PC에서는 휴대폰으로 스캔할 QR을 보여줍니다.

<p align="center">
  <img src="./docs/assets/vibetip-preview.svg" width="900" alt="앱에 VibeTip 후원 패널을 띄운 모습" />
</p>

<p align="center">
  <a href="https://vibetip-demo.vercel.app/"><strong>▶ 라이브 데모</strong></a> — PC에서는 QR, 모바일에서는 카카오페이 송금 화면이 열립니다.
</p>

## 빠른 시작

> **유저가 할 일은 딱 하나 — 카카오페이 송금코드 URL을 넣는 것뿐입니다.**
>
> 1. 카카오톡/카카오페이에서 내 **송금코드**를 열어 `https://qr.kakaopay.com/...` 링크를 복사합니다 ([발급 방법](./docs/KOREA.md)).
> 2. 아래 예제의 `data-links`(스크립트 태그) 또는 `links`(npm)에 그 URL만 바꿔 넣습니다.
> 3. 끝입니다 — 모바일에서는 송금 화면이 열리고, PC에서는 QR이 자동으로 표시됩니다.

### 스크립트 태그

```html
<script
  src="https://cdn.jsdelivr.net/npm/vibetip@0/dist/vibetip.iife.js"
  data-name="홍길동"
  data-message="이 앱이 도움이 됐다면 커피 한 잔!"
  data-links="https://qr.kakaopay.com/your-code"
></script>
```

본인의 카카오페이 송금코드 URL만 넣으면 됩니다.

### npm

```bash
npm install vibetip
```

```ts
import { init } from "vibetip";

const tip = init({
  name: "홍길동",
  message: "이 앱이 도움이 됐다면 커피 한 잔!",
  links: ["https://qr.kakaopay.com/your-code"],
  accent: "#FFDD00",
  position: "bottom-right", // or 'bottom-left'
  theme: "auto", // 'light' | 'dark' | 'auto'
});
// tip.open() / tip.close() / tip.destroy()
```

### React / Next.js

`vibetip/react` 서브패스로 컴포넌트와 훅을 제공합니다. `react`는 **optional peerDependency**라 스크립트 태그·바닐라 유저는 아무 영향이 없습니다(설치도, 경고도 없음).

```tsx
import { VibeTip } from "vibetip/react";

export default function Page() {
  return (
    <VibeTip
      name="홍길동"
      message="이 앱이 도움이 됐다면 커피 한 잔!"
      links={["https://qr.kakaopay.com/your-code"]}
      tokens={{ "--vt-radius": "12px" }}
    />
  );
}
```

`<VibeTip>`은 이미 `'use client'` 모듈이라 **서버 컴포넌트에서 바로 import**해도 됩니다 — 위 예제엔 `'use client'`가 필요 없습니다. 같은 파일에서 `useVibeTip` 훅이나 `onClick` 등 클라이언트 기능을 함께 쓸 때만 파일 맨 위에 `'use client'`를 추가하세요.

props는 `init()` 옵션과 동일합니다. 컴포넌트는 아무것도 렌더하지 않고(위젯이 스스로 `document.body`에 마운트), `ref`로 `open()`/`close()`를 호출할 수 있습니다.

기본 버튼과 별개로 **내 UI에서** 패널을 열고 싶다면 `useVibeTip` 훅:

```tsx
"use client";
import { useVibeTip } from "vibetip/react";

export function TipButton() {
  const tip = useVibeTip({ links: ["https://qr.kakaopay.com/your-code"] });
  return <button onClick={tip.open}>후원하기</button>;
}
```

> prop이 직렬화 기준으로 바뀌면 위젯을 재생성합니다. 매 렌더 새 옵션 객체를 넘겨도 값이 같으면 재생성하지 않지만, 옵션이 자주 바뀐다면 `useMemo`로 안정화하세요. `mount`은 첫 렌더에 한 번만 읽습니다(비반응성) — 대상을 바꾸려면 React `key`로 리마운트하세요.

전체 예제는 [examples/](./examples)를 보세요.

## 카카오페이 송금코드 준비

카카오톡에서 송금코드를 발급하고 URL을 확인하는 방법은 **[한국 크리에이터 가이드](./docs/KOREA.md)** 를 보세요.

현재 VibeTip은 `qr.kakaopay.com`과 `link.kakaopay.com` 카카오페이 송금 링크만 지원합니다. 다른 URL을 전달하면 초기화 시 명확한 오류를 반환합니다.

## 옵션

| 옵션           | 타입                              | 기본값           | 설명                            |
| -------------- | --------------------------------- | ---------------- | ------------------------------- |
| `links`        | `(string \| TipLink)[]`           | **필수**         | 카카오페이 송금 링크 목록       |
| `name`         | `string`                          | –                | 패널 헤더에 표시할 이름         |
| `message`      | `string`                          | 기본 한국어 문구 | 헤더 아래 메시지                |
| `accent`       | `string`                          | `#FFDD00`        | 플로팅 버튼 색                  |
| `position`     | `'bottom-right' \| 'bottom-left'` | `bottom-right`   | 플로팅 버튼 위치                |
| `mount`        | `string \| HTMLElement`           | –                | 지정 시 플로팅 대신 해당 요소 안에 인라인 카드로 렌더링 (푸터·사이드바 등 자유 배치) |
| `theme`        | `'light' \| 'dark' \| 'auto'`     | `auto`           | 패널 색상 모드                  |
| `buttonLabel`  | `string`                          | `Tip`            | 버튼 텍스트 (`''`이면 아이콘만) |
| `hideBranding` | `boolean`                         | `false`          | Powered by 푸터 숨김            |
| `tokens`       | `Record<string, string>`          | –                | 디자인 토큰(CSS 변수) 오버라이드. [스타일 커스터마이징](#스타일-커스터마이징) 참고 |

`init()`은 `{ open, close, destroy }`를 반환합니다. SPA에서는 언마운트 시 `destroy()`를 호출하세요.

플로팅이 싫다면 인라인으로:

```html
<div id="tip-here"></div>
<script>
  VibeTip.init({ links: ['https://qr.kakaopay.com/your-code'], mount: '#tip-here' })
</script>
```

스크립트 태그 자동 초기화에서는 `data-mount="#tip-here"` 속성으로 동일하게 동작합니다.

## 스타일 커스터마이징

위젯은 Shadow DOM으로 격리돼 **여러분 앱의 CSS와 절대 충돌하지 않습니다.** 격리는 한 방향이라, 아래 채널로 *원하는 부분만* 안전하게 덮어쓸 수 있습니다 (앱의 전역 CSS는 여전히 새어 들어오지 않습니다).

### 1) 토큰 — `options.tokens` (가장 확실, 추천)

호스트에 인라인으로 적용돼 **테마와 무관하게 항상 우선**합니다.

```ts
init({
  links: ["https://qr.kakaopay.com/your-code"],
  tokens: { "--vt-bg": "#0B0B0C", "--vt-card": "#1A1A1D", "--vt-radius": "14px" },
});
```

스크립트 태그에서는 `data-tokens`(JSON):

```html
<script
  src="https://cdn.jsdelivr.net/npm/vibetip@0/dist/vibetip.iife.js"
  data-links="https://qr.kakaopay.com/your-code"
  data-tokens='{"--vt-bg":"#0B0B0C","--vt-radius":"14px"}'
></script>
```

공개 토큰 (semver 계약):

| 토큰            | 기본 (light / dark)     | 의미                |
| --------------- | ----------------------- | ------------------- |
| `--vt-accent`   | `#FFDD00`               | 강조색 (버튼)       |
| `--vt-on-accent`| `#191F28`               | 강조색 위 텍스트    |
| `--vt-bg`       | `#F7F8FA` / `#202228`   | 패널 배경           |
| `--vt-card`     | `#fff` / `#292C34`      | 링크/카드 표면      |
| `--vt-text`     | `#191F28` / `#F2F4F6`   | 1차 텍스트          |
| `--vt-text-2`   | `#4E5968` / `#B0B8C1`   | 2차 텍스트          |
| `--vt-text-3`   | `#8B95A1` / `#7D8692`   | 3차 텍스트          |
| `--vt-line`     | `#02204714` / `#FFFFFF14` | 테두리            |
| `--vt-ring`     | `#3182F6` / `#4D9DFF`   | 포커스 링           |
| `--vt-radius`   | `28px`                  | 패널 모서리 반경    |

### 2) 토큰 — 순수 CSS

빌드 없이도 됩니다. 위젯 호스트 선택자는 `[data-vibetip-widget]`:

```css
/* 외부 문서 규칙은 명시도와 무관하게 :host 기본값을 이깁니다(라이트·다크 모두 적용) */
[data-vibetip-widget] {
  --vt-bg: #0b0b0c;
  --vt-radius: 14px;
}
/* 다크에서만 다른 값을 쓰려면 테마로 범위를 좁히세요 */
[data-vibetip-widget][data-theme="dark"] {
  --vt-bg: #000;
}
```

### 3) 구조 변경 — `::part()`

토큰으로 못 바꾸는 모양(테두리·그림자·레이아웃 등)은 파트로. 노출된 파트는 `fab`, `panel`, `link`, `close` 4개입니다.

```css
[data-vibetip-widget]::part(fab) {
  border-radius: 8px;
}
[data-vibetip-widget]::part(panel) {
  box-shadow: none;
}
```

### 4) 이스케이프 해치 (비공식)

정 안 되면 `shadowRoot`가 `open`이라 직접 스타일도 가능합니다. **비공식 — 내부 구조는 버전업 시 바뀔 수 있습니다.**

```js
init({ links: ["https://qr.kakaopay.com/your-code"] });
document.querySelector("[data-vibetip-widget]").shadowRoot; /* 직접 조작 */
```

## 이미지로 내보내기

위젯은 자바스크립트가 도는 페이지에서만 뜹니다. GitHub README·Notion·블로그처럼
스크립트를 못 붙이는 곳에는 **후원 카드 이미지**를 만들어 붙이세요.

```bash
npx vibetip image --link https://qr.kakaopay.com/your-code --name 홍길동 --out tip
```

- `tip.svg`가 생성됩니다 (의존성 없이 항상).
- `@resvg/resvg-js`가 설치돼 있으면 `tip.png`도 함께 생성됩니다
  (`npm i -D @resvg/resvg-js`). Notion 등 SVG가 안 보이는 곳엔 PNG를 쓰세요.

옵션: `--message`, `--label`, `--accent`, `--theme light|dark`, `--scale`(PNG
해상도 배율, 기본 2). 자세한 건 `npx vibetip image --help`.

## Examples

[`examples/`](./examples)에 복사해서 바로 쓸 수 있는 예제가 있습니다:

- [`vanilla/`](./examples/vanilla) — 스크립트 태그 한 줄, 빌드 없음
- [`react-vite/`](./examples/react-vite) — React `useEffect` 마운트/언마운트 패턴
- [`nextjs/`](./examples/nextjs) — App Router `'use client'` SSR-안전 패턴

## 특징

- gzip 기준 **~10KB**, 런타임 의존성 0개, 클릭 전까지 추가 네트워크 요청 0회
- Shadow DOM — 여러분 앱의 CSS와 절대 충돌하지 않음
- 추적 없음, 쿠키 없음, iframe 없음, 결제 비중개 — 그냥 링크
- 진짜 `<button>`, `aria-expanded`, Escape 닫기, 포커스 복귀, `prefers-reduced-motion` 지원

## 철학

- **송금을 중개하지 않습니다.** VibeTip은 UI일 뿐, 돈은 송금자와 카카오페이 사이에서만 움직입니다. VibeTip 수수료도, 서드파티 iframe도 없습니다.
- **바이브 코더 친화.** AI에게 "VibeTip 붙여줘"라고 하면 끝나는 수준의 단순함이 목표입니다.

## 개발 & 릴리즈

[Bun](https://bun.com)으로 개발합니다.

```bash
bun install
bun run build     # tsc 타입체크 + Bun 번들러 + .d.ts 생성
bun run dev       # 소스 변경 시 자동 재빌드
open demo/index.html
```

릴리즈는 [changesets](https://github.com/changesets/changesets)로 자동화되어 있습니다. 변경 PR에 `bun changeset`으로 변경 요약을 함께 커밋하면, main 머지 시 Version Packages PR이 생성되고 그 PR을 머지하면 npm에 자동 배포됩니다. 빌드는 Bun으로 하지만, 게시는 `changeset publish`가 `npm publish`로 위임해 OIDC trusted publishing + provenance를 그대로 사용합니다.

## License

MIT
