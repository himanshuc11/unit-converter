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

type Props = {
    tabProps: React.ComponentPropsWithoutRef<typeof Tabs>
}

const Option = ({children}: {children: React.ReactElement}) => {
    return <option className= "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">{children}</option>
}

function ServerOnly(props: Props) {
    const { tabProps } = props;

    const calculatedSchema = getCalculatedSchemaForValidation("")

    const unitType = UNIT_TYPES.LENGTH
    const fromUnit = LENGTH_OPTIONS.mm
    const toUnit = LENGTH_OPTIONS.cm

    const form = useForm<z.infer<typeof calculatedSchema>>({
      resolver: zodResolver(calculatedSchema),
      defaultValues: {
        fromValue: 0,
        fromUnit: "",
        toUnit: "",
      },
    });

  // For non-JS fallback
  function onSubmitNoJS(e: React.FormEvent<HTMLFormElement>) {
    // This will be handled by the server if JS is disabled
    // The form will submit and reload the page with the new URL parameters
  }

  return (
    <Tabs {...tabProps}  className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value={UNIT_TYPES.LENGTH}>Length</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.TEMPERATURE}>Temperature</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.WEIGHT}>Weight</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.CURRENCY}>Currency</TabsTrigger>
        </TabsList>

        <Form {...form}>
            <form
              onSubmit={(e) => {
                onSubmitNoJS(e)
              }}
              className="space-y-6"
              action={`?type=${unitType}`}
              method="get"
            >
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

              {/* <div className="p-4 bg-muted rounded-md text-center">
                {isLoading ? (
                  <div className="animate-pulse">Converting...</div>
                ) : result !== null ? (
                  <div className="text-xl font-semibold">
                    {form.getValues("fromValue")} {fromUnit} ={" "}
                    {result.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                      minimumFractionDigits: 0,
                    })}{" "}
                    {toUnit}
                  </div>
                ) : (
                  <div className="text-muted-foreground">Conversion result will appear here</div>
                )}
              </div> */}

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