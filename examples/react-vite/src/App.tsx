import { useEffect, useRef } from 'react'
import { init, type VibeTipInstance } from 'vibetip'

export default function App() {
  const tip = useRef<VibeTipInstance | null>(null)

  useEffect(() => {
    // 마운트 시 위젯 생성, 언마운트 시 destroy — SPA에서 안전한 패턴
    tip.current = init({
      name: '홍길동',
      message: '이 앱이 도움이 됐다면 커피 한 잔!',
      links: [
        'https://qr.kakaopay.com/your-code',
        'https://ctee.kr/place/yourname',
        { url: 'https://example.com/donate', label: '직접 후원', icon: '🎁' },
      ],
      accent: '#FFDD00',
      position: 'bottom-right',
      theme: 'auto',
    })
    return () => tip.current?.destroy()
  }, [])

  return (
    <main style={{ maxWidth: 640, margin: '60px auto', padding: '0 20px', lineHeight: 1.7 }}>
      <h1>⚛️ VibeTip + React</h1>
      <p>
        <code>init()</code>이 돌려주는 핸들로 위젯을 코드에서 제어할 수 있습니다.
      </p>
      <button onClick={() => tip.current?.open()}>패널 열기</button>{' '}
      <button onClick={() => tip.current?.close()}>패널 닫기</button>
    </main>
  )
}
