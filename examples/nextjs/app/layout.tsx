import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'VibeTip — Next.js 예제',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
