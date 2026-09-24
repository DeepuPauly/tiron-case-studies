
import React from 'react'
import './styles.css'

export const metadata = {
  title: 'Tiron | Case Studies',
  description:
    'Explore our portfolio of web development, mobile applications, UI/UX design, and digital marketing projects.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  )
}