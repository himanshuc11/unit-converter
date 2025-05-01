import UnitConverter from "@/components/unit-converter"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8 lg:p-12 flex items-center justify-center">
      <Suspense>
        <UnitConverter />
      </Suspense>
    </main>
  )
}
