import { UNIT_TYPES } from "./unit-types";

const OPTIONS = {
    [UNIT_TYPES.LENGTH]: {
        "mm": "Millimeter (mm)",
        "cm": "Centimeter (cm)",
        "m": "Meter (m)",
        "km": "Kilometer (km)",
        "in": "Inch (in)",
        "ft": "Foot (ft)",
        "yd": "Yard (yd)",
        "mi": "Mile (mi)"
    },
    [UNIT_TYPES.TEMPERATURE]: {
        "c": "Celsius (°C)",
        "f": "Fahrenheit (°F)",
        "k": "Kelvin (K)"
    },
    [UNIT_TYPES.WEIGHT]: {
        "mg": "Milligram (mg)",
        "g": "Gram (g)",
        "kg": "Kilogram (kg)",
        "oz": "Ounce (oz)",
        "lb": "Pound (lb)"
    },
    [UNIT_TYPES.CURRENCY]: {
        "usd": "US Dollar ($)",
        "eur": "Euro (€)",
        "gbp": "British Pound (£)",
        "jpy": "Japanese Yen (¥)",
        "inr": "Indian Rupee (₹)"
    }
};

export default OPTIONS;