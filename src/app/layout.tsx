import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Staycation21 — Guest Check-in',
  description: 'Online check-in portal for Staycation21, Sonipat',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
