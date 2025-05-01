"use client"

import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Unit Converter</h1>
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  )
}
