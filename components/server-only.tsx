import { QUERY_PARAMS } from '@/constants/query-params'
import { UNIT_TYPES } from '@/constants/unit-types'
import { getCalculatedSchemaForValidation } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import React from 'react'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import UnitOptions from './ui-options'
import { LENGTH_OPTIONS } from '@/constants/options'
import { useForm } from 'react-hook-form'
import { PageProps } from '@/app/page'
import { UnitType } from '@/types'
import { convertUnit } from '@/lib/converter'


const Option = ({children}: {children: React.ReactElement}) => {
    return <option className= "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">{children}</option>
}

async function ServerOnly(props: PageProps) {
    const { requiredParam: searchParams } = props

    const type = searchParams?.[QUERY_PARAMS.TYPE]?.toUpperCase() as keyof typeof UNIT_TYPES;
    const unitType =  type && UNIT_TYPES[type] !== undefined 
            ? UNIT_TYPES[type] as UnitType 
            : UNIT_TYPES.LENGTH;

    const fromUnit = searchParams?.[QUERY_PARAMS.FROM] as string
    const toUnit = searchParams?.[QUERY_PARAMS.TO] as string
    const value = parseFloat(searchParams?.[QUERY_PARAMS.VALUE] as string)

    let result =  await convertUnit(unitType, fromUnit, toUnit, value)
    const calculatedSchema = getCalculatedSchemaForValidation(fromUnit)

    const form = useForm<z.infer<typeof calculatedSchema>>({
      resolver: zodResolver(calculatedSchema),
      defaultValues: {
        fromValue: 0,
        fromUnit: "",
        toUnit: "",
      },
    });

  return (
    <Tabs  className="w-full">
        <Form {...form}>
            <form
              className="space-y-6"
              action={props.submitFormAction}
              method="post"
            >
        <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value={UNIT_TYPES.LENGTH} name={UNIT_TYPES.LENGTH} type='submit'>Length</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.TEMPERATURE} name={UNIT_TYPES.TEMPERATURE} type='submit'>Temperature</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.WEIGHT} name={UNIT_TYPES.WEIGHT} type='submit'>Weight</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.CURRENCY} name={UNIT_TYPES.CURRENCY} type='submit'>Currency</TabsTrigger>
        </TabsList>
              {/* Hidden inputs for non-JS form submission */}
              <input type="hidden" name={QUERY_PARAMS.TYPE} value={unitType} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        Value <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter value"
                          {...field}
                          name={QUERY_PARAMS.VALUE}
                          className={form.formState.errors.fromValue ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        From <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                        <select className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1' >
                            <UnitOptions type={unitType} RenderItem={Option} />
                        </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="toUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex">
                      To <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <select className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1' >
                        <UnitOptions type={unitType} RenderItem={Option} />
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {result && (<div className="text-xl font-semibold">
                    {value} {fromUnit} ={" "}
                    {result.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                      minimumFractionDigits: 0,
                    })}{" "}
                    {toUnit}
                </div>
)}
              {/* Submit button for non-JS fallback */}
              <noscript>
                <button type="submit" className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md">
                  Convert
                </button>
              </noscript>
            </form>
          </Form>
    </Tabs>
  )
}

export default ServerOnly