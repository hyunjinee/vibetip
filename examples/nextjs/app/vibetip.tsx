'use client'

import { useEffect } from 'react'
import { init } from 'vibetip'

// 서버 컴포넌트에서는 DOM이 없으므로 'use client' + useEffect 안에서만 init합니다.
export default function VibeTip() {
  useEffect(() => {
    const tip = init({
      name: '홍길동',
      message: '이 앱이 도움이 됐다면 커피 한 잔!',
      links: [
        'https://qr.kakaopay.com/your-code',
        'https://ctee.kr/place/yourname',
        'https://github.com/sponsors/yourname',
      ],
      theme: 'auto',
    })
    return () => tip.destroy()
  }, [])

  return null
}
