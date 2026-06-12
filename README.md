# ☕ VibeTip

**바이브 코딩으로 만든 앱에 1분 만에 후원 버튼 달기.**

스크립트 태그 한 줄이면 끝. 백엔드 없음, 회원가입 없음, 수수료 없음 — 방문자는 여러분이 설정한 결제 링크(Buy Me a Coffee, 토스, 카카오페이, Stripe, GitHub Sponsors...)로 바로 이동합니다.

gzip 기준 **~3KB**. 의존성 0개. Shadow DOM이라 여러분 앱의 CSS와 절대 충돌하지 않습니다.

## 빠른 시작

### 스크립트 태그 (가장 쉬움)

```html
<script src="https://unpkg.com/vibetip/dist/vibetip.iife.js"
  data-name="Jin"
  data-message="이 앱이 도움이 됐다면 커피 한 잔!"
  data-links="https://buymeacoffee.com/yourname, https://toss.me/yourname"></script>
```

URL만 넣으면 플랫폼을 자동 감지해서 라벨과 아이콘을 붙여줍니다.

### npm

```bash
npm install vibetip
```

```ts
import { init } from 'vibetip'

init({
  name: 'Jin',
  message: '이 앱이 도움이 됐다면 커피 한 잔!',
  links: [
    'https://buymeacoffee.com/yourname',
    'https://toss.me/yourname',
    { url: 'https://example.com/donate', label: '직접 후원', icon: '🎁' },
  ],
  accent: '#FFDD00',
  position: 'bottom-right', // or 'bottom-left'
  theme: 'auto',            // 'light' | 'dark' | 'auto'
})
```

## 자동 감지되는 플랫폼

| 플랫폼 | URL 예시 |
|---|---|
| Buy Me a Coffee | `buymeacoffee.com/yourname` |
| Ko-fi | `ko-fi.com/yourname` |
| GitHub Sponsors | `github.com/sponsors/yourname` |
| Patreon | `patreon.com/yourname` |
| Stripe Payment Link | `buy.stripe.com/...` |
| PayPal | `paypal.me/yourname` |
| 토스 익명송금 | `toss.me/yourname` |
| 카카오페이 송금링크 | `qr.kakaopay.com/...` |

목록에 없는 URL은 `후원하기 🙌` 커스텀 링크로 표시됩니다.

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `links` | `(string \| TipLink)[]` | **필수** | 결제 링크 목록 |
| `name` | `string` | – | 패널 헤더에 표시할 이름 |
| `message` | `string` | 기본 한국어 문구 | 헤더 아래 메시지 |
| `accent` | `string` | `#FFDD00` | 플로팅 버튼 색 |
| `position` | `'bottom-right' \| 'bottom-left'` | `bottom-right` | 버튼 위치 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `auto` | 패널 색상 모드 |
| `buttonLabel` | `string` | `Tip` | 버튼 텍스트 (`''`이면 아이콘만) |
| `hideBranding` | `boolean` | `false` | Powered by 푸터 숨김 |

`init()`은 `{ open, close, destroy }`를 반환합니다.

## 철학

- **결제를 중개하지 않습니다.** VibeTip은 UI일 뿐, 돈은 여러분과 결제 플랫폼 사이에서만 움직입니다. 그래서 수수료도, 규제 부담도, 신뢰 문제도 없습니다.
- **바이브 코더 친화.** 설정 파일도, 빌드 설정도 필요 없습니다. AI에게 "VibeTip 붙여줘"라고 하면 끝나는 수준의 단순함이 목표입니다.

## 개발

```bash
npm install
npm run build     # tsc 타입체크 + esbuild 번들
open demo/index.html
```

## License

MIT
