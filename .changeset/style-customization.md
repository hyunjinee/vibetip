---
"vibetip": minor
---

스타일 커스터마이징 개방: 디자인 토큰 10개(`--vt-accent`, `--vt-bg`, `--vt-radius` 등)와 `::part()` 후크 4개(`fab`/`panel`/`link`/`close`)를 공개 계약으로 노출하고, `options.tokens`(스크립트 태그는 `data-tokens`) 옵션을 추가했습니다. 토큰 기본값을 `:host`로 올려 소비자 오버라이드가 통하면서도 Shadow DOM 격리("앱 CSS와 충돌 없음")는 그대로 유지됩니다.
