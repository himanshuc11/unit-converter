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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { unitTypeAtom, fromUnitAtom, toUnitAtom } from "@/lib/atoms"
import { convertUnit } from "@/lib/converter"

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
  const initialUnitType = searchParams.get("type") || "length"
  const initialFromValue = searchParams.get("value") ? Number.parseFloat(searchParams.get("value") as string) : 0
  const initialFromUnit = searchParams.get("from") || ""
  const initialToUnit = searchParams.get("to") || ""

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
  }, [initialUnitType, initialFromUnit, initialToUnit, setUnitType, setFromUnit, setToUnit])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromValue: initialFromValue,
      fromUnit: initialFromUnit,
      toUnit: initialToUnit,
    },
  })

  // Reset form when unit type changes
  useEffect(() => {
    form.reset({
      fromValue: form.getValues("fromValue"),
      fromUnit: "",
      toUnit: "",
    })
    setFromUnit("")
    setToUnit("")
    setResult(null)

    // Update URL
    updateUrl(unitType, form.getValues("fromValue"), "", "")
  }, [unitType, form])

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
    params.set("type", type)
    params.set("value", value.toString())
    if (from) params.set("from", from)
    if (to) params.set("to", to)

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
            <TabsTrigger value="length">Length</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
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
              <input type="hidden" name="type" value={unitType} />

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
                          name="value"
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
                        name="from"
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
                      name="to"
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

function UnitOptions({ type }: { type: string }) {
  switch (type) {
    case "length":
      return (
        <>
          <SelectItem value="mm">Millimeter (mm)</SelectItem>
          <SelectItem value="cm">Centimeter (cm)</SelectItem>
          <SelectItem value="m">Meter (m)</SelectItem>
          <SelectItem value="km">Kilometer (km)</SelectItem>
          <SelectItem value="in">Inch (in)</SelectItem>
          <SelectItem value="ft">Foot (ft)</SelectItem>
          <SelectItem value="yd">Yard (yd)</SelectItem>
          <SelectItem value="mi">Mile (mi)</SelectItem>
        </>
      )
    case "temperature":
      return (
        <>
          <SelectItem value="c">Celsius (°C)</SelectItem>
          <SelectItem value="f">Fahrenheit (°F)</SelectItem>
          <SelectItem value="k">Kelvin (K)</SelectItem>
        </>
      )
    case "weight":
      return (
        <>
          <SelectItem value="mg">Milligram (mg)</SelectItem>
          <SelectItem value="g">Gram (g)</SelectItem>
          <SelectItem value="kg">Kilogram (kg)</SelectItem>
          <SelectItem value="t">Metric Ton (t)</SelectItem>
          <SelectItem value="oz">Ounce (oz)</SelectItem>
          <SelectItem value="lb">Pound (lb)</SelectItem>
          <SelectItem value="st">Stone (st)</SelectItem>
        </>
      )
    case "currency":
      return (
        <>
          <SelectItem value="USD">US Dollar (USD)</SelectItem>
          <SelectItem value="EUR">Euro (EUR)</SelectItem>
          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
          <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
          <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
          <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
          <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
          <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
        </>
      )
    default:
      return null
  }
}
