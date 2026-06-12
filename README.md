# VibeTip

**바이브 코딩으로 만든 앱에 1분 만에 후원 버튼 달기.**

스크립트 태그 한 줄이면 끝. 백엔드 없음, 회원가입 없음, 수수료 없음 — 방문자는 여러분이 설정한 결제 링크(카카오페이, 크티, 투네이션, GitHub Sponsors, Buy Me a Coffee...)로 바로 이동합니다.

- gzip 기준 **~3KB**, 의존성 0개, 클릭 전까지 추가 네트워크 요청 0회
- Shadow DOM — 여러분 앱의 CSS와 절대 충돌하지 않음
- 추적 없음, 쿠키 없음, iframe 없음, 결제 비중개 — 그냥 링크
- 진짜 `<button>`, `aria-expanded`, Escape 닫기, 포커스 복귀, `prefers-reduced-motion` 지원 (BMC/Ko-fi 공식 위젯이 다 놓치는 것들)

## 빠른 시작

### 스크립트 태그 (가장 쉬움)

```html
<script
  src="https://cdn.jsdelivr.net/npm/vibetip@0/dist/vibetip.iife.js"
  data-name="홍길동"
  data-message="이 앱이 도움이 됐다면 커피 한 잔!"
  data-links="https://qr.kakaopay.com/your-code, https://github.com/sponsors/yourname"
></script>
```

URL만 넣으면 플랫폼을 자동 감지해서 라벨과 아이콘을 붙여줍니다.

### npm

```bash
npm install vibetip
```

```ts
import { init } from "vibetip";

const tip = init({
  name: "홍길동",
  message: "이 앱이 도움이 됐다면 커피 한 잔!",
  links: [
    "https://qr.kakaopay.com/your-code",
    "https://ctee.kr/place/yourname",
    { url: "https://example.com/donate", label: "직접 후원", icon: "🎁" },
  ],
  accent: "#FFDD00",
  position: "bottom-right", // or 'bottom-left'
  theme: "auto", // 'light' | 'dark' | 'auto'
});
// tip.open() / tip.close() / tip.destroy()
```

React/Next.js 사용법은 [examples/](./examples)를 보세요.

## 어떤 결제 링크를 쓰면 되나요? (한국 크리에이터 기준)

| 우선순위 | 플랫폼               | URL 예시                  | 한국 정산         | 비고                                               |
| -------- | -------------------- | ------------------------- | ----------------- | -------------------------------------------------- |
| 1        | 카카오페이 송금코드  | `qr.kakaopay.com/...`     | ✅ 수수료 0%      | 카톡에서 1분 발급, 데스크톱 방문자는 모바일 필요   |
| 2        | 크티 (CTEE)          | `ctee.kr/place/...`       | ✅ PG ~3.2%       | 웹에서 바로 결제, 즉시 정산, 사업자등록 불필요     |
| 3        | 투네이션             | `toon.at/donate/...`      | ✅ 결제수단별     | 원천징수 3.3% 포함 — 세금 처리 가장 간단           |
| 4        | GitHub Sponsors      | `github.com/sponsors/...` | ✅ 수수료 0%      | 해외/개발자 후원용 최강. 한국 은행 정산 가능       |
| 5        | 후원한잔             | `acoffee.shop/...`        | ✅ 4%             | BMC 스타일 웹 결제                                 |
| –        | 토스 송금 딥링크     | `supertoss://send?...`    | ✅ 0%             | 비공식 스킴 + 계좌번호·실명 공개 — 이해하고 쓰세요 |
| –        | Ko-fi / PayPal       | `ko-fi.com/...`           | ⚠️ 해외 팬 전용   | 한국인끼리는 결제 불가                             |
| –        | Buy Me a Coffee      | `buymeacoffee.com/...`    | ❌ 정산 불가      | 2024-11 Payoneer 정산 중단 후 한국 수령 불가       |
| –        | Stripe Payment Links | `buy.stripe.com/...`      | ❌ 계정 개설 불가 | 한국 미지원                                        |

> ⚠️ **토스아이디(toss.me)는 2024-08-01 종료됐습니다.** toss.me 링크를 넣으면 VibeTip은 깨진 버튼 대신 교체 안내 문구를 보여줍니다.

플랫폼별 설정 방법과 세금·법률 안내는 **[한국 크리에이터 가이드](./docs/KOREA.md)** 를 보세요.

이 외 URL은 `후원하기 🙌` 커스텀 링크로 표시되며, `{ url, label, icon }`으로 직접 지정할 수도 있습니다.

## 옵션

| 옵션           | 타입                              | 기본값           | 설명                            |
| -------------- | --------------------------------- | ---------------- | ------------------------------- |
| `links`        | `(string \| TipLink)[]`           | **필수**         | 결제 링크 목록                  |
| `name`         | `string`                          | –                | 패널 헤더에 표시할 이름         |
| `message`      | `string`                          | 기본 한국어 문구 | 헤더 아래 메시지                |
| `accent`       | `string`                          | `#FFDD00`        | 플로팅 버튼 색                  |
| `position`     | `'bottom-right' \| 'bottom-left'` | `bottom-right`   | 플로팅 버튼 위치                |
| `mount`        | `string \| HTMLElement`           | –                | 지정 시 플로팅 대신 해당 요소 안에 인라인 카드로 렌더링 (푸터·사이드바 등 자유 배치) |
| `theme`        | `'light' \| 'dark' \| 'auto'`     | `auto`           | 패널 색상 모드                  |
| `buttonLabel`  | `string`                          | `Tip`            | 버튼 텍스트 (`''`이면 아이콘만) |
| `hideBranding` | `boolean`                         | `false`          | Powered by 푸터 숨김            |

`init()`은 `{ open, close, destroy }`를 반환합니다. SPA에서는 언마운트 시 `destroy()`를 호출하세요.

플로팅이 싫다면 인라인으로:

```html
<div id="tip-here"></div>
<script>
  VibeTip.init({ links: ['https://qr.kakaopay.com/your-code'], mount: '#tip-here' })
</script>
```

스크립트 태그 자동 초기화에서는 `data-mount="#tip-here"` 속성으로 동일하게 동작합니다.

## Examples

[`examples/`](./examples)에 복사해서 바로 쓸 수 있는 예제가 있습니다:

- [`vanilla/`](./examples/vanilla) — 스크립트 태그 한 줄, 빌드 없음
- [`react-vite/`](./examples/react-vite) — React `useEffect` 마운트/언마운트 패턴
- [`nextjs/`](./examples/nextjs) — App Router `'use client'` SSR-안전 패턴

## 철학

- **결제를 중개하지 않습니다.** VibeTip은 UI일 뿐, 돈은 여러분과 결제 플랫폼 사이에서만 움직입니다. 수수료도, 규제 부담도, 서드파티 iframe도 없습니다.
- **바이브 코더 친화.** AI에게 "VibeTip 붙여줘"라고 하면 끝나는 수준의 단순함이 목표입니다.

## 개발 & 릴리즈

```bash
npm install
npm run build     # tsc 타입체크 + esbuild 번들
open demo/index.html
```

릴리즈는 [changesets](https://github.com/changesets/changesets)로 자동화되어 있습니다. 변경 PR에 `npx changeset`으로 변경 요약을 함께 커밋하면, main 머지 시 Version Packages PR이 생성되고 그 PR을 머지하면 npm에 자동 배포됩니다(OIDC trusted publishing + provenance).

## License

MIT
