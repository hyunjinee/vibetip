# VibeTip 이미지 CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `vibetip image` CLI로 카카오페이 송금 링크에서 후원 카드 이미지(SVG 항상 + PNG 선택)를 생성한다.

**Architecture:** 순수 SVG 렌더러(`card.ts`) + 인자 파서(`cli-args.ts`) + 오케스트레이션 진입점(`cli.ts`)으로 분리. PNG는 `@resvg/resvg-js`를 동적 import 해서 있을 때만 생성하고, 없으면 SVG만 만들고 안내한다. 브라우저 위젯의 "런타임 의존성 0"을 지키기 위해 `package.json`의 `dependencies`는 계속 비운다.

**Tech Stack:** TypeScript, Bun(번들러 + `bun test`), lean-qr(QR, 이미 devDependency), @resvg/resvg-js(PNG, devDependency + 런타임 동적 import).

**Spec:** `docs/superpowers/specs/2026-06-20-vibetip-image-cli-design.md`

---

## 파일 구조

- `src/card.ts` (신규) — `renderCardSvg(opts)`: 카드 SVG 문자열 생성. lean-qr로 QR path 조립, 텍스트 이스케이프, 링크 검증(`detectType`).
- `src/card.test.ts` (신규) — `renderCardSvg` 단위 테스트.
- `src/cli-args.ts` (신규) — `parseArgs(argv)`: 부수효과 없는 순수 인자 파서 + 타입.
- `src/cli-args.test.ts` (신규) — `parseArgs` 단위 테스트.
- `src/cli.ts` (신규) — bin 진입점. `parseArgs` + `renderCardSvg` + 파일 쓰기 + PNG 동적 import. 끝에서 자동 실행.
- `build.ts` (수정) — `dist/cli.js` 빌드 추가(resvg external), 셔뱅 주입 + chmod.
- `package.json` (수정) — `bin`, `scripts.test`, devDependency `@resvg/resvg-js`.
- `README.md` (수정) — "이미지로 내보내기" 섹션.

---

## Task 1: `src/card.ts` — 카드 SVG 렌더러

**Files:**
- Create: `src/card.ts`
- Test: `src/card.test.ts`
- Reuse: `src/presets.ts` (`detectType`), `lean-qr`

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/card.test.ts`:

```ts
import { expect, test } from 'bun:test'
import { renderCardSvg } from './card'

const URL = 'https://qr.kakaopay.com/Ej8TSKM4J'

test('유효한 svg를 반환한다', () => {
  const svg = renderCardSvg({ url: URL })
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg.trimEnd().endsWith('</svg>')).toBe(true)
})

test('QR path를 포함한다', () => {
  const svg = renderCardSvg({ url: URL })
  expect(svg).toContain('<path')
  expect(svg).toMatch(/d="M\d+ \d+h1v1h-1z/)
})

test('이름과 메시지를 이스케이프한다', () => {
  const svg = renderCardSvg({ url: URL, name: '<script>', message: 'a & b' })
  expect(svg).not.toContain('<script>')
  expect(svg).toContain('&lt;script&gt;')
  expect(svg).toContain('a &amp; b')
})

test('카카오페이가 아닌 링크는 거부한다', () => {
  expect(() => renderCardSvg({ url: 'https://paypal.me/x' })).toThrow('unsupported payment link')
})

test('다크 테마는 라이트와 다르다', () => {
  const light = renderCardSvg({ url: URL, theme: 'light' })
  const dark = renderCardSvg({ url: URL, theme: 'dark' })
  expect(light).not.toBe(dark)
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `bun test src/card.test.ts`
Expected: FAIL — `Cannot find module './card'` (또는 `renderCardSvg is not a function`).

- [ ] **Step 3: `src/card.ts` 구현**

Create `src/card.ts`:

```ts
import { correction, generate } from 'lean-qr'
import { detectType } from './presets'

export interface CardOptions {
  /** 검증된 카카오페이 송금 URL */
  url: string
  name?: string
  message?: string
  /** 기본: "카카오페이로 후원" */
  label?: string
  /** 기본: #FFDD00 */
  accent?: string
  /** 기본: light */
  theme?: 'light' | 'dark'
}

const THEMES = {
  light: { bg: '#ffffff', text: '#191f28', sub: '#6b7684', border: '#02204714', brand: '#8b95a1' },
  dark: { bg: '#202228', text: '#f2f4f6', sub: '#b0b8c1', border: '#ffffff1a', brand: '#7d8692' },
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ESCAPES[c])
}

function qrPath(url: string): { path: string; size: number } {
  const code = generate(url, { minCorrectionLevel: correction.M })
  const size = code.size
  let path = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (code.get(x, y)) path += `M${x} ${y}h1v1h-1z`
    }
  }
  return { path, size }
}

const W = 420
// 폰트 패밀리 안의 따옴표는 속성값(이중따옴표) 안에 들어가므로 미리 이스케이프한다.
const FONT =
  '-apple-system, BlinkMacSystemFont, &quot;Apple SD Gothic Neo&quot;, &quot;Noto Sans KR&quot;, sans-serif'

export function renderCardSvg(opts: CardOptions): string {
  detectType(opts.url) // 카카오페이가 아니면 throw
  const t = THEMES[opts.theme === 'dark' ? 'dark' : 'light']
  const accent = opts.accent ?? '#FFDD00'
  const label = opts.label ?? '카카오페이로 후원'
  const { path, size } = qrPath(opts.url)

  const frame = 236
  const frameX = (W - frame) / 2
  const frameY = 28
  const inner = 212
  const innerOffset = (frame - inner) / 2
  const quiet = 2

  const parts: string[] = []
  let cursor = frameY + frame + 40

  if (opts.name) {
    parts.push(
      `<text x="${W / 2}" y="${cursor}" text-anchor="middle" font-size="24" font-weight="800" fill="${t.text}">${esc(opts.name)}</text>`,
    )
    cursor += 34
  }
  if (opts.message) {
    parts.push(
      `<text x="${W / 2}" y="${cursor}" text-anchor="middle" font-size="15" fill="${t.sub}">${esc(opts.message)}</text>`,
    )
    cursor += 30
  }

  cursor += 8
  const pillH = 48
  const pillX = 36
  const pillW = W - pillX * 2
  parts.push(
    `<rect x="${pillX}" y="${cursor}" width="${pillW}" height="${pillH}" rx="14" fill="${accent}"/>` +
      `<text x="${W / 2}" y="${cursor + pillH / 2 + 6}" text-anchor="middle" font-size="17" font-weight="800" fill="#191f28">${esc(label)}</text>`,
  )
  cursor += pillH + 30

  parts.push(
    `<text x="${W / 2}" y="${cursor}" text-anchor="middle" font-size="12" fill="${t.brand}">Powered by VibeTip</text>`,
  )
  cursor += 24

  const H = cursor

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">` +
    `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="28" fill="${t.bg}" stroke="${t.border}"/>` +
    `<rect x="${frameX}" y="${frameY}" width="${frame}" height="${frame}" rx="20" fill="#ffffff" stroke="${t.border}"/>` +
    `<svg x="${frameX + innerOffset}" y="${frameY + innerOffset}" width="${inner}" height="${inner}" viewBox="${-quiet} ${-quiet} ${size + quiet * 2} ${size + quiet * 2}" shape-rendering="crispEdges">` +
    `<path d="${path}" fill="#111111"/></svg>` +
    parts.join('') +
    `</svg>`
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `bun test src/card.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: 타입체크**

Run: `bunx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 6: 커밋**

```bash
git add src/card.ts src/card.test.ts
git commit -m "feat: renderCardSvg — KakaoPay support card as SVG"
```

---

## Task 2: `src/cli-args.ts` — 인자 파서

**Files:**
- Create: `src/cli-args.ts`
- Test: `src/cli-args.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/cli-args.test.ts`:

```ts
import { expect, test } from 'bun:test'
import { parseArgs } from './cli-args'

test('플래그를 파싱한다', () => {
  const a = parseArgs(['--link', 'https://qr.kakaopay.com/x', '--name', '홍길동'])
  expect(a.link).toBe('https://qr.kakaopay.com/x')
  expect(a.name).toBe('홍길동')
})

test('-h는 help를 켠다', () => {
  expect(parseArgs(['-h']).help).toBe(true)
  expect(parseArgs(['--help']).help).toBe(true)
})

test('알 수 없는 옵션은 throw', () => {
  expect(() => parseArgs(['--nope', 'x'])).toThrow('unknown option')
})

test('값 없는 플래그는 throw', () => {
  expect(() => parseArgs(['--link'])).toThrow('missing value')
})

test('잘못된 theme은 throw', () => {
  expect(() => parseArgs(['--theme', 'blue'])).toThrow("'light' or 'dark'")
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `bun test src/cli-args.test.ts`
Expected: FAIL — `Cannot find module './cli-args'`.

- [ ] **Step 3: `src/cli-args.ts` 구현**

Create `src/cli-args.ts`:

```ts
export interface CliArgs {
  link?: string
  out?: string
  name?: string
  message?: string
  label?: string
  accent?: string
  theme?: 'light' | 'dark'
  help?: boolean
}

const FLAGS = ['link', 'out', 'name', 'message', 'label', 'accent', 'theme'] as const

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-h' || a === '--help') {
      args.help = true
      continue
    }
    if (!a.startsWith('--')) {
      throw new Error(`unexpected argument: ${a}`)
    }
    const key = a.slice(2)
    if (!(FLAGS as readonly string[]).includes(key)) {
      throw new Error(`unknown option: ${a}`)
    }
    const value = argv[++i]
    if (value === undefined) {
      throw new Error(`missing value for ${a}`)
    }
    if (key === 'theme' && value !== 'light' && value !== 'dark') {
      throw new Error(`--theme must be 'light' or 'dark'`)
    }
    ;(args as Record<string, string>)[key] = value
  }
  return args
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `bun test src/cli-args.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: 커밋**

```bash
git add src/cli-args.ts src/cli-args.test.ts
git commit -m "feat: CLI argument parser"
```

---

## Task 3: `src/cli.ts` — bin 진입점

**Files:**
- Create: `src/cli.ts`
- Uses: `src/card.ts`, `src/cli-args.ts`, `@resvg/resvg-js`(동적)

- [ ] **Step 1: `src/cli.ts` 구현**

Create `src/cli.ts`:

```ts
#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { extname } from 'node:path'
import { renderCardSvg } from './card'
import { parseArgs } from './cli-args'

const USAGE = `vibetip image — 카카오페이 후원 카드 이미지 생성

사용법:
  npx vibetip image --link <kakaopay-url> [옵션]

옵션:
  --link <url>          (필수) qr.kakaopay.com / link.kakaopay.com 송금 URL
  --out <path>          출력 경로 (기본: vibetip-card)
                        .svg → SVG만 / .png → PNG / 확장자 없음 → .svg(+가능하면 .png)
  --name <text>         카드에 표시할 이름
  --message <text>      메시지 한 줄
  --label <text>        라벨 (기본: 카카오페이로 후원)
  --accent <color>      포인트 색 (기본: #FFDD00)
  --theme <light|dark>  (기본: light)
  -h, --help            이 도움말`

const PNG_HINT = 'PNG를 만들려면 @resvg/resvg-js 가 필요합니다: npm i -D @resvg/resvg-js'

async function svgToPng(svg: string): Promise<Uint8Array | null> {
  try {
    const mod = await import('@resvg/resvg-js')
    return new mod.Resvg(svg).render().asPng()
  } catch (err) {
    const e = err as NodeJS.ErrnoException
    if (e.code === 'ERR_MODULE_NOT_FOUND' || /Cannot find (module|package)/.test(e.message ?? '')) {
      return null
    }
    throw err
  }
}

export async function run(argv: string[]): Promise<void> {
  if (argv[0] !== 'image') {
    console.log(USAGE)
    return
  }
  const args = parseArgs(argv.slice(1))
  if (args.help) {
    console.log(USAGE)
    return
  }
  if (!args.link) {
    throw new Error(`--link 가 필요합니다.\n\n${USAGE}`)
  }

  const svg = renderCardSvg({
    url: args.link,
    name: args.name,
    message: args.message,
    label: args.label,
    accent: args.accent,
    theme: args.theme,
  })

  const out = args.out ?? 'vibetip-card'
  const ext = extname(out).toLowerCase()

  if (ext === '.svg') {
    writeFileSync(out, svg)
    console.log(`✓ ${out}`)
    return
  }
  if (ext === '.png') {
    const png = await svgToPng(svg)
    if (!png) throw new Error(PNG_HINT)
    writeFileSync(out, png)
    console.log(`✓ ${out}`)
    return
  }
  writeFileSync(`${out}.svg`, svg)
  console.log(`✓ ${out}.svg`)
  const png = await svgToPng(svg)
  if (png) {
    writeFileSync(`${out}.png`, png)
    console.log(`✓ ${out}.png`)
  } else {
    console.log(`(PNG 건너뜀) ${PNG_HINT}`)
  }
}

run(process.argv.slice(2)).catch((err) => {
  console.error(`[vibetip] ${err instanceof Error ? err.message : err}`)
  process.exit(1)
})
```

- [ ] **Step 2: 타입체크**

Run: `bunx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 3: SVG 생성 수동 검증 (소스 직접 실행)**

Run: `bun src/cli.ts image --link https://qr.kakaopay.com/Ej8TSKM4J --name 테스트 --out /tmp/vt-card.svg`
Expected: `✓ /tmp/vt-card.svg` 출력, 파일 존재.

Run: `head -c 60 /tmp/vt-card.svg`
Expected: `<svg xmlns="http://www.w3.org/2000/svg"` 로 시작.

- [ ] **Step 4: 비-카카오페이 거부 검증**

Run: `bun src/cli.ts image --link https://paypal.me/x --out /tmp/x.svg; echo "exit=$?"`
Expected: `[vibetip] ... unsupported payment link ...` 출력, `exit=1`.

- [ ] **Step 5: 커밋**

```bash
git add src/cli.ts
git commit -m "feat: vibetip image CLI entry point"
```

---

## Task 4: 빌드 & 패키징

**Files:**
- Modify: `build.ts`
- Modify: `package.json`

- [ ] **Step 1: `build.ts`에 CLI 빌드 추가**

`build.ts`의 `iife` 빌드 블록 바로 다음(`for (const result of [esm, iife])` 위)에 추가:

```ts
  // CLI build (bin: `vibetip`). @resvg/resvg-js stays external so it is loaded
  // dynamically at runtime only when present.
  const cli = await Bun.build({
    entrypoints: ['src/cli.ts'],
    outdir: 'dist',
    naming: 'cli.js',
    format: 'esm',
    target: 'node',
    external: ['@resvg/resvg-js'],
    minify: true,
    sourcemap: 'linked',
  })
```

그리고 success 검사 루프를 `[esm, iife]` → `[esm, iife, cli]`로 바꾼다:

```ts
  for (const result of [esm, iife, cli]) {
```

- [ ] **Step 2: `build.ts`에 셔뱅 주입 + 실행권한**

`build.ts` 상단 import에 `chmodSync, readFileSync, writeFileSync`를 추가:

```ts
import { chmodSync, readFileSync, watch, writeFileSync } from 'node:fs'
```

가드 루프(`for (const file of ['dist/vibetip.js', ...])`) **다음**, `console.log(...)` **앞**에 추가:

```ts
  // dist/cli.js must be an executable node script with a shebang (bin entry).
  const cliPath = 'dist/cli.js'
  const cliCode = readFileSync(cliPath, 'utf8')
  if (!cliCode.startsWith('#!')) {
    writeFileSync(cliPath, `#!/usr/bin/env node\n${cliCode}`)
  }
  chmodSync(cliPath, 0o755)
```

- [ ] **Step 3: `package.json` — bin, test 스크립트, devDependency**

`package.json`에 다음을 반영한다.

`"bin"` 추가 (예: `"types"` 다음 줄):
```json
  "bin": {
    "vibetip": "dist/cli.js"
  },
```

`"scripts"`에 test 추가:
```json
    "test": "bun test",
```

`"devDependencies"`에 추가:
```json
    "@resvg/resvg-js": "^2.6.2",
```

- [ ] **Step 4: 의존성 설치 + dependencies가 비어있는지 확인**

Run: `bun install`
Expected: 설치 성공.

Run: `node -e "const p=require('./package.json'); if (p.dependencies && Object.keys(p.dependencies).length) { console.error('dependencies must stay empty', p.dependencies); process.exit(1) } console.log('deps empty OK')"`
Expected: `deps empty OK` (런타임 의존성 0 유지 확인).

- [ ] **Step 5: 빌드 + 가드 통과 + cli.js 셔뱅 확인**

Run: `bun run build`
Expected: `built dist/vibetip.js + dist/vibetip.iife.js`, 에러 없음.

Run: `head -1 dist/cli.js`
Expected: `#!/usr/bin/env node`.

- [ ] **Step 6: 빌드 산출물로 SVG + PNG 생성 검증**

Run: `node dist/cli.js image --link https://qr.kakaopay.com/Ej8TSKM4J --name 테스트 --message "커피 한 잔" --out /tmp/vt-built`
Expected: `✓ /tmp/vt-built.svg` 와 `✓ /tmp/vt-built.png` 둘 다 출력 (resvg가 devDependency로 설치됨).

Run: `file /tmp/vt-built.png`
Expected: `PNG image data, 420 x ...`.

- [ ] **Step 7: 전체 테스트 + 타입체크**

Run: `bun test`
Expected: 모든 테스트 PASS.

Run: `bunx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 8: 커밋**

```bash
git add build.ts package.json bun.lock
git commit -m "build: bundle vibetip image CLI as bin, keep deps empty"
```

---

## Task 5: README 문서화

**Files:**
- Modify: `README.md`

- [ ] **Step 1: "이미지로 내보내기" 섹션 추가**

`README.md`의 `## Examples` 섹션 **앞**에 다음을 삽입한다:

```markdown
## 이미지로 내보내기

위젯은 자바스크립트가 도는 페이지에서만 뜹니다. GitHub README·Notion·블로그처럼
스크립트를 못 붙이는 곳에는 **후원 카드 이미지**를 만들어 붙이세요.

```bash
npx vibetip image --link https://qr.kakaopay.com/your-code --name 홍길동 --out tip
```

- `tip.svg`가 생성됩니다 (의존성 없이 항상).
- `@resvg/resvg-js`가 설치돼 있으면 `tip.png`도 함께 생성됩니다
  (`npm i -D @resvg/resvg-js`). Notion 등 SVG가 안 보이는 곳엔 PNG를 쓰세요.

옵션: `--message`, `--label`, `--accent`, `--theme light|dark`. 자세한 건
`npx vibetip image --help`.
```

(주의: 위 코드펜스는 README에 넣을 때 바깥 펜스와 충돌하지 않도록 그대로 4-backtick 없이 일반 ```` ``` ````로 들어가야 한다. 실제 삽입 시 `## 이미지로 내보내기` 부터 마지막 문장까지를 README에 추가한다.)

- [ ] **Step 2: 미리보기로 깨짐 없는지 확인**

Run: `sed -n '/## 이미지로 내보내기/,/## Examples/p' README.md`
Expected: 새 섹션이 올바르게 들어가고 `## Examples`가 뒤따른다.

- [ ] **Step 3: 커밋**

```bash
git add README.md
git commit -m "docs: document vibetip image CLI"
```

---

## Self-Review 메모

- **스펙 커버리지:** CLI(`image`), SVG 항상/PNG 선택(Task 3·4), 디자인 카드(Task 1), 0-dep 유지(Task 4 Step 4), 링크 검증(Task 1·3), 에러 처리(Task 3), 테스트(Task 1·2), 문서(Task 5) — 모두 태스크 있음.
- **타입 일관성:** `renderCardSvg(CardOptions)` / `parseArgs(argv): CliArgs` / `run(argv)` 시그니처가 태스크 간 일치. CLI는 `CardOptions`에 `args`를 그대로 매핑.
- **PNG 의존성:** `dependencies` 비움, `@resvg/resvg-js`는 devDependency + 런타임 동적 import + external 번들 → 0-dep 유지(Task 4 Step 4에서 강제 검증).
```
