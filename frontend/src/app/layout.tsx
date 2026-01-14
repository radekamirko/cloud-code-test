import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Task Automation Platform',
  description: 'Automate your PM work with AI-powered task management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
