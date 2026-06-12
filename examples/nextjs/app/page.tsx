import VibeTip from './vibetip'

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: '60px auto', padding: '0 20px', lineHeight: 1.7 }}>
      <h1>▲ VibeTip + Next.js (App Router)</h1>
      <p>
        이 페이지는 서버 컴포넌트이고, 위젯은 <code>app/vibetip.tsx</code>의{' '}
        <code>&apos;use client&apos;</code> 컴포넌트가 마운트합니다.
      </p>
    </main>
  )
}
