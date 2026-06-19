'use client'

import { useEffect, useRef } from 'react'
import { init, type VibeTipInstance } from 'vibetip'

const KAKAO_PAY_URL = 'https://qr.kakaopay.com/Ej8TSKM4J' // ← 본인 카카오페이 송금코드 URL로 바꾸세요

// 서버 컴포넌트에서는 DOM이 없으므로 'use client' + useEffect 안에서만 init합니다.
// 가운데 "패널 열기" 버튼도 이 클라이언트 컴포넌트가 렌더해 위젯 인스턴스와 연결합니다.
export default function VibeTip() {
  const tip = useRef<VibeTipInstance | null>(null)

  useEffect(() => {
    tip.current = init({
      name: 'VibeTip',
      message: '모바일에서는 바로 송금하고, PC에서는 화면의 QR을 스캔해 주세요.',
      links: [KAKAO_PAY_URL],
      accent: '#FFDD00',
      position: 'bottom-right',
      theme: 'auto',
    })
    return () => tip.current?.destroy()
  }, [])

  return (
    <div className="cta-wrap">
      <button
        className="open-panel"
        onClick={(event) => {
          event.stopPropagation()
          tip.current?.open()
        }}
      >
        <svg className="kakaopay-mark" viewBox="0 0 34 34" aria-hidden="true">
          <path
            d="M17 3.5C9.27 3.5 3 8.51 3 14.7c0 4 2.62 7.5 6.56 9.48l-1.4 4.2c-.17.5.4.9.82.62l5-3.35c.98.18 2 .27 3.02.27 7.73 0 14-5.02 14-11.21C31 8.5 24.73 3.5 17 3.5Z"
            fill="currentColor"
          />
        </svg>
        VibeTip 패널 열기
      </button>
      <p className="cta-hint">PC에서는 QR, 모바일에서는 카카오페이 송금 화면이 열립니다.</p>
    </div>
  )
}
