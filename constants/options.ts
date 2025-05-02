import { UNIT_TYPES } from "./unit-types";

const LENGTH_OPTIONS = {
    mm: "mm",
    cm: "cm",
    m: "m",
    km: "km",
    in: "in",
    ft: "ft",
    yd: "yd",
    mi: "mi"
};

const LENGTH_OPTION_TO_TITLE_MAPPING = {
    [LENGTH_OPTIONS.mm]: "Millimeter (mm)",
    [LENGTH_OPTIONS.cm]: "Centimeter (cm)",
    [LENGTH_OPTIONS.m]: "Meter (m)",
    [LENGTH_OPTIONS.km]: "Kilometer (km)",
    [LENGTH_OPTIONS.in]: "Inch (in)",
    [LENGTH_OPTIONS.ft]: "Foot (ft)",
    [LENGTH_OPTIONS.yd]: "Yard (yd)",
    [LENGTH_OPTIONS.mi]: "Mile (mi)"
};

const TEMPERATURE_OPTIONS = {
    c: "c",
    f: "f",
    k: "k"
};

const TEMPERATURE_OPTION_TO_TITLE_MAPPING = {
    [TEMPERATURE_OPTIONS.c]: "Celsius (°C)",
    [TEMPERATURE_OPTIONS.f]: "Fahrenheit (°F)",
    [TEMPERATURE_OPTIONS.k]: "Kelvin (K)"
};

const WEIGHT_OPTIONS = {
    mg: "mg",
    g: "g",
    kg: "kg",
    oz: "oz",
    lb: "lb"
};

const WEIGHT_OPTION_TO_TITLE_MAPPING = {
    [WEIGHT_OPTIONS.mg]: "Milligram (mg)",
    [WEIGHT_OPTIONS.g]: "Gram (g)",
    [WEIGHT_OPTIONS.kg]: "Kilogram (kg)",
    [WEIGHT_OPTIONS.oz]: "Ounce (oz)",
    [WEIGHT_OPTIONS.lb]: "Pound (lb)"
};

const CURRENCY_OPTIONS = {
    usd: "usd",
    eur: "eur",
    gbp: "gbp",
    jpy: "jpy",
    inr: "inr"
};

const CURRENCY_OPTION_TO_TITLE_MAPPING = {
    [CURRENCY_OPTIONS.usd]: "US Dollar ($)",
    [CURRENCY_OPTIONS.eur]: "Euro (€)",
    [CURRENCY_OPTIONS.gbp]: "British Pound (£)",
    [CURRENCY_OPTIONS.jpy]: "Japanese Yen (¥)",
    [CURRENCY_OPTIONS.inr]: "Indian Rupee (₹)"
};

const OPTIONS = {
    [UNIT_TYPES.LENGTH]: LENGTH_OPTION_TO_TITLE_MAPPING,
    [UNIT_TYPES.TEMPERATURE]: TEMPERATURE_OPTION_TO_TITLE_MAPPING,
    [UNIT_TYPES.WEIGHT]: WEIGHT_OPTION_TO_TITLE_MAPPING,
    [UNIT_TYPES.CURRENCY]: CURRENCY_OPTION_TO_TITLE_MAPPING
};

export default OPTIONS;
export {
    LENGTH_OPTIONS,
    TEMPERATURE_OPTIONS,
    WEIGHT_OPTIONS,
    CURRENCY_OPTIONS
}