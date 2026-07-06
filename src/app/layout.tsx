import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FountainCraft',
  description: 'Design and build fountains with 3D visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
