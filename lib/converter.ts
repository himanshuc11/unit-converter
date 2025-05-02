import { UNIT_TYPES } from "@/constants/unit-types"

// Currency API endpoint
const CURRENCY_API_URL = "https://api.exchangerate-api.com/v4/latest/"

// Conversion factors for different unit types
const conversionFactors = {
  length: {
    // Base unit: meter (m)
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
  },
  weight: {
    // Base unit: kilogram (kg)
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    t: 1000,
    oz: 0.0283495,
    lb: 0.453592,
    st: 6.35029,
  },
  temperature: {
    // Special case, handled separately
    c: 0,
    f: 0,
    k: 0,
  },
  currency: {
    // Fetched from API
  },
}

// Convert temperature (special case)
function convertTemperature(fromUnit: string, toUnit: string, value: number): number {
  // Convert to Celsius first (as base unit)
  let celsius: number

  switch (fromUnit) {
    case "c":
      celsius = value
      break
    case "f":
      celsius = (value - 32) * (5 / 9)
      break
    case "k":
      celsius = value - 273.15
      break
    default:
      throw new Error("Invalid temperature unit")
  }

  // Convert from Celsius to target unit
  switch (toUnit) {
    case "c":
      return celsius
    case "f":
      return celsius * (9 / 5) + 32
    case "k":
      return celsius + 273.15
    default:
      throw new Error("Invalid temperature unit")
  }
}

// Fetch currency rates
async function fetchCurrencyRates(baseUnit: string): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${CURRENCY_API_URL}${baseUnit}`)
    const data = await response.json()
    return data.rates
  } catch (error) {
    console.error("Error fetching currency rates:", error)
    throw new Error("Failed to fetch currency rates")
  }
}

// Main conversion function
export async function convertUnit(unitType: string, fromUnit: string, toUnit: string, value: number): Promise<number> {
  // Validate input
  if (unitType === UNIT_TYPES.WEIGHT || unitType === UNIT_TYPES.LENGTH) {
    if (value < 0) {
      throw new Error(`Negative ${unitType} values are not allowed`)
    }
  }

  // Handle temperature conversion (special case)
  if (unitType === UNIT_TYPES.TEMPERATURE) {
    return convertTemperature(fromUnit, toUnit, value)
  }

  // Handle currency conversion
  if (unitType === UNIT_TYPES.CURRENCY) {
    const rates = await fetchCurrencyRates(fromUnit)
    return value * (rates[toUnit.toUpperCase()] ?? rates[toUnit])
  }

  // Handle standard conversions (length, weight)
  const factors = conversionFactors[unitType as keyof typeof conversionFactors]
  if (!factors) {
    throw new Error(`Unknown unit type: ${unitType}`)
  }

  const fromFactor = factors[fromUnit as keyof typeof factors]
  const toFactor = factors[toUnit as keyof typeof factors]

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error(`Unknown unit: ${fromUnit} or ${toUnit}`)
  }

  // Convert to base unit, then to target unit
  const valueInBaseUnit = value * fromFactor
  return valueInBaseUnit / toFactor
}
