# VibeTip 스타일 커스터마이징 설계 (Style Customization)

**작성일:** 2026-06-20
**상태:** 설계 확정 대기 (사용자 리뷰 전)
**범위:** 위젯 스타일을 "공식 지원 표면"으로 여는 것. React 컴포넌트화는 **별도 후속 spec** (이 작업이 먼저).

---

## 1. 목표 (Goal)

VibeTip 위젯을 유저가 자유롭게 커스터마이징할 수 있게 열되, 간판 약속인 **"여러분 앱의 CSS와 절대 충돌하지 않음"(Shadow DOM 격리)** 을 그대로 지킨다.

## 2. 핵심 결정과 근거 (The central decision)

"완전 자유 vs 격리"는 **충돌이 아니다.** Shadow DOM 격리는 *한 방향* — 바깥 페이지의 CSS가 새어 들어오는 것만 막는다. 커스터마이징 채널(CSS 변수 / `::part()` / 열린 `shadowRoot`)은 모두 **소비자 → 컴포넌트 방향의 opt-in**이라, 아무리 열어도 격리 약속은 유지된다. 따라서 진짜 트레이드오프는 *자유 vs 격리*가 아니라 **자유 vs 우리가 앞으로 못 바꾸게 되는 표면(semver 계약)** 이다.

결론: **계층형(layered) 접근.** 토큰은 넉넉히(이미 내부에 16개 존재), 파트는 적게(구조용 4개), 이스케이프 해치는 문서만.

| Tier | 메커니즘 | 파워 / 비용 |
|------|----------|-------------|
| 0 | 의견 있는 기본 테마 (유지) | 없음 — "기본이 예쁨" |
| 1 | 공개 `--vt-*` 토큰 + `options.tokens` | 높은 커버리지 / 리스크 0 |
| 2 | 명명된 `::part()` 4개 | 구조 변경 / semver 계약 |
| 3 | 열린 `shadowRoot` 직접 스타일 — **문서만, 코드 0** | 완전 자유 / 비공식 |

### 격리가 왜 유지되는가 (구현상 핵심)

토큰 기본값을 `:host`에 선언하면, 페이지의 **전역** `--vt-*`(예: `:root{--vt-bg}`)는 host로 상속되더라도 `:host`의 명시 선언이 이겨서 **새어 들어오지 않는다.** 오직 host 요소를 **명시적으로** 겨냥한 선언(`[data-vibetip-widget]{--vt-bg:…}` 또는 `options.tokens` 인라인)만 적용된다. 이것이 "앰비언트 격리 유지 + opt-in 오버라이드"를 동시에 만족시키는 지점이다.

## 3. 공개 계약 (Public, semver-bound)

### 3.1 토큰 (값 커스터마이징) — 10개

| 토큰 | light 기본 | dark 기본 | 의미 |
|------|-----------|-----------|------|
| `--vt-accent` | `#FFDD00` | (동일) | 강조색 (FAB, 호버 하이라이트) |
| `--vt-on-accent` | `#191F28` | (동일) | 강조색 위 텍스트/아이콘 |
| `--vt-bg` | `#F7F8FA` | `#202228` | 패널 배경 |
| `--vt-card` | `#fff` | `#292C34` | 링크/카드 표면 |
| `--vt-text` | `#191F28` | `#F2F4F6` | 1차 텍스트 |
| `--vt-text-2` | `#4E5968` | `#B0B8C1` | 2차 텍스트 |
| `--vt-text-3` | `#8B95A1` | `#7D8692` | 3차 텍스트 |
| `--vt-line` | `#02204714` | `#FFFFFF14` | 테두리 |
| `--vt-ring` | `#3182F6` | `#4D9DFF` | 포커스 링 |
| `--vt-radius` | `28px` | (동일) | **(신규)** 패널 모서리 반경 |

> 나머지 `--vt-*`(`--vt-pop`, `--vt-card-hover`, `--vt-chip`, `--vt-chip-hover`, `--vt-sh-fab/panel/card`, `--vt-scrim`, `--vt-qr-bg`)는 **내부 토큰**이며 공개 계약이 아니다(예고 없이 바뀔 수 있음). 그림자(`--vt-sh-*`)는 사용자 요청 시 추후 공개 검토.

### 3.2 파트 (구조 커스터마이징) — 4개

`fab`, `panel`, `link`, `close`. 사용 예: `[data-vibetip-widget]::part(fab){ border-radius:8px }`.

> 파트 이름은 semver 계약. 이름 변경/제거는 breaking. 그래서 **딱 4개만** 노출해 향후 리팩터 비용을 낮춘다.

### 3.3 이스케이프 해치

`shadowRoot`는 `mode:'open'`이므로 정 안 되면 `el.shadowRoot`에 직접 스타일 가능. **비공식·깨질 수 있음**으로 문서화만. 코드 0줄. "절대 막히지 않음"을 보장해 누구도 fork하지 않게 함(역설적으로 브랜드 약속을 보호).

## 4. 비목표 (Non-goals)

- **`options.css`(임의 CSS 문자열 주입) — 거부.** 내부 클래스(`.vt-link` 등)에 의존하게 만들어 리팩터 시 깨지고, 주입/유지보수 위험. 충돌 표면을 다시 연다.
- **`::theme()` — 거부.** 2026년 현재 미구현·브라우저 지원 없음.
- **헤드리스/라이트 DOM 모드 — 이번 범위 밖.** "드롭인, 기본이 예쁨" 가치 제안을 해친다. 수요 생기면 별도 `@vibetip/core`로.
- **`<slot>` — 부적합.** 헤더/메시지는 이미 `name`/`message` 옵션이 커버.

## 5. 설계 상세 (변경 지점)

### 5.1 `src/styles.ts` — 토큰을 `:host`로

- 현재 `.vt-root{ --vt-accent:…; … }`(line 4)와 `.vt-root[data-theme=dark]{ … }`(line 5)에 있는 **모든 `--vt-*` 토큰 선언을 `:host` / `:host([data-theme=dark])`로 이동.** `.vt-root`에는 `font-family`/`font-size`/`line-height`/`color:var(--vt-text)` 등 비-토큰 스타일만 남긴다(토큰은 `:host`에서 상속).
- `:host` 규칙은 `all:initial`(line 2)과 병합 또는 별도 `:host` 규칙으로 추가. (`all`은 커스텀 프로퍼티를 리셋하지 않으므로 안전.)
- **`--vt-radius:28px`(신규)** 를 `:host`에 추가하고, 패널 반경 하드코딩을 토큰 참조로 교체:
  - `.vt-panel{ … border-radius:28px … }`(line 15) → `border-radius:var(--vt-radius)`
  - `[data-mode=inline] .vt-panel{ … border-radius:26px … }`(line 49) → `border-radius:var(--vt-radius)` (인라인 카드도 동일 반경으로 통일)
  - 모바일 바텀시트 `border-radius:28px 28px 0 0`(line 55) → `border-radius:var(--vt-radius) var(--vt-radius) 0 0`
- **다크모드 QR 배경 토큰화(가독성 유지):** `.vt-qr-code{ … background:#fff … }`(line 40) → `background:var(--vt-qr-bg,#fff)`. `--vt-qr-bg`는 내부 토큰으로 두 테마 모두 기본 `#fff`(QR 스캔 대비 유지). 파워 유저만 조정.

### 5.2 `src/widget.ts` — host로 옮기고 파트/토큰 적용

- **`data-theme`를 host로:** `applyTheme()`에서 `root.setAttribute('data-theme', resolved)` → `host.setAttribute('data-theme', resolved)`. (`data-pos`/`data-mode`는 레이아웃용이므로 `root`에 그대로.)
- **accent를 host로, 그리고 옵션 있을 때만:** 현재 `root.style.setProperty('--vt-accent', options.accent ?? DEFAULT_ACCENT)`(line 66) → `if (options.accent) host.style.setProperty('--vt-accent', options.accent)`. (미지정 시 `:host` 기본값/CSS 오버라이드가 살아 있도록.)
- **토큰 적용:** accent 직후, 검증된 키만 host 인라인으로:
  ```ts
  if (options.tokens) {
    for (const [key, value] of Object.entries(options.tokens)) {
      if (key.startsWith('--')) host.style.setProperty(key, value)
    }
  }
  ```
  `--` 접두 검증으로 임의 CSS 프로퍼티 설정/오용 차단(토큰만 허용). host 인라인이라 **테마 무관 항상 우선**.
- **파트 속성 4개:**
  - `panel.setAttribute('part', 'panel')` (panel 생성 직후)
  - `closeBtn.setAttribute('part', 'close')` (closeBtn 생성 시, floating 모드)
  - 각 `paymentControl.setAttribute('part', 'link')` (링크 루프 안)
  - `fab.setAttribute('part', 'fab')` (fab 생성 시, floating 모드)

### 5.3 `src/types.ts` — `tokens?` 추가

```ts
/**
 * Override design tokens (CSS custom properties), e.g.
 * `{ '--vt-bg': '#111', '--vt-radius': '12px' }`.
 * Keys must start with `--`; others are ignored. Applied inline on the host,
 * so they win over both themes (theme-agnostic).
 */
tokens?: Record<string, string>
```

### 5.4 `src/embed.ts` — `data-tokens`(JSON)

스크립트 태그 자동 초기화에서 동일 기능 제공:
```ts
tokens: script.dataset.tokens ? JSON.parse(script.dataset.tokens) : undefined,
```
(파싱 실패는 기존 `try/catch`가 잡아 콘솔 경고.)

### 5.5 `README.md` — "스타일 커스터마이징" 섹션 추가

기존 내용 보존, 새 섹션만 추가. 포함: (1) 공개 토큰 표, (2) `options.tokens` / `data-tokens` / 순수 CSS(`[data-vibetip-widget]{--vt-bg:…}`, 다크는 `[data-vibetip-widget][data-theme=dark]{…}`) 세 경로, (3) 파트 4개 + `::part` 예시, (4) 이스케이프 해치(비공식). **`options.tokens`를 가장 확실한 경로로 안내**(항상 우선, 테마 무관).

## 6. 테스트 전략 (TDD)

DOM이 필요한 위젯 동작은 `@happy-dom/global-registrator`(devDependency)로 검증. 런타임 의존성 0개 약속은 영향 없음(devDep).

1. **순수 헬퍼 단위 테스트(无 DOM):** 토큰 키 필터링 로직(`--` 접두만 통과)을 작은 순수 함수로 추출해 테스트. 빈 입력/비-`--` 키/유효 키 케이스.
2. **CSS 상수 회귀 테스트:** `CSS` 문자열이 `:host([data-theme=dark])`, `--vt-radius`, `var(--vt-radius)`(패널), `var(--vt-qr-bg`를 포함하고, `.vt-panel`에 `border-radius:28px` 리터럴이 **없음**을 확인.
3. **DOM 테스트(happy-dom):** `createWidget(opts)` 후 host 요소에서:
   - `[part]` 속성이 `fab`/`panel`/`link`/`close`에 존재(모드별).
   - `options.theme:'dark'` → host에 `data-theme="dark"`.
   - `options.tokens:{'--vt-bg':'#000','color':'red'}` → host 인라인에 `--vt-bg`만 설정되고 `color`는 무시.
   - `options.accent` 미지정 시 host에 `--vt-accent` 인라인 없음(CSS 기본값 경로 보존).
4. **빌드 가드:** 기존 `attachShadow`/8KB 가드 통과 확인(번들 무결성).
5. **`tsc --noEmit`** 통과(사용자 규칙).

## 7. 버전/호환성

- **MINOR 범프(예: 0.5.0).** 전부 **추가적(additive)**: 새 공개 토큰/파트/`tokens` 옵션. 기존 API·기본 외형 변화 없음(토큰 값 동일, 선언 위치만 `:host`로 이동 → 사용자 관측 불가).
- 이 시점부터 §3의 토큰 10개 + 파트 4개가 **semver 공개 계약**이 된다.

## 8. 리스크

- **계약 고정 비용:** 파트/토큰 이름은 이후 함부로 못 바꾼다. → 의도적으로 적게(파트 4) 노출.
- **`:host`로 이동 시 외형 회귀 가능성:** 토큰 값은 동일하나 cascade 위치가 바뀜. → CSS 회귀 테스트 + 데모 수동 확인(light/dark/inline/모바일 바텀시트)으로 방어.
- **다크 오버라이드 cascade 미묘함:** 순수 CSS로 다크 토큰을 덮으려면 테마 선택자(`[data-vibetip-widget][data-theme=dark]`)로 명시도를 맞춰야 함 → 문서에 명확히, 그리고 항상-우선인 `options.tokens`를 1순위로 안내.

## 9. 후속 (이 spec 밖)

- **React 컴포넌트 + `useVibeTip` 훅** (별도 spec): `vibetip/react` 서브패스 + React optional peerDependency. 여기서 만든 `tokens`가 props로 자연히 흐른다.
