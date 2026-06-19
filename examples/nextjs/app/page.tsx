import VibeTip from './vibetip'

export default function Home() {
  return (
    <main className="app-shell">
      <section className="intro">
        <span className="eyebrow">VibeTip · Next.js</span>
        <h1>
          이 앱이 도움이 됐다면
          <br />
          <span>커피 한 잔</span> 보내주세요.
        </h1>
        <p>App Router 서버 컴포넌트로 렌더링하고, 위젯은 클라이언트 컴포넌트가 마운트합니다.</p>
      </section>

      <VibeTip />
    </main>
  )
}
