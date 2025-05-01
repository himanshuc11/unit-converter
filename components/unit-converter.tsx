"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAtom } from "jotai"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { unitTypeAtom, fromUnitAtom, toUnitAtom } from "@/lib/atoms"
import { convertUnit } from "@/lib/converter"
import { UNIT_TYPES } from "@/constants/unit-types"
import { QUERY_PARAMS } from "@/constants/query-params"
import UnitOptions from "./ui-options"


// Server-side validation schema
const formSchema = z.object({
  fromValue: z.coerce
    .number({
      required_error: "Value is required",
      invalid_type_error: "Value must be a number",
    })
    .refine((val) => !isNaN(val), {
      message: "Value must be a number",
    }),
  fromUnit: z.string().min(1, { message: "Please select a unit" }),
  toUnit: z.string().min(1, { message: "Please select a unit" }),
})

export default function UnitConverter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL if available
  const initialUnitType = searchParams.get(QUERY_PARAMS.TYPE) || UNIT_TYPES.LENGTH
  const initialFromValue = searchParams.get(QUERY_PARAMS.VALUE) ? Number.parseFloat(searchParams.get(QUERY_PARAMS.VALUE) as string) : 0
  const initialFromUnit = searchParams.get(QUERY_PARAMS.FROM) || ""
  const initialToUnit = searchParams.get(QUERY_PARAMS.TO) || ""


  const [unitType, setUnitType] = useAtom(unitTypeAtom)
  const [fromUnit, setFromUnit] = useAtom(fromUnitAtom)
  const [toUnit, setToUnit] = useAtom(toUnitAtom)
  const [result, setResult] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  // Initialize state from URL params
  useEffect(() => {
    setUnitType(initialUnitType)
    setFromUnit(initialFromUnit)
    setToUnit(initialToUnit)
  }, [searchParams])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromValue: initialFromValue,
      fromUnit: initialFromUnit,
      toUnit: initialToUnit,
    },
  });

  // Update form values when units change
  useEffect(() => {
    form.setValue("fromUnit", fromUnit)
    form.setValue("toUnit", toUnit)

    // Update URL when units change
    if (fromUnit || toUnit) {
      updateUrl(unitType, form.getValues("fromValue"), fromUnit, toUnit)
    }
  }, [fromUnit, toUnit, form, unitType])

  // Update URL with current state
  const updateUrl = (type: string, value: number, from: string, to: string) => {
    const params = new URLSearchParams()
    if (type) params.set(QUERY_PARAMS.TYPE, type)
    if (value) params.set(QUERY_PARAMS.VALUE, value.toString())
    if (from) params.set(QUERY_PARAMS.FROM, from)
    if (to) params.set(QUERY_PARAMS.TO, to)

    // Replace current URL with new params
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // Perform initial conversion if all parameters are present
  useEffect(() => {
    if (initialFromValue && initialFromUnit && initialToUnit) {
      handleConversion(initialFromValue, initialFromUnit, initialToUnit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFromValue, initialFromUnit, initialToUnit])

  async function handleConversion(value: number, from: string, to: string) {
    try {
      setIsLoading(true)
      const convertedValue = await convertUnit(unitType, from, to, value)
      setResult(convertedValue)
    } catch (error) {
      console.error("Conversion error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleConversion(values.fromValue, values.fromUnit, values.toUnit)
    // Update URL with current state
    updateUrl(unitType, values.fromValue, values.fromUnit, values.toUnit)
  }

  // For non-JS fallback
  function onSubmitNoJS(e: React.FormEvent<HTMLFormElement>) {
    // This will be handled by the server if JS is disabled
    // The form will submit and reload the page with the new URL parameters
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Unit Converter</CardTitle>
        <CardDescription>Convert between different units</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={initialUnitType}
          value={unitType}
          onValueChange={(value) => setUnitType(value)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value={UNIT_TYPES.LENGTH}>Length</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.TEMPERATURE}>Temperature</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.WEIGHT}>Weight</TabsTrigger>
            <TabsTrigger value={UNIT_TYPES.CURRENCY}>Currency</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                form.handleSubmit(onSubmit)(e)
                // For non-JS fallback
                if (typeof window === "undefined") {
                  onSubmitNoJS(e)
                }
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
                          onChange={(e) => {
                            field.onChange(e)
                            // Auto-convert on value change if both units are selected
                            if (fromUnit && toUnit) {
                              setTimeout(() => form.handleSubmit(onSubmit)(), 100)
                              // Update URL
                              updateUrl(unitType, Number.parseFloat(e.target.value) || 0, fromUnit, toUnit)
                            }
                          }}
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
                      <Select
                        onValueChange={(value) => {
                          setFromUnit(value)
                          field.onChange(value)
                          // Auto-convert if both units are selected and we have a value
                          if (toUnit && form.getValues("fromValue")) {
                            setTimeout(() => form.handleSubmit(onSubmit)(), 100)
                          }
                        }}
                        value={fromUnit}
                        name={QUERY_PARAMS.FROM}
                      >
                        <FormControl>
                          <SelectTrigger className={form.formState.errors.fromUnit ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <UnitOptions type={unitType} />
                        </SelectContent>
                      </Select>
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
                    <Select
                      onValueChange={(value) => {
                        setToUnit(value)
                        field.onChange(value)
                        // Auto-convert if both units are selected and we have a value
                        if (fromUnit && form.getValues("fromValue")) {
                          setTimeout(() => form.handleSubmit(onSubmit)(), 100)
                        }
                      }}
                      value={toUnit}
                      name={QUERY_PARAMS.TO}
                    >
                      <FormControl>
                        <SelectTrigger className={form.formState.errors.toUnit ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <UnitOptions type={unitType} />
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-muted rounded-md text-center">
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
              </div>

              {/* Submit button for non-JS fallback */}
              <noscript>
                <button type="submit" className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md">
                  Convert
                </button>
              </noscript>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
