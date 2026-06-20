# VibeTip 스타일 커스터마이징 구현 플랜

> **실행:** 태스크들이 `styles.ts`/`widget.ts`에 강결합 → **인라인 TDD 실행**. 각 태스크는 red→green→commit.

**목표:** 위젯 스타일을 공개 토큰 10 + 파트 4 + 이스케이프 해치로 열되 Shadow DOM 격리 유지.

**아키텍처:** 토큰 기본값을 `:host`(다크는 `:host([data-theme=dark])`)로 올리고 `data-theme`를 host로 이동 → 유저 오버라이드 통하고 앰비언트 격리 유지. `options.tokens`는 host 인라인(항상 우선). 파트는 `setAttribute('part',…)` 4개.

**기술:** Bun test + `@happy-dom/global-registrator`(devDep), TypeScript, Bun bundler.

**참조 spec:** `docs/superpowers/specs/2026-06-20-vibetip-style-customization-design.md`

---

## Task 1: happy-dom 테스트 인프라

**Files:** Create `happydom.ts`, `bunfig.toml`; Modify `package.json`(devDep).

- [ ] `bun add -d @happy-dom/global-registrator`
- [ ] `happydom.ts`: `import { GlobalRegistrator } from '@happy-dom/global-registrator'; GlobalRegistrator.register()`
- [ ] `bunfig.toml`: `[test]\npreload = ["./happydom.ts"]`
- [ ] `bun test` — 기존 카드/cli-args 테스트 여전히 통과(회귀 없음) 확인
- [ ] commit

## Task 2: 토큰 필터 헬퍼 (순수)

**Files:** Create `src/tokens.ts`, `src/tokens.test.ts`.

- [ ] **test(red):** `filterTokenEntries({'--vt-bg':'#000','color':'red','--vt-radius':'8px'})` → `[['--vt-bg','#000'],['--vt-radius','8px']]`; `undefined`/`{}` → `[]`.
- [ ] `src/tokens.ts`:
  ```ts
  export function filterTokenEntries(tokens?: Record<string, string>): [string, string][] {
    if (!tokens) return []
    return Object.entries(tokens).filter(([k]) => k.startsWith('--'))
  }
  ```
- [ ] `bun test src/tokens.test.ts` green → commit

## Task 3: styles.ts — 토큰을 `:host`로 + radius/qr 토큰화

**Files:** Modify `src/styles.ts`, Create `src/styles.test.ts`.

- [ ] **test(red):** `CSS` 문자열이 `:host([data-theme=dark])`, `--vt-radius:`, `var(--vt-radius)`, `var(--vt-qr-bg` 포함; `.vt-panel{...border-radius:28px` 리터럴 **불포함**; `.vt-root[data-theme=dark]` 불포함.
- [ ] styles.ts 변경: 토큰 선언 `.vt-root`→`:host`, 다크 `.vt-root[data-theme=dark]`→`:host([data-theme=dark])`(+`--vt-radius:28px`, `--vt-qr-bg`는 light/dark 동일 `#fff`로 명시 안 해도 fallback 사용), `.vt-panel`·inline·모바일 반경 → `var(--vt-radius)`, `.vt-qr-code` 배경 → `var(--vt-qr-bg,#fff)`. `.vt-root`엔 폰트/색만 남김.
- [ ] `bun test src/styles.test.ts` green
- [ ] `tsc --noEmit` 통과 → commit

## Task 4: types.ts + embed.ts — `tokens` 옵션

**Files:** Modify `src/types.ts`, `src/embed.ts`.

- [ ] `types.ts` `VibeTipOptions`에 `tokens?: Record<string, string>` 추가(JSDoc).
- [ ] `embed.ts` init 호출에 `tokens: script.dataset.tokens ? JSON.parse(script.dataset.tokens) : undefined,` 추가.
- [ ] `tsc --noEmit` 통과 → commit

## Task 5: widget.ts — host 이동 + 파트 + 토큰 적용 (DOM 테스트)

**Files:** Modify `src/widget.ts`, Create `src/widget.test.ts`.

- [ ] **test(red, happy-dom):** `createWidget({links:[URL]})` 후 `document.querySelector('[data-vibetip-widget]')` host에서:
  - `host.shadowRoot.querySelector('[part="panel"]')`, `[part="fab"]`, `[part="close"]`, `[part="link"]` 존재.
  - `theme:'dark'` → `host.getAttribute('data-theme')==='dark'`.
  - `tokens:{'--vt-bg':'#000','color':'red'}` → `host.style.getPropertyValue('--vt-bg')==='#000'` 이고 `host.style.color===''`(무시).
  - accent 미지정 → `host.style.getPropertyValue('--vt-accent')===''`; `accent:'#111'` → `'#111'`.
  - 각 테스트 후 `instance.destroy()`로 정리.
- [ ] widget.ts 변경: `applyTheme`에서 `host.setAttribute('data-theme',…)`; accent `if (options.accent) host.style.setProperty('--vt-accent', options.accent)`; `filterTokenEntries(options.tokens)` 루프 `host.style.setProperty`; `panel`/`closeBtn`/`paymentControl`/`fab`에 `part` 속성.
- [ ] `bun test` 전체 green
- [ ] `tsc --noEmit` 통과 → commit

## Task 6: README — 스타일 커스터마이징 섹션

**Files:** Modify `README.md`.

- [ ] 기존 보존, "스타일 커스터마이징" 섹션 추가: 토큰 표 + 3경로(`options.tokens` 1순위 / 순수 CSS+다크 스코프 / `::part`) + 이스케이프 해치.
- [ ] commit

## Task 7: 빌드 가드 + 릴리즈 준비

**Files:** Create `.changeset/*.md`.

- [ ] `bun run build` — 가드 통과(번들 무결성), `tsc --emitDeclarationOnly` 성공.
- [ ] `bun test` 전체 green, `tsc --noEmit` 통과.
- [ ] 데모 수동 확인(light/dark/inline/모바일 바텀시트 외형 회귀 없음).
- [ ] changeset(minor): "feat: expose style tokens, ::part hooks, and options.tokens".
- [ ] commit
