import { submitFormAction } from "@/actions"
import UnitConverter from "@/components/unit-converter"
import { Suspense } from "react"


export type PageProps = {
  submitFormAction: (formData: FormData) => void,
  requiredParam: { [key: string]: string | undefined } 
}

type SearchParamsProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const requiredParam = await searchParams;
  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8 lg:p-12 flex items-center justify-center">
      <Suspense>
        <UnitConverter submitFormAction={submitFormAction} requiredParam={requiredParam} />
      </Suspense>
    </main>
  )
}
