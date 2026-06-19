'use client'

import { useEffect } from 'react'
import { init } from 'vibetip'

// 서버 컴포넌트에서는 DOM이 없으므로 'use client' + useEffect 안에서만 init합니다.
export default function VibeTip() {
  useEffect(() => {
    const tip = init({
      name: 'VibeTip',
      message: '모바일에서는 바로 송금하고, PC에서는 화면의 QR을 스캔해 주세요.',
      links: ['https://qr.kakaopay.com/Ej8TSKM4J'], // ← 본인 카카오페이 송금코드 URL로 바꾸세요
      accent: '#FFDD00',
      position: 'bottom-right',
      theme: 'auto',
    })
    return () => tip.destroy()
  }, [])

  return null
}
