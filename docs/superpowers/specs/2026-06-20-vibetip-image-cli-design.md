# VibeTip 이미지 CLI 설계

작성일: 2026-06-20

## 배경 / 문제

VibeTip 위젯은 자바스크립트가 실행되는 웹 페이지에서만 동작한다. 그래서 GitHub
README, Notion, 블로그, 채팅처럼 스크립트를 못 붙이는 곳에서는 후원 QR을 보여줄
방법이 없다. 이런 곳에는 **정적 이미지 파일**을 붙이는 수밖에 없는데, 현재
VibeTip은 그 이미지를 만들어 주지 못한다 (데모 페이지조차 QR을 손으로 박았다).

## 목표

`vibetip image` CLI를 추가해, 카카오페이 송금 링크 하나로 **후원 카드 이미지
파일**(SVG + 선택적 PNG)을 생성한다. 사용자는 그 파일을 README·Notion 등에
임베드한다.

### 성공 기준

- `npx vibetip image --link https://qr.kakaopay.com/<코드>` 한 줄로 후원 카드
  SVG 파일이 생성된다.
- 카드에는 QR + 이름/메시지 + "카카오페이로 후원" 라벨 + VibeTip 브랜딩이 들어간다.
- `@resvg/resvg-js`가 설치돼 있으면 PNG도 생성된다. 없으면 SVG만 만들고 설치
  방법을 안내한다 (실패가 아니라 정상 종료).
- 브라우저 위젯의 "런타임 의존성 0개"는 유지된다 (`package.json`의
  `dependencies`는 계속 비어 있음).

## 비목표 (YAGNI)

- 프로그래matic API 노출 (`vibetip/image` 서브패스 export)
- 위젯 패널 안의 "이미지로 저장" 다운로드 버튼
- 커스텀 폰트 임베딩
- 카카오페이 외 결제수단

## 아키텍처

세 개의 독립 단위로 나눈다.

### 1. `src/card.ts` — 카드 SVG 렌더러 (순수 함수)

```ts
interface CardOptions {
  url: string          // 검증된 카카오페이 송금 URL
  name?: string
  message?: string
  label?: string       // 기본 "카카오페이로 후원"
  accent?: string      // 기본 #FFDD00
  theme?: 'light' | 'dark'
}
export function renderCardSvg(opts: CardOptions): string
```

- DOM에 의존하지 않는다. lean-qr의 `generate()`로 QR 모듈 매트릭스를 얻고,
  `code.get(x, y)`를 순회해 `<path>` 문자열을 직접 만든다 (위젯이 쓰는
  `lean-qr/extras/svg`의 `toSvg`는 `document`가 필요하므로 CLI에서는 못 쓴다).
- 카드 레이아웃(배경, QR 프레임, 텍스트, 라벨, 브랜딩)을 고정 크기 SVG 문자열로
  조립한다. 텍스트는 `<text>`로, 색/그림자는 인라인으로.
- 입력 텍스트는 SVG/XML 이스케이프 처리한다 (`&`, `<`, `>`, `"`).

### 2. `src/cli.ts` — CLI 진입점

- 셔뱅(`#!/usr/bin/env node`)으로 시작.
- 인자를 파싱한다 (의존성 없이 `process.argv` 직접 파싱).
- `src/presets.ts`의 `resolveLink`로 `--link`를 검증한다 (카카오페이 호스트가
  아니면 기존 에러 메시지를 그대로 던진다).
- `renderCardSvg`를 호출해 SVG를 만들고 `.svg`로 저장한다.
- PNG가 필요하면 `@resvg/resvg-js`를 **동적 import** 한다.
  - 성공: SVG를 래스터화해 `.png` 저장.
  - 모듈 없음(`ERR_MODULE_NOT_FOUND`): SVG만 저장하고
    "PNG를 원하면 `npm i -D @resvg/resvg-js` 후 다시 실행하세요"를 출력, 정상 종료.

### 3. 빌드 / 패키징

- `build.ts`에 세 번째 `Bun.build`를 추가해 `src/cli.ts` → `dist/cli.js`를
  만든다. `format: 'esm'`, `target: 'node'`, `external: ['@resvg/resvg-js']`
  (동적 import 대상이 번들에 섞이지 않게).
- 기존 빌드 가드는 위젯 번들(`vibetip.js`, `vibetip.iife.js`)만 검사한다.
  CLI는 별도이므로 가드 대상에서 제외한다.
- `package.json`:
  - `"bin": { "vibetip": "dist/cli.js" }`
  - `"files"`는 이미 `dist`를 포함하므로 변경 불필요.
  - `devDependencies`에 `@resvg/resvg-js` 추가 (우리 테스트/로컬 PNG 생성용).
  - `dependencies`는 **비운 채로 유지**.

## CLI 인터페이스

```
npx vibetip image --link <kakaopay-url> [옵션]

  --link <url>       (필수) qr.kakaopay.com / link.kakaopay.com 송금 URL
  --out <path>       출력 경로 (기본: ./vibetip-card)
                     .svg  → SVG만
                     .png  → PNG (@resvg/resvg-js 필요)
                     확장자 없음 → <path>.svg (resvg 있으면 <path>.png 도)
  --name <text>      카드에 표시할 이름
  --message <text>   메시지 한 줄
  --label <text>     라벨 (기본: "카카오페이로 후원")
  --accent <color>   포인트 색 (기본: #FFDD00)
  --theme light|dark (기본: light)
  -h, --help         사용법 출력
```

`vibetip` 인자가 `image`가 아니거나 없으면 사용법을 출력한다.

## 데이터 흐름

```
argv → 파싱 → resolveLink(link) 검증 ──실패──> 에러 메시지 + 사용법, exit 1
                     │
                     ▼
              renderCardSvg(opts) → svg 문자열
                     │
                     ├─> <out>.svg 쓰기
                     │
                     └─ PNG 요청? ─yes─> import('@resvg/resvg-js')
                                              ├ 성공 → 래스터화 → <out>.png 쓰기
                                              └ 없음 → 설치 안내, SVG만 (exit 0)
```

## 에러 처리

| 상황 | 동작 |
|------|------|
| `--link` 누락 | 에러 + 사용법, exit 1 |
| 비-카카오페이 URL | `resolveLink`의 기존 에러 메시지, exit 1 |
| 알 수 없는 옵션 | 에러 + 사용법, exit 1 |
| PNG 요청 + resvg 없음 | SVG 저장 + 설치 안내, exit 0 |
| 파일 쓰기 실패 | 에러 throw, exit 1 |

## 테스트

- `renderCardSvg`:
  - 반환값이 `<svg`로 시작하고 닫히는 유효한 SVG.
  - QR `<path>`가 포함된다 (빈 문자열 아님).
  - `name`/`message`가 이스케이프되어 포함된다 (`<script>` 같은 입력이 그대로
    안 들어감).
  - `theme: 'dark'`일 때 배경색이 라이트와 다르다.
- 링크 검증: 비-카카오페이 URL은 `resolveLink`가 throw.
- (선택) CLI 인자 파서 단위 테스트.

저장소에 별도 테스트 러너가 없으므로 Bun 내장 `bun test`를 사용한다 (추가
의존성 없음). 테스트 파일은 `src/card.test.ts`에 둔다.

## 문서

- README에 "이미지로 내보내기" 섹션 추가: `npx vibetip image` 사용 예시, PNG는
  resvg 선택 설치라는 점 명시.
- 생성 예시 이미지를 docs에 한 장 넣는 것도 고려 (선택).

## 영향 받는 파일

- 신규: `src/card.ts`, `src/cli.ts`, `docs`/README 섹션, 테스트 파일.
- 수정: `build.ts`(cli 빌드 + external), `package.json`(bin, devDependency).
- 재사용: `src/presets.ts`(`resolveLink`), `lean-qr`(이미 devDependency).
