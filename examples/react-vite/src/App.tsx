import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { init, type VibeTipInstance } from 'vibetip'
import './App.css'

const KAKAO_PAY_URL = 'https://qr.kakaopay.com/Ej8TSKM4J'

export default function App() {
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
    <main className="app-shell">
      <section className="intro">
        <span className="eyebrow">VibeTip</span>
        <h1>
          이 앱이 도움이 됐다면
          <br />
          <span>커피 한 잔</span> 보내주세요.
        </h1>
        <p>카카오페이로 간단하고 안전하게 응원할 수 있어요.</p>
      </section>

      <section className="support-card" aria-label="카카오페이 송금 안내">
        <div className="desktop-qr">
          <div className="qr-frame">
            <QRCodeSVG
              value={KAKAO_PAY_URL}
              size={208}
              level="M"
              marginSize={2}
              title="카카오페이 송금 QR코드"
            />
          </div>
          <div className="qr-copy">
            <span className="device-badge">PC에서 접속했나요?</span>
            <h2>휴대폰으로 QR을 스캔하세요</h2>
            <p>기본 카메라나 카카오톡 코드스캔으로 찍으면 카카오페이 송금 화면이 열립니다.</p>
          </div>
        </div>

        <div className="mobile-pay">
          <span className="device-badge">모바일에서 접속했나요?</span>
          <h2>카카오페이로 바로 송금하세요</h2>
          <p>아래 버튼을 누르면 카카오페이 송금 화면으로 이동합니다.</p>
          <a className="pay-button" href={KAKAO_PAY_URL} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">💛</span>
            카카오페이로 송금
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <button
        className="widget-trigger"
        onClick={(event) => {
          event.stopPropagation()
          tip.current?.open()
        }}
      >
        VibeTip 패널 열기
      </button>
    </main>
  )
}
