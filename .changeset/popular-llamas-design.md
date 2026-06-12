---
"vibetip": minor
---

디자인 전면 개편 + 인라인 마운트 지원

- K-핀테크 디자인 언어로 전면 리디자인: 토큰 기반 라이트/다크 테마, pill→원형 버튼 모핑, 모바일 바텀시트(그래버·스크림·safe-area), accent 연동 호버 글로우, 한글 줄바꿈 안전(`word-break: keep-all`)
- `mount` 옵션 신설 — 플로팅 버튼 대신 지정 요소 안에 인라인 카드로 렌더링 (`data-mount` 속성 지원)
- 플로팅 버튼 아이콘을 이모지(☕)에서 inline SVG 스파크(✦)로 교체 — OS별 렌더링 차이 제거
- "Powered by VibeTip" 출처 링크를 실제 저장소(hyunjinee/vibetip)로 수정
