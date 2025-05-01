import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Unit Converter - Convert Length, Weight, Temperature, and Currency",
  description:
    "A powerful unit converter tool that allows you to convert between different units of length, weight, temperature, and currency with real-time exchange rates.",
  keywords: [
    "unit converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "currency converter",
    "metric conversion",
  ],
  authors: [{ name: "Unit Converter App" }],
  openGraph: {
    title: "Unit Converter - Convert Length, Weight, Temperature, and Currency",
    description:
      "A powerful unit converter tool that allows you to convert between different units of length, weight, temperature, and currency with real-time exchange rates.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
