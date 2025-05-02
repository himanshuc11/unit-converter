import { submitFormAction } from "@/actions"
import UnitConverter from "@/components/unit-converter"
import { QUERY_PARAMS } from "@/constants/query-params"
import { UNIT_TYPES } from "@/constants/unit-types"
import { convertUnit } from "@/lib/converter"
import { UnitType } from "@/types"
import { Suspense } from "react"


export type PageProps = {
  submitFormAction: (formData: FormData) => void,
  result: number,
  requiredParam: { [key: string]: string | undefined } 
}

type SearchParamsProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const requiredParam = await searchParams;

  const type = requiredParam?.[QUERY_PARAMS.TYPE]?.toUpperCase() as keyof typeof UNIT_TYPES;
  const unitType =  type && UNIT_TYPES[type] !== undefined 
      ? UNIT_TYPES[type] as UnitType 
      : UNIT_TYPES.LENGTH;

  const fromUnit = requiredParam?.[QUERY_PARAMS.FROM] as string
  const toUnit = requiredParam?.[QUERY_PARAMS.TO] as string
  const value = parseFloat(requiredParam?.[QUERY_PARAMS.VALUE] as string)

  let result =  await convertUnit(unitType, fromUnit, toUnit, value)

  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8 lg:p-12 flex items-center justify-center">
      <Suspense>
        <UnitConverter submitFormAction={submitFormAction} result={result} requiredParam={requiredParam} />
      </Suspense>
    </main>
  )
}
